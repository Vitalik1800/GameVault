const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('GameVault E2E - Validation', () => {
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

    const openAddGame = async () => {
        await driver.get(
            'http://localhost:3000'
        );

        const addGameNavigationItem = 
            await driver.findElement(
                By.id('add_game_nav_item')
            );

        await addGameNavigationItem.click();

        const addGameModal = 
            await driver.findElement(
                By.id('add_game_modal')
            );

        await driver.wait(
            until.elementIsVisible(
                addGameModal
            ),
            5000
        );
    };

    const getFormMessage = async () => {
        const formMessage = 
            await driver.findElement(
                By.id('form_message')
            );

        await driver.wait(
            until.elementIsVisible(formMessage),
            5000
        );

        return await formMessage.getText();
    };

    const submitForm = async () => {
        const saveButton = 
            await driver.findElement(
                By.id('save_game_button')
            );

        await saveButton.click();
    };

    const fillValidGame = async () => {
        await driver.findElement(
            By.id('title')
        ).sendKeys('Validation Test Game');

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
        ).sendKeys('8');

        await driver.findElement(
            By.id('release_year')
        ).sendKeys('2025');

        await driver.findElement(
            By.id('cover_url')
        ).sendKeys(
            'https://example.com/validation-test.jpg'
        );
    };

    test('shows errors for empty required fields', async () => {
        await openAddGame();

        await submitForm();

        const message = 
            await getFormMessage();

        expect(message).toContain(
            'Title is required'
        );

        expect(message).toContain(
            'Genre is required'
        );

        expect(message).toContain(
            'Platform is required'
        );
    });

    test('rejects rating below 0', async () => {
        await openAddGame();

        await fillValidGame();

        const rating = 
            await driver.findElement(
                By.id('rating')
            );

        await rating.clear();
        await rating.sendKeys('-1');

        await submitForm();

        const message = 
            await getFormMessage();

        expect(message).toContain(
            'Rating must be between 0 and 10'
        );
    });

    test('rejects rating above 10', async () => {
        await openAddGame();

        await fillValidGame();

        const rating = 
            await driver.findElement(
                By.id('rating')
            );

        await rating.clear();
        await rating.sendKeys('11');

        await submitForm();

        const message = 
            await getFormMessage();

        expect(message).toContain(
            'Rating must be between 0 and 10'
        );
    });

    test('rejects invalid cover URL', async () => {
        await openAddGame();

        await fillValidGame();

        const coverUrl = 
            await driver.findElement(
                By.id('cover_url')
            );

        await coverUrl.clear();
        await coverUrl.sendKeys(
            'not-a-valid-url'
        );

        await submitForm();

        const message = 
            await getFormMessage();

        expect(message).toContain(
            'Cover URL is invalid'
        );
    });

    test('rejects invalid release year', async () => {
        await openAddGame();

        await fillValidGame();

        const releaseYear = 
            await driver.findElement(
                By.id('release_year')
            );

        await releaseYear.clear();
        await releaseYear.sendKeys('1949');

        await submitForm();

        const message = 
            await getFormMessage();

        expect(message).toContain(
            'Release year must be between'
        );
    });
});