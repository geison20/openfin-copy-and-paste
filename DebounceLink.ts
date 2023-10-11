import { ApolloLink, Operation, FetchResult, Observable } from '@apollo/client';
import { debounce } from 'lodash';

class DebounceLink extends ApolloLink {
    private defaultDelay: number;
    private pendingOperations: Record<string, (op?: Operation) => void> = {};

    /**
     * Constructor for the DebounceLink.
     * @param defaultDelay - Default delay in milliseconds for the debounce.
     */
    constructor(defaultDelay: number = 300) {
        super();
        this.defaultDelay = defaultDelay;
    }

    /**
     * Requests an operation after the debounce period.
     * @param operation - The GraphQL operation being requested.
     * @param forward - Function to proceed with the next step of the request (typically the actual request execution).
     * @returns An observable of the response.
     */
    request(operation: Operation, forward: (op: Operation) => Observable<FetchResult>): Observable<FetchResult> {
        return new Observable(observer => {
            // Retrieve the debounce key and delay from the operation's context.
            const context = operation.getContext();
            const debounceKey = context.debounceKey || operation.operationName || 'defaultKey';
            const delay = context.delay || this.defaultDelay;

            // If there's a pending operation with the same key, cancel it.
            if (this.pendingOperations[debounceKey]) {
                this.pendingOperations[debounceKey]();
            }

            // Debounce the operation execution.
            const debounced = debounce((op: Operation) => {
                const handle = forward(op).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer)
                });

                return () => {
                    handle.unsubscribe();
                };
            }, delay);

            this.pendingOperations[debounceKey] = debounced;
            const cleanup = debounced(operation);

            return () => {
                cleanup();
                this.pendingOperations[debounceKey] = undefined;
            };
        });
    }
}
