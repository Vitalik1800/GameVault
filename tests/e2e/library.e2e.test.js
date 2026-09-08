const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

describe('GameVault E2E - Library', () => {
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

    test('opens Dashboard successfully', async () => {
        await driver.get('http://localhost:3000');

        const dashboard = await driver.wait(
            until.elementLocated(
                By.css('.dashboard')
            ),
            5000
        );

        expect(await dashboard.isDisplayed())
            .toBe(true);
    });

    test('opens Library successfully', async () => {
        const libraryNavigationItem = 
            await driver.findElement(
                By.id('library_nav_item')
            );

        await libraryNavigationItem.click();

        const library = await driver.wait(
            until.elementLocated(
                By.css('.library')
            ),
            5000
        );

        expect(await library.isDisplayed())
            .toBe(true);
    });

    test('displays game cards in Library', async () => {
        const gameCards = await driver.findElements(
            By.css('.game_card')
        );

        expect(gameCards.length)
            .toBeGreaterThan(0);
    });
});