const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

describe('GameVault E2E - Settings', () => {
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

    const openSettings = async () => {
        await driver.get(
            'http://localhost:3000'
        );

        const settingsNavigationItem = 
            await driver.findElement(
                By.id('settings_nav_item')
            );

        await settingsNavigationItem.click();

        const settingsModal = 
            await driver.findElement(
                By.id('settings_modal')
            );

        await driver.wait(
            until.elementIsVisible(
                settingsModal
            ),
            5000
        );
    };

    const resetSettings = async () => {
        await openSettings();

        const resetButton = 
            await driver.findElement(
                By.id('reset_settings_button')
            );

        await resetButton.click();

        await driver.sleep(200);
    };

    const clickCheckbox = async (element) => {
        await driver.executeScript(
            'arguments[0].click();',
            element
        );
    };

    test('enables dark theme', async () => {
        await resetSettings();

        const themeSetting = 
            await driver.findElement(
                By.id('theme_setting')
            );

        await themeSetting.sendKeys('dark');

        await driver.wait(
            async () => {
                const body = 
                    await driver.findElement(
                        By.css('body')
                    );

                return (
                    await body.getAttribute('class')
                ).includes('dark_theme');
            },
            5000
        );

        const body = 
            await driver.findElement(
                By.css('body')
            );

        expect(
            await body.getAttribute('class')
        ).toContain('dark_theme');

        expect(
            await themeSetting.getAttribute('value')
        ).toBe('dark');
    });

    test('shows and hides game covers', async () => {
        await resetSettings();

        const showCoversSetting = 
            await driver.findElement(
                By.id('show_covers_setting')
            );

        expect(
            await showCoversSetting.isSelected()
        ).toBe(true);

        let body = 
            await driver.findElement(
                By.css('body')
            );

        expect(
            await body.getAttribute('class')
        ).not.toContain(
            'hide_game_covers'
        );

        await clickCheckbox(
            showCoversSetting
        );

        await driver.wait(
            async () => {
                const currentBody = 
                    await driver.findElement(
                        By.css('body')
                    );

                return (
                    await currentBody.getAttribute(
                        'class'
                    )
                ).includes(
                    'hide_game_covers'
                );
            },
            5000
        );

        expect(
            await showCoversSetting.isSelected()
        ).toBe(false);

        body = 
            await driver.findElement(
                By.css('body')
            );

        expect(
            await body.getAttribute('class')
        ).toContain(
            'hide_game_covers'
        );

        await clickCheckbox(
            showCoversSetting
        );

        await driver.wait(
            async () => {
                const currentBody = 
                    await driver.findElement(
                        By.css('body')
                    );

                return !(
                    await currentBody.getAttribute(
                        'class'
                    )
                ).includes(
                    'hide_game_covers'
                );
            },
            5000
        );

        expect(
            await showCoversSetting.isSelected()
        ).toBe(true);

        body = 
            await driver.findElement(
                By.css('body')
            );

        expect(
            await body.getAttribute('class')
        ).not.toContain(
            'hide_game_covers'
        );
    });

    test('enables compact cards', async () => {
        await resetSettings();

        const compactCardsSetting = 
            await driver.findElement(
                By.id('compact_cards_setting')
            );

        expect(
            await compactCardsSetting.isSelected()
        ).toBe(false);

        await clickCheckbox(
            compactCardsSetting
        );

        await driver.wait(
            async () => {
                const body = 
                    await driver.findElement(
                        By.css('body')
                    );

                return (
                    await body.getAttribute('class')
                ).includes(
                    'compact_cards'
                );
            },
            5000
        );

        expect(
            await compactCardsSetting.isSelected()
        ).toBe(true);

        const body = 
            await driver.findElement(
                By.css('body')
            );

        expect(
            await body.getAttribute('class')
        ).toContain(
            'compact_cards'
        );
    });

    test('resets settings to defaults', async () => {
        await resetSettings();

        const themeSetting = 
            await driver.findElement(
                By.id('theme_setting')
            );

        const showCoversSetting = 
            await driver.findElement(
                By.id('show_covers_setting')
            );

        const compactCardsSetting = 
            await driver.findElement(
                By.id('compact_cards_setting')
            );

        await themeSetting.sendKeys('dark');

        await clickCheckbox(
            showCoversSetting
        );

        await clickCheckbox(
            compactCardsSetting
        );

        await driver.wait(
            async () => {
                const body = 
                    await driver.findElement(
                        By.css('body')
                    );

                const classes = 
                    await body.getAttribute(
                        'class'
                    );

                return (
                    classes.includes('dark_theme') &&
                    classes.includes(
                        'hide_game_covers'
                    ) &&
                    classes.includes(
                        'compact_cards'
                    )
                );
            },
            5000
        );

        const resetButton = 
            await driver.findElement(
                By.id('reset_settings_button')
            );

        await resetButton.click();

        await driver.wait(
            async () => {
                const body = 
                    await driver.findElement(
                        By.css('body')
                    );

                const classes = 
                    await body.getAttribute(
                        'class'
                    );

                return (
                    !classes.includes(
                        'dark_theme'
                    ) &&
                    !classes.includes(
                        'hide_game_covers'
                    ) &&
                    !classes.includes(
                        'compact_cards'
                    )
                );
            },
            5000
        );

        expect(
            await themeSetting.getAttribute('value')
        ).toBe('light');

        expect(
            await showCoversSetting.isSelected()
        ).toBe(true);

        expect(
            await compactCardsSetting.isSelected()
        ).toBe(false);

        const body = 
            await driver.findElement(
                By.css('body')
            );

        const classes = 
            await body.getAttribute('class');

        expect(classes).not.toContain(
            'dark_theme'
        );

        expect(classes).not.toContain(
            'hide_game_covers'
        );

        expect(classes).not.toContain(
            'compact_cards'
        );
    });
});