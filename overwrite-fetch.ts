import { getAppIdsFromManifest } from './getAppIdsFromManifest.js';

describe('getAppIdsFromManifest', () => {
  test('should extract app IDs correctly from a valid manifest', () => {
    const testManifest = JSON.stringify({
      workspacePlatform: [
        { componentState: { name: "app1" } },
        { componentState: { name: "app2" } }
      ]
    });
    const result = getAppIdsFromManifest(testManifest);
    expect(result).toEqual(["app1", "app2"]);
  });

  test('should return an empty array for an empty manifest', () => {
    const emptyManifest = JSON.stringify({});
    const result = getAppIdsFromManifest(emptyManifest);
    expect(result).toEqual([]);
  });

  test('should handle malformed JSON gracefully', () => {
    const malformedManifest = "{ workspacePlatform: [ { componentState: { name: 'app1' } } ]"; // JSON inválido
    const result = getAppIdsFromManifest(malformedManifest);
    expect(result).toEqual([]);
  });
});


import { swapComponentStateUrl } from './swapComponentStateUrl';

describe('swapComponentStateUrl', () => {
  test('should update URLs correctly when matching app IDs are found', () => {
    const testManifest = JSON.stringify({
      workspacePlatform: [
        { componentState: { name: "app1", url: "oldUrl", initialUrl: "initUrl" } },
        { componentState: { name: "app2", url: "oldUrl2", initialUrl: "initUrl2" } }
      ]
    });

    const apps = [
      { appId: "app1", hostManifests: { OpenFin: { details: { url: "newUrl1" } } } },
      { appId: "app2", hostManifests: { OpenFin: { details: { url: "newUrl2" } } } }
    ];

    const result = JSON.parse(swapComponentStateUrl(testManifest, apps));

    expect(result.workspacePlatform[0].componentState.url).toBe("newUrl1");
    expect(result.workspacePlatform[1].componentState.url).toBe("newUrl2");
  });

  test('should not update URLs when preserveUrlState is true', () => {
    const testManifest = JSON.stringify({
      workspacePlatform: [
        { componentState: { name: "app1", url: "oldUrl", initialUrl: "initUrl" } }
      ]
    });

    const apps = [
      { appId: "app1", hostManifests: { OpenFin: { details: { url: "newUrl", preserveUrlState: true } } } }
    ];

    const result = JSON.parse(swapComponentStateUrl(testManifest, apps));

    expect(result.workspacePlatform[0].componentState.url).toBe("oldUrl");
  });

  test('should return the same manifest if no matching app IDs are found', () => {
    const testManifest = JSON.stringify({
      workspacePlatform: [
        { componentState: { name: "app1", url: "oldUrl", initialUrl: "initUrl" } }
      ]
    });

    const apps = [
      { appId: "app2", hostManifests: { OpenFin: { details: { url: "newUrl" } } } }
    ];

    const result = JSON.parse(swapComponentStateUrl(testManifest, apps));

    expect(result.workspacePlatform[0].componentState.url).toBe("oldUrl");
  });

  test('should handle an empty manifest gracefully', () => {
    const emptyManifest = JSON.stringify({});
    const apps = [];

    const result = swapComponentStateUrl(emptyManifest, apps);

    expect(result).toBe(JSON.stringify({}));
  });

  test('should handle malformed JSON gracefully', () => {
    const malformedManifest = "{ workspacePlatform: [ { componentState: { name: 'app1' } } ]"; // JSON inválido
    const apps = [];

    expect(() => swapComponentStateUrl(malformedManifest, apps)).toThrow();
  });
});
