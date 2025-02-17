export const updateUserPrefsTransaction = async (
  mongoClient: AppMongoClient,
  args: UpdateUserPreferencesArgs[]
): Promise<UserPreference[]> => {
  const mongoDatabase = mongoClient.getDatabase();
  const timestamp = new Date().toISOString();

  const updateOperations = args.map(async ({ user, namespace, key, value }) => {
    let finalValue = value;

    if (namespace === NAMESPACES.WORKSPACE || namespace === NAMESPACES.PAGE) {
      const appIdsFromManifest = getAppIdsFromManifest(value).map(appId => appId.split("/")[0]);

      const apps = await mongoDatabase
        .collection("apps")
        .find<AppDefinition>({ appId: { $in: appIdsFromManifest } })
        .toArray();

      if (apps.length > 0) {
        const appIdsToSwap = appIdsFromManifest.filter(appId =>
          apps.some(({ appId: existingId }) => existingId === appId)
        );

        if (appIdsToSwap.length > 0) {
          finalValue = swapComponentStateUrl(value, apps);
        }
      }
    }

    await mongoDatabase.collection<UserPreference>(mongoClient.collection).updateOne(
      { user, namespace, key },
      { $set: { user, namespace, key, value: finalValue, timestamp } },
      { upsert: true }
    );
  });

  await Promise.all(updateOperations);

  return mongoDatabase
    .collection<UserPreference>(mongoClient.collection)
    .find({ user: { $in: args.map(a => a.user) } }) // Retorna todas as preferências associadas aos usuários processados
    .toArray();
};
