import { Environment } from "./file";

/**
 * Determines the host URL based on the provided environment.
 * 
 * @param {Environment} ENV - The environment for which the host URL is to be generated.
 * 
 * @returns {string} The host URL for the given environment.
 */
export function getHost(ENV: Environment): string {
    if (ENV === Environment.LOCAL) {
        // Replace with your Vite local server URL (e.g., http://localhost:3000)
        return 'http://localhost:3000';
    }
    return `${ENV}.ficc.uistack.workstation_https`;
}

/**
 * Returns customized settings based on the provided environment (ENV).
 * 
 * @param {Environment} ENV - The environment for which the settings are to be generated.
 * 
 * @returns {object} An object representing openfin CustomSettings
 */
export function getCustomSettings(ENV: Environment) {
    return {
        apiUrl: `https://api.${ENV}.example.com`,
        featureFlag: true,
    };
}
