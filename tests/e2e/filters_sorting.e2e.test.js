const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('Game Vault E2E - Filters and Sorting', () => {
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

    const getGameCards = async () => {
        return await driver.findElements(
            By.css('.game_card')
        );
    };

    const getGameTitles = async () => {
        const cards = await getGameCards();

        const titles = [];

        for (const card of cards) {
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

    test('filters games by genre', async () => {
        await openLibrary();

        await driver.wait(
            until.elementLocated(
                By.css(
                    '#genre_filter option[value="RPG"]'
                )
            ),
            5000
        );

        const genreFilter = 
            await driver.findElement(
                By.id('genre_filter')
            );

        const rpgOption = 
            await genreFilter.findElement(
                By.css('option[value="RPG"]')
            );

        await rpgOption.click();

        await driver.wait(
            async () => {
                const titles = 
                    await getGameTitles();

                return titles.length > 0;
            },
            5000
        );

        const cards = 
            await getGameCards();

        expect(cards.length).toBeGreaterThan(0);

        for (const card of cards) {
            const info = 
                await card.findElement(
                    By.css('.game_info')
                );

            const text = 
                await info.getText();

            expect(text).toContain('RPG');
        }
    });

    test('filters games by platform', async () => {
        await openLibrary();

        await driver.wait(
            until.elementLocated(
                By.css(
                    '#platform_filter option[value="PC"]'
                )
            ),
            5000
        );

        const platformFilter = 
            await driver.findElement(
                By.id('platform_filter')
            );

        const pcOption = 
            await platformFilter.findElement(
                By.css('option[value="PC"]')
            );

        await pcOption.click();

        await driver.wait(
            async () => {
                const cards = 
                    await getGameCards();

                return cards.length > 0;
            },
            5000
        );

        const cards = 
            await getGameCards();

        expect(cards.length).toBeGreaterThan(0);

        for (const card of cards) {
            const info = 
                await card.findElement(
                    By.css('.game_info')
                );

            const text = 
                await info.getText();

            expect(text).toContain('PC');
        }
    });

    test('filters games by status', async () => {
        await openLibrary();

        const statusFilter = 
            await driver.findElement(
                By.id('status_filter')
            );

        const completedOption = 
            await statusFilter.findElement(
                By.css('option[value="Completed"]')
            );

        await completedOption.click();

        await driver.wait(
            async () => {
                const cards = 
                    await getGameCards();

                return cards.length > 0;
            },
            5000
        );

        const cards = 
            await getGameCards();

        expect(cards.length).toBeGreaterThan(0);

        for (const card of cards) {
            const status = 
                await card.findElement(
                    By.css('.game_status')
                );

            expect(
                await status.getText()
            ).toBe('Completed');
        }
    });

    test('filters games by minimum rating', async () => {
        await openLibrary();

        const ratingFilter = 
            await driver.findElement(
                By.id('rating_filter')
            );

        const ratingOption = 
            await ratingFilter.findElement(
                By.css('option[value="9"]')
            );

        await ratingOption.click();

        await driver.wait(
            async () => {
                const cards = 
                    await getGameCards();

                return cards.length > 0;
            },
            5000
        );

        const cards = 
            await getGameCards();

        expect(cards.length).toBeGreaterThan(0);

        for (const card of cards) {
            const ratingElements = 
                await card.findElements(
                    By.css('.game_rating')
                );

            expect(
                ratingElements
            ).toHaveLength(1);

            const ratingText = 
                await ratingElements[0].getText();

            const rating = 
                Number(
                    ratingText
                        .replace('Rating: ', '')
                        .replace('/10', '')
                );

            expect(rating).toBeGreaterThanOrEqual(9);
        }
    });

    test('sorts games by title ascending', async () => {
        await openLibrary();

        const sortFilter = 
            await driver.findElement(
                By.id('sort_filter')
            );

        const titleAscOption = 
            await sortFilter.findElement(
                By.css(
                    'option[value="title_asc"]'
                )
            );

        await titleAscOption.click();

        await driver.wait(
            async () => {
                const titles = 
                    await getGameTitles();

                return titles.length >= 2;
            },
            5000
        );

        const titles = 
            await getGameTitles();

        const sortedTitles = 
            [...titles].sort(
                (a, b) => 
                    a.localeCompare(b)
            );

        expect(titles).toEqual(
            sortedTitles
        );
    });

    test('sorts games by rating descending', async () => {
        await openLibrary();

        const sortFilter = 
            await driver.findElement(
                By.id('sort_filter')
            );

        const ratingDescOption = 
            await sortFilter.findElement(
                By.css(
                    'option[value="rating_desc"]'
                )
            );

        await ratingDescOption.click();

        await driver.wait(
            async () => {
                const cards = 
                    await getGameCards();

                return cards.length >= 2;
            },
            5000
        );

        const cards = 
            await getGameCards();

        const ratings = [];

        for (const card of cards) {
            const ratingElements = 
                await card.findElements(
                    By.css('.game_rating')
                );

            if (
                ratingElements.length === 0
            ) {
                ratings.push(null);
                continue;
            }

            const ratingText = 
                await ratingElements[0].getText();

            ratings.push(
                Number(
                    ratingText
                        .replace('Rating: ', '')
                        .replace('/10', '')
                )
            );
        }

        const ratedGames = 
            ratings.filter(
                (rating) => rating !== null
            );

        for (
            let index = 1;
            index < ratedGames.length;
            index++
        ) {
            expect(
                ratedGames[index - 1]
            ).toBeGreaterThanOrEqual(
                ratedGames[index]
            );
        }
    });
});