const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('GameVault E2E - Browser and Server Errors', () => {
    let driver;

    beforeAll(async () => {
        const options = new chrome.Options();

        options.setLoggingPrefs({
            browser: 'ALL'
        });

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    test('loads application without browser console errors', async () => {
        await driver.get(
            'http://localhost:3000'
        );

        await driver.sleep(500);

        const logs = 
            await driver.manage().logs().get('browser');

        const severeLogs = logs.filter(
            (log) => log.level.name === 'SEVERE'
        );

        expect(severeLogs).toHaveLength(0);
    });

    test('loads library without browser console errors', async () => {
        await driver.get(
            'http://localhost:3000'
        );

        const libraryNavigationItem = 
            await driver.findElement(
                By.id('library_nav_item')
            );

        await libraryNavigationItem.click();

        await driver.sleep(500);

        const logs = 
            await driver.manage().logs().get('browser');

        const severeLogs = logs.filter(
            (log) => log.level.name === 'SEVERE'
        );

        expect(severeLogs).toHaveLength(0);
    });

    test('search works without browser console errors', async () => {
        await driver.get(
            'http://localhost:3000'
        );

        const libraryNavigationItem = 
            await driver.findElement(
                By.id('library_nav_item')
            );

        await libraryNavigationItem.click();

        const searchInput = 
            await driver.findElement(
                By.id('search_input')
            );

        await searchInput.clear();

        await searchInput.sendKeys(
            'witcher'
        );

        await driver.sleep(500);

        const logs = 
            await driver.manage().logs().get('browser');

        const severeLogs = logs.filter(
            (log) => log.level.name === 'SEVERE'
        );

        expect(severeLogs).toHaveLength(0);
    });

    test('API requests return successful responses', async () => {
        await driver.get(
            'http://localhost:3000'
        );

        const apiResults = 
            await driver.executeAsyncScript(`
                const callback = arguments[arguments.length - 1];
                
                Promise.all([
                    fetch('/api/games'),
                    fetch('/api/games/stats'),
                    fetch('/api/games/wishlist')
                ])
                    .then((responses) => {
                        callback(
                            responses.map(
                                (response) => response.ok
                            )
                        );
                    })
                    .catch(() => {
                        callback(null); 
                    });
            `);

        expect(apiResults).not.toBeNull();

        expect(apiResults).toEqual([
            true,
            true,
            true
        ]);
    });
});