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
