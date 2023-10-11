// overwrite-fetch.ts

// Keep a reference to the original fetch function
const originalFetch = window.fetch;

// Overwrite the global fetch method to always include the "credentials" option
window.fetch = function (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    // Convert URL object to string if necessary
    const requestInput: RequestInfo = input instanceof URL ? input.toString() : input;

    return originalFetch(requestInput, {
        ...init,
        credentials: 'include',
    });
};
