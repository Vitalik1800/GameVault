const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('GameVault E2E - Search', () => {
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

    const openLibrary = async () => {
        await driver.get(
            'http://localhost:3000'
        );

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
    };

    const getGameTitles = async () => {
        const gameCards = 
            await driver.findElements(
                By.css('.game_card')
            );

        const titles = [];

        for (const card of gameCards) {
            const title = 
                await card.findElement(
                    By.css('.game_title')
                );

            titles.push(
                await title.getText()
            );
        }

        return titles;
    };

    test('finds games by search query', async () => {
        await openLibrary();

        const searchInput = 
            await driver.findElement(
                By.id('search_input')
            );

        await searchInput.clear();
        await searchInput.sendKeys('witcher');

        await driver.wait(
            async () => {
                const titles = 
                    await getGameTitles();

                return titles.some(
                    (title) => 
                        title ===
                        'The Witcher 3: Wild Hunt'
                );
            },
            5000
        );

        const titles = 
            await getGameTitles();

        expect(titles).toContain(
            'The Witcher 3: Wild Hunt'
        );
    });

    test('finds Cyberpunk by partial title', async () => {
        await openLibrary();

        const searchInput = 
            await driver.findElement(
                By.id('search_input')
            );

        await searchInput.clear();
        await searchInput.sendKeys('cyber');

        await driver.wait(
            async () => {
                const titles = 
                    await getGameTitles();

                return titles.some(
                    (title) => 
                        title ===
                        'Cyberpunk 2077'
                );
            },
            5000
        );

        const titles = 
            await getGameTitles();

        expect(titles).toContain(
            'Cyberpunk 2077'
        );
    });

    test('shows no games for non-existing search query', async () => {
        await openLibrary();

        const searchInput = 
            await driver.findElement(
                By.id('search_input')
            );

        await searchInput.clear();
        await searchInput.sendKeys(
            'неіснуючий запит'
        );

        await driver.wait(
            async () => {
                const gameCards = 
                    await driver.findElements(
                        By.css('.game_card')
                    );

                return gameCards.length === 0;
            },
            5000
        );

        const gameCards = 
            await driver.findElements(
                By.css('.game_card')
            );

        expect(gameCards).toHaveLength(0);
    });

    test('shows empty state when search has no results', async () => {
        await openLibrary();

        const searchInput = 
            await driver.findElement(
                By.id('search_input')
            );

        await searchInput.clear();
        await searchInput.sendKeys(
            'неіснуючий запит'
        );

        await driver.wait(
            async () => {
                const emptyState = 
                    await driver.findElements(
                        By.css('.empty_state')
                    );

                return emptyState.length > 0;
            },
            5000
        );

        const emptyState = 
            await driver.findElements(
                By.css('.empty_state')
            );

        expect(emptyState).toHaveLength(1);

        expect(
            await emptyState[0].isDisplayed()
        ).toBe(true);
    });
});