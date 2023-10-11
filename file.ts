import { execSync } from "child_process";

/**
 * Represents possible environments based on branch names.
 */
export enum Environment {
    DEV = "dev",
    QA = "qa",
    UAT = "uat",
    PROD = "prod",
    LOCAL = "local"
}

/**
 * Mapping of git branch names to corresponding environments.
 */
const branchToEnvironmentMap: { [key: string]: Environment } = {
    develop: Environment.DEV,
    qa: Environment.QA,
    uat: Environment.UAT,
    master: Environment.PROD
};

/**
 * Returns the current branch name.
 * 
 * @returns {string} The name of the current branch, or the value of BRANCH_NAME environment variable if set.
 */
export function getCurrentBranch(): string {
    return process.env.BRANCH_NAME ?? execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
}

/**
 * Determines the environment based on the current branch.
 * 
 * @returns {Environment} The corresponding environment for the current branch or LOCAL if the branch is not recognized.
 */
export function getEnvironment(): Environment {
    const currentBranch = getCurrentBranch();
    return branchToEnvironmentMap[currentBranch] ?? Environment.LOCAL;
}

/**
 * The detected environment based on the current branch.
 */
const ENV: Environment = getEnvironment();
