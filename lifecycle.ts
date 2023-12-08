import type { WorkspacePlatformModule } from "@openfin/workspace-platform";
import type { Lifecycle, LifecycleEventMap } from "workspace-platform-starter/shapes/lifecycle-shapes";
import type { Logger, LoggerCreator } from "workspace-platform-starter/shapes/logger-shapes";
import type { ModuleDefinition, ModuleHelpers } from "workspace-platform-starter/shapes/module-shapes";

/**
 * Implementation for the apply default workspace lifecycle provider.
 */
export class ApplyDefaultWorkspaceProvider implements Lifecycle {
    /**
     * The logger for displaying information from the module.
     * Ensured to be non-nullable.
     */
    private _logger: Logger;

    /**
     * Helper methods for the module.
     * Ensured to be non-nullable.
     */
    private _helpers: ModuleHelpers;

    /**
     * Initialize the module.
     * @param definition The definition of the module from configuration include custom options.
     * @param loggerCreator For logging entries.
     * @param helpers Helper methods for the module to interact with the application core.
     * @returns Nothing.
     */
    public async initialize(
        definition: ModuleDefinition,
        loggerCreator: LoggerCreator,
        helpers: ModuleHelpers
    ): Promise<void> {
        this._logger = loggerCreator("ApplyDefaultWorkspaceProvider");
        this._helpers = helpers;
        this._logger.info("ApplyDefaultWorkspaceProvider initialized");
    }

    /**
     * Get the lifecycle events.
     * @returns The map of lifecycle events.
     */
    public async get(): Promise<LifecycleEventMap> {
        const lifecycleMap: LifecycleEventMap = {};

        lifecycleMap["after-bootstrap"] = async (
            platform: WorkspacePlatformModule,
            customData?: unknown
        ): Promise<void> => {
            try {
                const currentWorkspace = localStorage.getItem('current-workspace');
                if (currentWorkspace) {
                    const workspaceData = JSON.parse(currentWorkspace);
                    await platform.applyWorkspace(workspaceData);
                    this._logger.info("Workspace applied from local storage.");
                } else {
                    this._logger.info("No 'current-workspace' key found in local storage.");
                }
            } catch (error) {
                this._logger.error("Error in 'after-bootstrap':", error);
            }
        };

        lifecycleMap["before-quit"] = async (
            platform: WorkspacePlatformModule,
            customData?: unknown
        ): Promise<void> => {
            try {
                const currentWorkspaceState = await platform.getWorkspace();
                localStorage.setItem('current-workspace', JSON.stringify(currentWorkspaceState));
                this._logger.info("Current workspace state saved to local storage.");
            } catch (error) {
                this._logger.error("Error in 'before-quit':", error);
                // Consider whether to allow quit in case of error
            }
        };

        return lifecycleMap;
    }
}
