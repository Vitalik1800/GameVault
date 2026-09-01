describe('GameVault test environment', () => {
    test('Jest is configured correctly', () => {
        expect(true).toBe(true);
    });

    test('Node.js environment is available', () => {
        expect(process).toBeDefined();
        expect(process.version).toBeDefined();
    })
});