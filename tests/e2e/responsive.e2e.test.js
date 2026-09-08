const {
    Builder,
    By
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('GameVault E2E - Responsive', () => {
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

    const viewports = [
        {
            name: 'desktop',
            width: 1920,
            height: 1080
        },
        {
            name: 'tablet',
            width: 1024,
            height: 768
        },
        {
            name: 'mobile',
            width: 390,
            height: 844
        }
    ];

    for (const viewport of viewports) {
        test(`works on ${viewport.name} viewport`, async () => {
            await driver.manage().window().setRect({
                width: viewport.width,
                height: viewport.height
            });

            await driver.get(
                'http://localhost:3000'
            );

            const mainContent = 
                await driver.findElement(
                    By.css('.main_content')
                );

            expect(
                await mainContent.isDisplayed()
            ).toBe(true);

            const gameLibrary = 
                await driver.findElement(
                    By.id('game_library')
                );

            expect(
                await gameLibrary.isDisplayed()
            ).toBe(true);

            const hasHorizontalOverflow = 
                await driver.executeScript(`
                    return document.documentElement.scrollWidth
                        > document.documentElement.clientWidth; 
                `);

            expect(
                hasHorizontalOverflow
            ).toBe(false);
        });
    }
});