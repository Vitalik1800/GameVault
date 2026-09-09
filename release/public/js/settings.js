const settingsModal = document.getElementById(
    'settings_modal'
);

const closeSettingsModalButton = document.getElementById(
    'close_settings_modal_button'
);

const themeSetting = document.getElementById(
    'theme_setting'
);

const showCoversSetting = document.getElementById(
    'show_covers_setting'
);

const compactCardsSetting = document.getElementById(
    'compact_cards_setting'
);

const resetSettingsButton = document.getElementById(
    'reset_settings_button'
);

const settingsModalOverlay = document.querySelector(
    '.settings_modal_overlay'
);

const defaultSettings = {
    theme: 'light',
    showCovers: true,
    compactCards: false
};

let settings = {
    ...defaultSettings
};

const saveSettings = () => {
    localStorage.setItem(
        'gamevault_settings',
        JSON.stringify(settings)
    );
};

const loadSettings = () => {
    const savedSettings = localStorage.getItem(
        'gamevault_settings'
    );

    if (!savedSettings) {
        settings = {
            ...defaultSettings
        };

        return;
    }

    try {
        const parsedSettings = JSON.parse(savedSettings);

        settings = {
            ...defaultSettings,
            ...parsedSettings
        };
    } catch (error) {
        console.error(
            'Failed to load settings: ',
            error
        );

        settings = {
            ...defaultSettings
        };
    }
};

const applySettings = () => {
    document.body.classList.toggle(
        'dark_theme',
        settings.theme === 'dark'
    );

    document.body.classList.toggle(
        'compact_cards',
        settings.compactCards
    );

    document.body.classList.toggle(
        'hide_game_covers',
        !settings.showCovers
    );

    themeSetting.value = settings.theme;

    showCoversSetting.checked = settings.showCovers;

    compactCardsSetting.checked = settings.compactCards;
};

const updateSetting = (key, value) => {
    settings[key] = value;

    saveSettings();
    applySettings();
};

const settingsButton = document.getElementById(
    'settings_button'
);

const openSettingsModal = () => {
    settingsModal.classList.add('active');
};

const closeSettingsModal = () => {
    settingsModal.classList.remove('active');
};

settingsButton.addEventListener(
    'click',
    openSettingsModal
);

closeSettingsModalButton.addEventListener(
    'click',
    closeSettingsModal
);

settingsModalOverlay.addEventListener(
    'click',
    closeSettingsModal
);

themeSetting.addEventListener(
    'change',
    (event) => {
        updateSetting(
            'theme',
            event.target.value
        );
    }
);

showCoversSetting.addEventListener(
    'change',
    (event) => {
        updateSetting(
            'showCovers',
            event.target.checked
        );
    }
);

compactCardsSetting.addEventListener(
    'change',
    (event) => {
        updateSetting(
            'compactCards',
            event.target.checked
        );
    }
);

resetSettingsButton.addEventListener(
    'click',
    () => {
        settings = {
            ...defaultSettings
        };

        saveSettings();
        applySettings();
    }
);