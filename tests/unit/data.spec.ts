
describe('test the TaskPermissionsService', () => {
    const projectId = 'projectId';

    const userId = 'userId';

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('hasEditPermission', () => {
        describe('when user is not assigned to task', () => {
            it('should return false', async () => {
                expect(true).toBeTruthy();
            });
        });
    });
});
