// Required Node.js module imports
import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { getCustomSettings } from './customSettings';  // Importing the function from customSettings.ts

export enum Environment {
    DEVELOP = "dev",
    QA = "qa",
    UAT = "uat",
    MASTER = "prod",
    LOCAL = "local"
}

// Obtain the current Git branch name
// If the branch name is not retrieved, default to "local"
const branchName: string = (execSync("git rev-parse --abbrev-ref HEAD").toString().trim()) ?? Environment.LOCAL;

// Mapping of Git branch names to their corresponding environments
const branchs: { [key: string]: Environment } = {
    develop: Environment.DEVELOP,
    qa: Environment.QA,
    uat: Environment.UAT,
    master: Environment.MASTER
};

// Determine the environment based on the Git branch name
// Default to "local" if the branch name is not found in the branchs mapping
const ENV: Environment = branchs[branchName] ?? Environment.LOCAL;

// Configuration JSON structure
const configuration = {
    customSettings: getCustomSettings(ENV),  // Use the function to get custom settings based on ENV
    "platform": {
        // ... (omitted for brevity)
    }
};

// Write the configuration to an environment-specific JSON file
// The file will be named as "openfin.manifest.{ENV}.json", where {ENV} is the determined environment
const filePath = `public/openfin.manifest.${ENV}.json`;
writeFileSync(filePath, JSON.stringify(configuration, null, 2), 'utf-8');

// Output the path of the created file to the console
console.log(`Configuration written to ${filePath}`);
