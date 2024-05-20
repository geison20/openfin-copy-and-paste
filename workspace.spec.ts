describe('When POST to /api/v1/workspaces fails', () => {
    const invalidWorkspaces = [
        { ...generateMockWorkspaces(), title: null },
        { ...generateMockWorkspaces(), snapshot: null },
        { ...generateMockWorkspaces(), workspaceId: null }
    ];

    invalidWorkspaces.forEach((invalidWorkspace, index) => {
        describe(`Property '${Object.keys(invalidWorkspace).find(key => invalidWorkspace[key] === null)}' is required`, () => {
            let response: AxiosResponse;

            beforeAll(async () => {
                response = await axios.post(`/api/v1/workspaces`, invalidWorkspace).catch(e => e.response);
                console.log('Workspace Invalid: ', util.inspect(response, { colors: true }));
            });

            it(`Should receive 400 with 'Bad Request' for missing '${Object.keys(invalidWorkspace).find(key => invalidWorkspace[key] === null)}'`, async () => {
                expect(response.status).toBe(400);
                expect(response.statusText).toMatch('Bad Request');
            });

            it(`Should receive response with invalid data for missing '${Object.keys(invalidWorkspace).find(key => invalidWorkspace[key] === null)}'`, async () => {
                expect(response.data).toEqual({
                    statusCode: 400,
                    error: 'Bad Request',
                    message: `body/${Object.keys(invalidWorkspace).find(key => invalidWorkspace[key] === null)} must be string`
                });
            });
        });
    });
});
