const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('GameVault E2E - Delete Game', () => {
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

    test('deletes an existing game', async () => {
        await driver.get('http://localhost:3000');

        const libraryNavigationItem = 
            await driver.findElement(
                By.id('library_nav_item')
            );

        await libraryNavigationItem.click();

        await driver.wait(
            until.elementIsVisible(
                driver.findElement(
                    By.css('.library')
                )
            ),
            5000
        );

        const gameCards = await driver.findElements(
            By.css('.game_card')
        );

        let targetCard = null;

        for (const card of gameCards) {
            const title = await card.findElement(
                By.css('.game_title')
            );

            const titleText = await title.getText();

            if (titleText === 'E2E Test Game') {
                targetCard = card;
                break;
            }
        }

        expect(targetCard).not.toBeNull();

        const deleteButton = 
            await targetCard.findElement(
                By.css('.delete_game_button')
            );

        await deleteButton.click();

        const alert = await driver.wait(
            until.alertIsPresent(),
            5000
        );

        await alert.accept();

        await driver.wait(
            until.stalenessOf(targetCard),
            5000
        );

        const updatedGameCards = 
            await driver.findElements(
                By.css('.game_card')
            );

        let deletedGameExists = false;

        for (const card of updatedGameCards) {
            const title = await card.findElement(
                By.css('.game_title')
            );

            const titleText = await title.getText();

            if (titleText === 'E2E Edited Game') {
                deletedGameExists = true;
                break;
            }
        }

        expect(deletedGameExists).toBe(false);
    });
})