/**
 * Asynchronously retrieves the initialization options for the current application
 * with an additional generic property `userAppConfigArgs`.
 *
 * @template T The type of the `userAppConfigArgs` property.
 *
 * @return {Promise<{ initialOptions: any; userAppConfigArgs: T }>} An object containing the initial options of the application
 * and the user application configuration arguments.
 */
export const getInitAppOptions = async <T>() => {
    const app = fin.Application.getCurrentSync();
    const appInfo = await app.getInfo();

    const customInitOptions = {
        ...appInfo.initialOptions,
        userAppConfigArgs: {} as T,
    };

    return customInitOptions;
};
