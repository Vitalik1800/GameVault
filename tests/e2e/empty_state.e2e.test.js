const {
    Builder,
    By
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('GameVault E2E - Empty State', () => {
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

    test('shows empty state when search has no results', async () => {
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
            'GameVaultDefinitelyDoesNotExist999'
        );

        await driver.sleep(300);

        const gameLibrary =
            await driver.findElement(
                By.id('game_library')
            );

        const emptyStates =
            await gameLibrary.findElements(
                By.css('.empty_state')
            );

        expect(emptyStates).toHaveLength(1);

        expect(
            await emptyStates[0].isDisplayed()
        ).toBe(true);

        const gameCards = 
            await driver.findElements(
                By.css('.game_card')
            );

        expect(gameCards).toHaveLength(0);
    });
});