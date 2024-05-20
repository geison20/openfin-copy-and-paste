describe('When POST to /api/v1/workspaces fails', () => {
    const invalidWorkspaces = [
        { description: "title is required", data: { ...generateMockWorkspaces(), title: null }, missingField: 'title' },
        { description: "snapshot is required", data: { ...generateMockWorkspaces(), snapshot: null }, missingField: 'snapshot' },
        { description: "workspaceId is required", data: { ...generateMockWorkspaces(), workspaceId: null }, missingField: 'workspaceId' }
    ];

    test.each(invalidWorkspaces)(
        'Should receive 400 with "Bad Request" when $description',
        async ({ data, missingField }) => {
            let response: AxiosResponse;
            response = await axios.post(`/api/v1/workspaces`, data).catch(e => e.response);

            console.log('Workspace Invalid: ', util.inspect(response, { colors: true }));

            expect(response.status).toBe(400);
            expect(response.statusText).toMatch('Bad Request');
            expect(response.data).toEqual({
                statusCode: 400,
                error: 'Bad Request',
                message: `body/${missingField} must be string`
            });
        }
    );
});
