const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('GameVault E2E - Add Game', () => {
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

    test('adds a new game to the library', async () => {
        await driver.get('http://localhost:3000');

        const addGameNavigationItem = 
            await driver.findElement(
                By.id('add_game_nav_item')
            );

        await addGameNavigationItem.click();

        const addGameModal = await driver.wait(
            until.elementIsVisible(
                driver.findElement(
                    By.id('add_game_modal')
                )
            ),
            5000
        );

        await driver.findElement(
            By.id('title')
        ).sendKeys('E2E Test Game');

        await driver.findElement(
            By.id('description')
        ).sendKeys('Game added by Selenium E2E test');

        await driver.findElement(
            By.id('genre')
        ).sendKeys('RPG');

        await driver.findElement(
            By.id('platform')
        ).sendKeys('PC');

        await driver.findElement(
            By.id('status')
        ).sendKeys('Backlog');

        await driver.findElement(
            By.id('rating')
        ).sendKeys('9');

        await driver.findElement(
            By.id('release_year')
        ).sendKeys('2025');

        await driver.findElement(
            By.id('cover_url')
        ).sendKeys(
            'https://example.com/e2e-test-game.jpg'
        );

        await driver.findElement(
            By.id('add_game_form')
        ).findElement(
            By.css('button[type="submit"]')
        ).click();

        await driver.wait(
            async () => {
                return !(await addGameModal.isDisplayed());
            },
            5000
        );

        const libraryNavigationItem = 
            await driver.findElement(
                By.id('library_nav_item')
            );

        await libraryNavigationItem.click();

        await driver.wait(
            until.elementLocated(
                By.css('.library')
            ),
            5000
        );

        const gameCards = await driver.findElements(
            By.css('.game_card')
        );

        const gameTitles = [];

        for (const card of gameCards) {
            const title = await card.findElement(
                By.css('.game_title')
            );

            gameTitles.push(
                await title.getText()
            );
        }
        
        expect(gameTitles).toContain(
            'E2E Test Game'
        );
    });
});