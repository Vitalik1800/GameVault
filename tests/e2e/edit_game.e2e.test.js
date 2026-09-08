const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('GameVault E2E - Edit Game', () => {
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

    test('edits an existing game', async () => {
        await driver.get('http://localhost:3000');

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

        expect(
            await library.isDisplayed()
        ).toBe(true);

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

        const editButton = await targetCard.findElement(
            By.css('.edit_game_button')
        );

        await editButton.click();

        const editModal = await driver.wait(
            until.elementIsVisible(
                driver.findElement(
                    By.id('edit_game_modal')
                )
            ),
            5000
        );

        expect(
            await editModal.isDisplayed()
        ).toBe(true);

        const titleInput = await driver.findElement(
            By.id('edit_title')
        );

        await titleInput.clear();
        await titleInput.sendKeys(
            'E2E Edited Game'
        );

        const descriptionInput = await driver.findElement(
            By.id('edit_description')
        );

        await descriptionInput.clear();
        await descriptionInput.sendKeys(
            'Game updated by Selenium E2E test'
        );

        const ratingInput = 
            await driver.findElement(
                By.id('edit_rating')
            );

        await ratingInput.clear();
        await ratingInput.sendKeys('10');

        const statusInput = 
            await driver.findElement(
                By.id('edit_status')
            );

        await statusInput.sendKeys('Playing');

        await driver.findElement(
            By.id('edit_game_form')
        ).findElement(
            By.css('button[type="submit"]')
        ).click();

        await driver.wait(
            async () => {
                return !(await editModal.isDisplayed());
            },
            5000
        );

        const updatedGameCards = 
            await driver.findElements(
                By.css('.game_card')
            );

        let updatedCard = null;

        for (const card of updatedGameCards) {
            const title = await card.findElement(
                By.css('.game_title')
            );

            const titleText = await title.getText();

            if (titleText === 'E2E Edited Game') {
                updatedCard = card;
                break;
            }
        }

        expect(updatedCard).not.toBeNull();

        const updatedTitle = 
            await updatedCard.findElement(
                By.css('.game_title')
            );

        expect(
            await updatedTitle.getText()
        ).toBe('E2E Edited Game');

        const updatedRating = 
            await updatedCard.findElement(
                By.css('.game_rating')
            );

        expect(
            await updatedRating.getText()
        ).toContain('10/10');

        const updatedStatus = 
            await updatedCard.findElement(
                By.css('.game_status')
            );

        expect(
            await updatedStatus.getText()
        ).toBe('Playing');
    });
});