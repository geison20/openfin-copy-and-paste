import { Commands as HttpCommands } from "@spaces-modules/modules/integrations/http/shapes";
import { Commands as TickersCommands } from "@spaces-modules/modules/integrations/tickers/shapes";
import { Commands as WorkspacesCommands } from "@spaces-modules/modules/integrations/workspaces/shapes";
import { isEmptyQuery } from "@spaces-modules/utils";

export type IntegrationCommands = HttpCommands | WorkspacesCommands | TickersCommands;

/**
 * Utility class to validate and process command-like queries.
 */
class IntegrationUtils {
    static SYSTEM_COMMANDS = ["/", "http://", "https://"];

    /**
     * Determines if a given query starts with a command.
     * 
     * @param query - The query string to be checked.
     * @returns True if the query starts with a command, false otherwise.
     */
    static queryBeginsWithCommand(query: string): boolean {
        return IntegrationUtils.SYSTEM_COMMANDS.some(command => query.startsWith(command));
    }

    /**
     * Finds a matching command from the provided commands enum that the query starts with.
     * 
     * @param query - The query string to be checked.
     * @param commands - Enum of valid commands.
     * @returns Returns the matching command if found, otherwise undefined.
     */
    static findMatchingCommand(query: string, commands: IntegrationCommands): string | undefined {
        for (const command of IntegrationUtils.SYSTEM_COMMANDS) {
            if (command === "/") {
                if (query.startsWith(`${command} `)) {
                    return command;
                }
            } else if (query.startsWith(command)) {
                return command;
            }
        }

        if (commands) {
            return Object.values<string>(commands).find(command => query.startsWith(command));
        }

        return undefined;
    }

    /**
     * Validates a given query to see if it's a valid command.
     * It checks for predefined command presence and ensures the content
     * after the command meets the specified minimum length.
     * 
     * @param query - The query string to be checked.
     * @param commands - Enum of valid commands.
     * @param queryMinLength - Minimum required length after the command.
     * @returns True if the query is a valid command, false otherwise.
     */
    static isValidQuery(query: string, commands: IntegrationCommands, queryMinLength: number = 3): boolean {
        if (isEmptyQuery(query)) return false;

        if (!IntegrationUtils.queryBeginsWithCommand(query)) {
            // If it doesn't begin with a command, only validate based on minimum length
            return query.length >= queryMinLength;
        }

        const detectedCommand = IntegrationUtils.findMatchingCommand(query, commands);

        return detectedCommand ? IntegrationUtils.hasSufficientQueryContent(query, detectedCommand, queryMinLength) : false;
    }

    /**
     * Extracts the content after a detected command from the given query.
     * 
     * @param query - The full query string.
     * @param commandOrCommands - The detected command or list of possible commands in the query.
     * @returns An object containing content after the command and the detected command itself. Returns the original query if no matching command is found.
     */
    static getQueryContent(query: string, commandOrCommands: string | IntegrationCommands): { queryContent: string, command?: string } {
        // If we're given a singular command
        if (typeof commandOrCommands === 'string') {
            return {
                queryContent: query.substring(commandOrCommands.length).trim(),
                command: commandOrCommands
            };
        }

        // If we're given a list of commands
        const detectedCommand = IntegrationUtils.findMatchingCommand(query, commandOrCommands);

        if (detectedCommand) {
            return {
                queryContent: query.substring(detectedCommand.length).trim(),
                command: detectedCommand
            };
        }

        // Return the original query if no matching command is found
        return { queryContent: query };
    }

    /**
     * Validates if the content after a detected command meets the specified minimum length.
     * This is a private method used internally for command validation.
     * 
     * @param query - The query string to be checked.
     * @param command - The detected command in the query.
     * @param minLength - Minimum required length after the command.
     * @returns True if content length after the command is sufficient, false otherwise.
     */
    private static hasSufficientQueryContent(query: string, command: string, minLength: number): boolean {
        const { queryContent } = IntegrationUtils.getQueryContent(query, command);

        return queryContent.length >= minLength;
    }
}

export default IntegrationUtils;
