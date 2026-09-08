const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('GameVault E2E - Wishlist', () => {
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

    const findGameCard = async (title) => {
        const xpath =
            `//article[contains(@class, 'game_card')]` +
            `[.//h3[contains(@class, 'game_title') and normalize-space()="${title}"]]`;

        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                return await driver.findElement(
                    By.xpath(xpath)
                );
            } catch (error) {
                if (
                    error.name !==
                    'StaleElementReferenceError'
                ) {
                    return null;
                }

                await driver.sleep(100);
            }
        }

        return null;
    };

    const getWishlistButtonText = async (title) => {
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                const card =
                    await findGameCard(title);

                if (!card) {
                    return null;
                }

                const button =
                    await card.findElement(
                        By.css('.wishlist_game_button')
                    );

                return await button.getText();
            } catch (error) {
                if (
                    error.name !==
                    'StaleElementReferenceError'
                ) {
                    throw error;
                }

                await driver.sleep(100);
            }
        }

        return null;
    };

    test('adds game to wishlist', async () => {
        await openLibrary();

        let targetCard =
            await findGameCard(
                'Cyberpunk 2077'
            );

        expect(targetCard).not.toBeNull();

        let wishlistButton =
            await targetCard.findElement(
                By.css('.wishlist_game_button')
            );

        const currentText =
            await wishlistButton.getText();

        if (
            currentText ===
            'Remove from Wishlist'
        ) {
            await wishlistButton.click();

            await driver.wait(
                async () => {
                    const card =
                        await findGameCard(
                            'Cyberpunk 2077'
                        );

                    if (!card) {
                        return false;
                    }

                    const button =
                        await card.findElement(
                            By.css(
                                '.wishlist_game_button'
                            )
                        );

                    return (
                        await button.getText()
                    ) === 'Add to Wishlist';
                },
                5000
            );
        }

        targetCard =
            await findGameCard(
                'Cyberpunk 2077'
            );

        wishlistButton =
            await targetCard.findElement(
                By.css('.wishlist_game_button')
            );

        expect(
            await wishlistButton.getText()
        ).toBe('Add to Wishlist');

        await wishlistButton.click();

        await driver.wait(
            async () => {
                return (
                    await getWishlistButtonText(
                        'Cyberpunk 2077'
                    )
                ) === 'Remove from Wishlist';
            },
            5000
        );

        expect(
            await getWishlistButtonText(
                'Cyberpunk 2077'
            )
        ).toBe('Remove from Wishlist');
    });

    test('displays added game in wishlist', async () => {
        await openLibrary();

        const targetCard = 
            await findGameCard(
                'Cyberpunk 2077'
            );

        expect(targetCard).not.toBeNull();

        const wishlistButton = 
            await targetCard.findElement(
                By.css('.wishlist_game_button')
            );

        const buttonText = 
            await wishlistButton.getText();

        if (
            buttonText === 'Add to Wishlist'
        ) {
            await wishlistButton.click();

            await driver.wait(
                async () => {
                    const card = 
                        await findGameCard(
                            'Cyberpunk 2077'
                        );

                    if (!card) {
                        return false;
                    }

                    const button = 
                        await card.findElement(
                            By.css(
                                '.wishlist_game_button'
                            )
                        );

                    return (
                        await button.getText()
                    ) ===
                        'Remove from Wishlist';
                },
                5000
            );
        }

        const wishlistNavigationItem = 
            await driver.findElement(
                By.id('wishlist_nav_item')
            );

        await wishlistNavigationItem.click();

        await driver.wait(
            until.elementIsVisible(
                driver.findElement(
                    By.id('wishlist_section')
                )
            ),
            5000
        );

        await driver.wait(
            async () => {
                const cards = 
                    await driver.findElements(
                        By.css(
                            '#wishlist_library .game_card'
                        )
                    );

                return cards.some(
                    async (card) => {
                        const title = 
                            await card.findElement(
                                By.css('.game_title')
                            );

                        return (
                            await title.getText()
                        ) ===
                            'Cyberpunk 2077'
                    }
                );
            },
            5000
        );

        const wishlistCards = 
            await driver.findElements(
                By.css(
                    '#wishlist_library .game_card'
                )
            );

        const titles = [];

        for (
            const card of wishlistCards
        ) {
            const title = 
                await card.findElement(
                    By.css('.game_title')
                );

            titles.push(
                await title.getText()
            );
        }

        expect(titles).toContain(
            'Cyberpunk 2077'
        );
    });

    test('removes game from wishlist', async () => {
        await openLibrary();

        let targetCard =
            await findGameCard(
                'Cyberpunk 2077'
            );

        expect(targetCard).not.toBeNull();

        let wishlistButton =
            await targetCard.findElement(
                By.css('.wishlist_game_button')
            );

        if (
            await wishlistButton.getText() ===
            'Add to Wishlist'
        ) {
            await wishlistButton.click();

            await driver.wait(
                async () => {
                    const card =
                        await findGameCard(
                            'Cyberpunk 2077'
                        );

                    if (!card) {
                        return false;
                    }

                    const button =
                        await card.findElement(
                            By.css(
                                '.wishlist_game_button'
                            )
                        );

                    return (
                        await button.getText()
                    ) === 'Remove from Wishlist';
                },
                5000
            );
        }

        targetCard =
            await findGameCard(
                'Cyberpunk 2077'
            );

        wishlistButton =
            await targetCard.findElement(
                By.css('.wishlist_game_button')
            );

        expect(
            await wishlistButton.getText()
        ).toBe('Remove from Wishlist');

        await wishlistButton.click();

        await driver.wait(
            async () => {
                return (
                    await getWishlistButtonText(
                        'Cyberpunk 2077'
                    )
                ) === 'Add to Wishlist';
            },
            5000
        );

        expect(
            await getWishlistButtonText(
                'Cyberpunk 2077'
            )
        ).toBe('Add to Wishlist');
    });
});