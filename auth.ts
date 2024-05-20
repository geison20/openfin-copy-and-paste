import { fin } from "@openfin/core";
import type { AuthEventTypes, AuthProvider } from "workspace-platform-starter/shapes/auth-shapes";
import type { Logger, LoggerCreator } from "workspace-platform-starter/shapes/logger-shapes";
import type { ModuleDefinition, ModuleHelpers } from "workspace-platform-starter/shapes/module-shapes";
import { isEmpty, randomUUID } from "workspace-platform-starter/utils";

import { UserDetails, getUserDetails } from "@gmui/middletier";

const USER_KEY: string = `${fin.me.identity.uuid}-CURRENT-USER`

export function clearCurrentUser(): void {
    localStorage.removeItem(USER_KEY);
}

/**
 * Get the current user from local storage.
 * @returns The current user or null if not found.
 */
function getCurrentUser(): UserDetails | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

/**
 * Example authentication provider.
 */
export class ExampleAuthProvider implements AuthProvider {
    /**
     * The logger for displaying information from the module.
     * @internal
     */
    private _logger?: Logger;

    /**
     * Map a subscription id to an event.
     * @internal
     */
    private readonly _subscribeIdMap: { [key: string]: AuthEventTypes };

    /**
     * Callbacks for event subscribers.
     * @internal
     */
    private readonly _eventSubscribers: { [event in AuthEventTypes]?: { [id: string]: () => Promise<void> } };

    /**
     * The key for the authenticated user.
     * @internal
     */
    private _authenticatedKey: string = `${fin.me.identity.uuid}-IS-AUTHENTICATED-USER`

    /**
     * The current user.
     * @internal
     */
    private _currentUser?: UserDetails;

    /**
     * Are we authenticated.
     * @internal
     */
    private _authenticated?: boolean;

    /**
     * Create a new instance of ExampleAuthProvider.
     */
    constructor() {
        this._subscribeIdMap = {};
        this._eventSubscribers = {};
    }

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
        this._logger = loggerCreator("AuthExample");
        this._authenticated = Boolean(localStorage.getItem(this._authenticatedKey));

        if (this._authenticated) {
            this._currentUser = getCurrentUser();
        }
    }

    /**
     * Subscribe to one of the auth events.
     * @param to The event to subscribe to.
     * @param callback The callback to fire when the event occurs.
     * @returns Subscription id for unsubscribing or undefined if event type is not available.
     */
    public subscribe(to: AuthEventTypes, callback: () => Promise<void>): string | undefined {
        const subscriptionId = randomUUID();

        const toMap = this._eventSubscribers[to] ?? {};
        toMap[subscriptionId] = callback;
        this._eventSubscribers[to] = toMap;

        this._subscribeIdMap[subscriptionId] = to;
        this._logger?.info(`Subscription to ${to} events registered. Subscription Id: ${subscriptionId}`);

        return subscriptionId;
    }

    /**
     * Unsubscribe from an already subscribed event.
     * @param subscriptionId The id of the subscription returned from subscribe.
     * @returns True if the unsubscribe was successful.
     */
    public unsubscribe(subscriptionId: string): boolean {
        const eventType = this._subscribeIdMap[subscriptionId];
        if (isEmpty(eventType)) {
            this._logger?.warn(`You have tried to unsubscribe with a key ${subscriptionId} that is invalid`);
            return false;
        }

        const eventSubscribers = this._eventSubscribers[eventType];
        if (!isEmpty(eventSubscribers)) {
            delete eventSubscribers[subscriptionId];
        }

        if (this._subscribeIdMap[subscriptionId]) {
            delete this._subscribeIdMap[subscriptionId];
            this._logger?.info(
                `Subscription to ${eventType} events with subscription Id: ${subscriptionId} has been cleared`
            );
            return true;
        }

        this._logger?.warn(
            `Subscription to ${eventType} events with subscription Id: ${subscriptionId} could not be cleared as we do not have a register of that event type.`
        );
        return false;
    }

    /**
     * Does the auth provider require authentication.
     * @returns True if authentication is required.
     */
    public async isAuthenticationRequired(): Promise<boolean> {
        return !this._authenticated;
    }

    /**
     * Perform the login operation on the auth provider.
     * @returns True if the login was successful.
     */
    public async login(): Promise<boolean> {
        this._logger?.info("login requested");
        if (this._authenticated) {
            this._logger?.info("User already authenticated");
            return this._authenticated;
        }

        this._authenticated = await this.getAuthenticationFromUser();

        if (this._authenticated) {
            localStorage.setItem(this._authenticatedKey, this._authenticated.toString());
            await this.notifySubscribers("logged-in");
        } else {
            clearCurrentUser();
        }

        return this._authenticated;
    }

    /**
     * Perform the logout operation on the auth provider.
     * @returns True if the logout was successful.
     */
    public async logout(): Promise<boolean> {
        if (!this._authenticated) {
            this._logger?.error("You have requested to log out but are not logged in");
            return false;
        }

        this._logger?.info("Log out requested");
        await this.notifySubscribers("before-logged-out");
        this._authenticated = false;
        localStorage.removeItem(this._authenticatedKey);
        clearCurrentUser();
        await this.notifySubscribers("logged-out");

        return true;
    }

    /**
     * Get user information from the auth provider.
     * @returns The user information.
     */
    public async getUserInfo(): Promise<unknown> {
        if (!this._authenticated) {
            this._logger?.warn("Unable to retrieve user info unless the user is authenticated");
            return;
        }

        return this._currentUser;
    }

    /**
     * Get the authentication from the user.
     * @returns True if authenticated.
     */
    private async getAuthenticationFromUser(): Promise<boolean> {
        try {
            // Try to get the current user from local storage
            this._currentUser = getCurrentUser();

            if (this._currentUser) {
                return true;
            }

            // If not found in local storage, fetch the user
            this._currentUser = await getUserDetails();

            if (this._currentUser) {
                localStorage.setItem(USER_KEY, JSON.stringify(this._currentUser));
                return true;
            }

            return false;
        } catch (error) {
            this._logger?.error("Error while trying to authenticate the user", error);
            return false;
        }
    }

    /**
     * Notify subscribers of an event change.
     * @param authEventType The type of authentication event to send to.
     */
    private async notifySubscribers(authEventType: AuthEventTypes): Promise<void> {
        const subscribers = this._eventSubscribers[authEventType];

        if (subscribers) {
            const subscriberIds = Object.keys(subscribers);
            subscriberIds.reverse();

            for (const subscriberId of subscriberIds) {
                this._logger?.info(
                    `Notifying subscriber with subscription Id: ${subscriberId} of event type: ${authEventType}`
                );
                await subscribers[subscriberId]();
            }
        }
    }
}
