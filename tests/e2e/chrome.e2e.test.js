const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('GameVault E2E - Chrome', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(
                new chrome.Options()
            )
            .build();
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    test('opens GameVault in Chrome', async () => {
        await driver.get(
            'http://localhost:3000'
        );

        await driver.wait(
            until.titleIs('GameVault'),
            5000
        );

        expect(
            await driver.getTitle()
        ).toBe('GameVault');

        const dashboard = 
            await driver.findElement(
                By.css('.dashboard')
            );

        expect(
            await dashboard.isDisplayed()
        ).toBe(true);
    });

    test('opens Library in Chrome', async () => {
        const libraryNavigationItem = 
            await driver.findElement(
                By.id('library_nav_item')
            );

        await libraryNavigationItem.click();

        const library = 
            await driver.findElement(
                By.css('.library')
            );

        expect(
            await library.isDisplayed()
        ).toBe(true);
    });

    test('displays game cards in Chrome', async () => {
        const gameLibrary = 
            await driver.findElement(
                By.id('game_library')
            );

        const gameCards = 
            await gameLibrary.findElements(
                By.css('.game_card')
            );

        expect(
            gameCards.length
        ).toBeGreaterThan(0);
    });
});