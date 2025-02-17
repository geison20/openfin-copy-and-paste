import assert from 'assert';
import { getAppIdsFromManifest } from './getAppIdsFromManifest.js'; // ajuste o caminho se necessário

// Teste básico com um manifest válido
const testManifest = JSON.stringify({
    workspacePlatform: [
        {
            componentState: {
                name: "app1"
            }
        },
        {
            componentState: {
                name: "app2"
            }
        }
    ]
});

const emptyManifest = JSON.stringify({});

const malformedManifest = "{ workspacePlatform: [ { componentState: { name: 'app1' } } ]"; // JSON inválido

test('should extract app IDs correctly from a valid manifest', () => {
    const result = getAppIdsFromManifest(testManifest);
    assert.deepStrictEqual(result, ["app1", "app2"]);
});

test('should return an empty array for an empty manifest', () => {
    const result = getAppIdsFromManifest(emptyManifest);
    assert.deepStrictEqual(result, []);
});

test('should handle malformed JSON gracefully', () => {
    const result = getAppIdsFromManifest(malformedManifest);
    assert.deepStrictEqual(result, []);
});
