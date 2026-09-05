const gameLibrary = document.getElementById('game_library');

const totalGamesStat = document.getElementById(
    'total_games_stat'
);

const completedGamesStat = document.getElementById(
    'completed_games_stat'
);

const playingGamesStat = document.getElementById(
    'playing_games_stat'
);

const backlogGamesStat = document.getElementById(
    'backlog_games_stat'
);

const averageRatingStat = document.getElementById(
    'average_rating_stat'
);

const wishlistSection = document.getElementById(
    'wishlist_section'
);

const wishlistLibrary = document.getElementById(
    'wishlist_library'
);

const wishlistNavItem = document.getElementById(
    'wishlist_nav_item'
);

const dashboardNavItem = document.getElementById(
    'dashboard_nav_item'
);

const libraryNavItem = document.getElementById(
    'library_nav_item'
);

const addGameNavItem = document.getElementById(
    'add_game_nav_item'
);

const settingsNavItem = document.getElementById(
    'settings_nav_item'
);

const searchInput = document.getElementById('search_input');

const genreFilter = document.getElementById('genre_filter');
const platformFilter = document.getElementById(
    'platform_filter'
);
const statusFilter = document.getElementById(
    'status_filter'
);
const ratingFilter = document.getElementById(
    'rating_filter'
);
const sortFilter = document.getElementById(
    'sort_filter'
);
const settingsButton = document.getElementById('settings_button');

const settingsModal = document.getElementById('settings_modal');
const closeSettingsModalButton = document.getElementById(
    'close_settings_modal_button'
);

const themeSetting = document.getElementById('theme_setting');

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

const addGameButton = document.getElementById('add_game_button');
const addGameModal = document.getElementById('add_game_modal');
const addGameForm = document.getElementById('add_game_form');

const closeModalButton = document.getElementById('close_modal_button');
const cancelModalButton = document.getElementById('cancel_modal_button');
const modalOverlay = document.querySelector('.modal_overlay');

const saveGameButton = document.getElementById('save_game_button');
const formMessage = document.getElementById('form_message');

const editGameModal = document.getElementById('edit_game_modal');
const editGameForm = document.getElementById('edit_game_form');

const closeEditModalButton = document.getElementById(
    'close_edit_modal_button'
);

const cancelEditModalButton = document.getElementById(
    'cancel_edit_modal_button'
);

const editModalOverlay = document.querySelector(
    '.edit_modal_overlay'
);

const editTitleInput = document.getElementById('edit_title');
const editDescriptionInput = document.getElementById(
    'edit_description'
);
const editGenreInput = document.getElementById('edit_genre');
const editPlatformInput = document.getElementById(
    'edit_platform'
);
const editStatusInput = document.getElementById('edit_status');
const editRatingInput = document.getElementById('edit_rating');
const editReleaseYearInput = document.getElementById(
    'edit_release_year'
);
const editCoverUrlInput = document.getElementById(
    'edit_cover_url'
);

const editFormMessage = document.getElementById(
    'edit_form_message'
);

const updateGameButton = document.getElementById(
    'update_game_button'
);

let editingGameId = null;
let searchTimeout = null;

const sortMap = {
    title_asc: {
        sort: 'title',
        order: 'asc'
    },
    title_desc: {
        sort: 'title',
        order: 'desc'
    },
    rating_asc: {
        sort: 'rating',
        order: 'asc'
    },
    rating_desc: {
        sort: 'rating',
        order: 'desc'
    },
    release_year_asc: {
        sort: 'release_year',
        order: 'asc'
    },
    release_year_desc: {
        sort: 'release_year',
        order: 'desc'
    }
};

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

const openAddGameModal = () => {
    addGameModal.classList.add('active');
};

const closeAddGameModal = () => {
    addGameModal.classList.remove('active');
};

const apiRequest = async (
    url,
    options = {},
    errorMessage = 'Request failed'
) => {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(errorMessage);
    }

    return response.status === 204
        ? null
        : response.json();
};

const createGame = (gameData) => {
    return apiRequest(
        '/api/games',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        },
        'Failed to create game'
    );
};

const updateGame = (gameId, gameData) => {
    return apiRequest(
        `/api/games/${gameId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        },
        'Failed to update game'
    );
};

const getGameById = (gameId) => {
    return apiRequest(
        `/api/games/${gameId}`,
        {},
        'Failed to load game'
    );
};

const deleteGame = (gameId) => {
    return apiRequest(
        `/api/games/${gameId}`,
        {
            method: 'DELETE'
        },
        'Failed to delete game'
    );
};

const validateGameData = (gameData) => {
    const errors = [];

    if (!gameData.title?.trim()) {
        errors.push('Title is required');
    }

    if (!gameData.genre?.trim()) {
        errors.push('Genre is required');
    }

    if (!gameData.platform?.trim()) {
        errors.push('Platform is required');
    }

    const allowedStatuses = [
        'Backlog',
        'Playing',
        'Completed',
        'Dropped'
    ];

    if (!allowedStatuses.includes(gameData.status)) {
        errors.push('Invalid status');
    }

    if (
        gameData.rating !== null &&
        (gameData.rating < 0 || gameData.rating > 10)
    ) {
        errors.push('Rating must be between 0 and 10');
    }

    if (
        !Number.isInteger(gameData.release_year) ||
        gameData.release_year < 1950 ||
        gameData.release_year > new Date().getFullYear()
    ) {
        errors.push(
            `Release year must be between 1950 and ${new Date().getFullYear()}`
        );
    }

    if (gameData.cover_url) {
        try {
            new URL(gameData.cover_url);
        } catch {
            errors.push('Cover URL is invalid');
        }
    }

    return errors;
};

const getGameFormData = (form) => {
    const formData = new FormData(form);

    return {
        title: formData.get('title'),
        description: formData.get('description'),
        genre: formData.get('genre'),
        platform: formData.get('platform'),
        status: formData.get('status'),
        rating: formData.get('rating')
            ? Number(formData.get('rating'))
            : null,
        release_year: Number(formData.get('release_year')),
        cover_url: formData.get('cover_url')
    };
};

const showFormLoading = () => {
    saveGameButton.disabled = true;
    saveGameButton.textContent = 'Saving...';

    formMessage.textContent = '';
    formMessage.className = 'form_message';
};

const showFormSuccess = () => {
    formMessage.textContent = 'Game added successfully.';
    formMessage.className = 'form_message success';
};

const showFormError = (messageElement, message) => {
    messageElement.textContent = message;
    messageElement.className = 'form_message error';
};

const resetFormState = () => {
    saveGameButton.disabled = false;
    saveGameButton.textContent = 'Save';

    formMessage.textContent = '';
    formMessage.className = 'form_message';
};

const showLoadingState = () => {
    gameLibrary.innerHTML = `
        <div class="loading_state">
            <p class="loading_state_text">Loading games...</p>
        </div>
    `;
};

const showErrorState = () => {
    gameLibrary.innerHTML = `
        <div class="error_state">
            <h3 class="error_state_title">Failed to load games</h3>
            <p class="error_state_description">
                Something went wrong while loading your game library.
            </p>
        </div>
    `;
};

const showWishlistErrorState = () => {
    wishlistLibrary.innerHTML = `
        <div class="error_state">
            <h3 class="error_state_title">
                Failed to load wishlist
            </h3>

            <p class="error_state_description">
                Something went wrong while loading your wishlist.
            </p>
        </div>
    `;
};

const openEditGame = async (gameId) => {

    try {
        const game = await getGameById(gameId);

        editingGameId = game.id;

        editTitleInput.value = game.title ?? '';
        editDescriptionInput.value = game.description ?? '';
        editGenreInput.value = game.genre ?? '';
        editPlatformInput.value = game.platform ?? '';
        editStatusInput.value = game.status ?? 'Backlog';
        editRatingInput.value = game.rating ?? '';
        editReleaseYearInput.value = game.release_year ?? '';
        editCoverUrlInput.value = game.cover_url ?? '';

        editGameModal.classList.add('active');
    } catch (error) {
        console.error('Failed to load game: ', error);

        alert('Failed to load game. Please try again.');
    }
};

const openDeleteGame = async (gameId, deleteButton) => {
    const confirmed = window.confirm(
        'Are you sure you want to delete this game?'
    );

    if (!confirmed) {
        return;
    }

    try {
        deleteButton.disabled = true;
        deleteButton.textContent = 'Deleting...';

        await deleteGame(gameId);

        await refreshGameData();

    } catch (error) {
        console.error('Failed to delete game: ', error);

        deleteButton.disabled = false;
        deleteButton.textContent = 'Delete';

        alert('Failed to delete game. Please try again.');
    }
};

const closeEditGameModal = () => {
    editGameModal.classList.remove('active');
};

const openSettingsModal = () => {
    settingsModal.classList.add('active');
};

const closeSettingsModal = () => {
    settingsModal.classList.remove('active');
}

const setQueryParam = (params, key, value) => {
    if (value) {
        params.set(key, value);
    }
};

const loadGamesWithControls = async () => {
    showLoadingState();

    try {
        const params = new URLSearchParams();

        const query = searchInput.value.trim();
        const genre = genreFilter.value;
        const platform = platformFilter.value;
        const status = statusFilter.value;
        const rating = ratingFilter.value;
        const sortValue = sortFilter.value;

        setQueryParam(params, 'q', query);
        setQueryParam(params, 'genre', genre);
        setQueryParam(params, 'platform', platform);
        setQueryParam(params, 'status', status);
        setQueryParam(params, 'rating', rating);
        
        if (sortValue) {

            const selectedSort = sortMap[sortValue];

            if (selectedSort) {
                params.set('sort', selectedSort.sort);
                params.set('order', selectedSort.order);
            }
        }

        const queryString = params.toString();

        const url = queryString
            ? `/api/games?${queryString}`
            : '/api/games';

        const games = await apiRequest(
            url,
            {},
            'Failed to load games with controls'
        );

        renderGames(games, query);

    } catch (error) {
        console.error(
            'Failed to load games with controls: ',
            error
        );

        showErrorState();
    }
};

const getUniqueSortedValues = (games, key) => {
    return [
        ...new Set(
            games
                .map((game) => game[key])
                .filter(Boolean)
        )
    ].sort();
};

const populateSelect = (
    select,
    defaultLabel,
    values
) => {
    select.innerHTML = `
        <option value="">${defaultLabel}</option>
    `;

    values.forEach((value) => {
        const option = document.createElement('option');

        option.value = value;
        option.textContent = value;

        select.appendChild(option);
    });
};

const loadFilterOptions = async () => {
    try {
        const games = await apiRequest(
            '/api/games',
            {},
            'Failed to load filter options'
        );

        const genres = getUniqueSortedValues(
            games,
            'genre'
        );

        const platforms = getUniqueSortedValues(
            games,
            'platform'
        );

        populateSelect(
            genreFilter,
            'All genres',
            genres
        );

        populateSelect(
            platformFilter,
            'All platforms',
            platforms
        );

    } catch (error) {
        console.error(
            'Failed to load filter options: ',
            error
        );
    }
};

const loadDashboardStats = async () => {
    try {
        const stats = await apiRequest(
            '/api/games/stats',
            {},
            'Failed to load dashboard statistics'
        );

        totalGamesStat.textContent = 
            stats.totalGames;

        completedGamesStat.textContent = 
            stats.byStatus.Completed || 0;

        playingGamesStat.textContent = 
            stats.byStatus.Playing || 0;

        backlogGamesStat.textContent = 
            stats.byStatus.Backlog || 0;

        averageRatingStat.textContent = 
            stats.averageRating ?? 0;

    } catch (error) {
        console.error(
            'Failed to load dashboard statistics: ',
            error
        );

        totalGamesStat.textContent = '-';
        completedGamesStat.textContent = '-';
        playingGamesStat.textContent = '-';
        backlogGamesStat.textContent = '-';
        averageRatingStat.textContent = '-';
    }
};

const refreshGameData = async () => {
    await loadGamesWithControls();
    await loadWishlist();
    await loadDashboardStats();
};

const setActiveNavigation = (activeItem) => {
    const navigationItems = document.querySelectorAll(
        '.nav_item'
    );

    navigationItems.forEach((item) => {
        item.classList.remove('active')
    });

    activeItem.classList.add('active');
};

const handleNavigation = (
    event,
    navigationItem,
    action
) => {
    event.preventDefault();

    setActiveNavigation(navigationItem);

    action();
};

const loadWishlist = async () => {
    try {
        const games = await apiRequest(
            '/api/games/wishlist',
            {},
            'Failed to load wishlist'
        );

        renderWishlist(games);
    } catch (error) {
        console.error(
            'Failed to load wishlist: ',
            error
        );

        showWishlistErrorState();
    }
};

const renderWishlist = (games) => {
    wishlistLibrary.innerHTML = '';

    if (games.length === 0) {
        wishlistLibrary.innerHTML = `
            <div class="empty_state">
                <h3 class="empty_state_title">
                    Wishlist is empty
                </h3>

                <p class="empty_state_description">
                    Add games to your wishlist to see them here.
                </p>
            </div>
        `;

        return;
    }

    games.forEach((game) => {
        wishlistLibrary.appendChild(
            createGameCard(game, true)
        );
    });
};

const updateWishlist = (gameId, isWishlist) => {
    return apiRequest(
        `/api/games/${gameId}/wishlist`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isWishlist
            })
        },
        'Failed to update wishlist'
    );
};

const createGameCard = (game, wishlistMode = false) => {
    const card = document.createElement('article');

    card.className = 'game_card';

    const cover = settings.showCovers && game.cover_url
        ? `
            <img
                class="game_cover"
                src="${game.cover_url}"
                alt="${game.title} cover"
            >
        `
        : '';

    card.innerHTML = `
        ${cover}

        <div class="game_content">
            <h3 class="game_title">
                ${game.title}
            </h3>

            <p class="game_info">
                ${game.genre} · ${game.platform}
            </p>

            <p class="game_info">
                Release year: ${game.release_year}
            </p>

            ${
                game.rating !== null
                    ? `
                        <p class="game_rating">
                            Rating: ${game.rating}/10
                        </p>
                    `
                    : ''
            }

            ${
                wishlistMode
                    ? ''
                    : `
                        <span class="game_status">
                            ${game.status}
                        </span>
                    `
            }

            <div class="game_actions">
                <button
                    type="button"
                    class="edit_game_button"
                    data-id="${game.id}"
                >
                    Edit
                </button>

                ${
                    wishlistMode
                        ? ''
                        : `
                            <button
                                type="button"
                                class="delete_game_button"
                                data-id="${game.id}"
                            >
                                Delete
                            </button>
                        `
                }

                <button
                    type="button"
                    class="wishlist_game_button"
                    data-id="${game.id}"
                >
                    ${
                        wishlistMode
                            ? 'Remove from Wishlist'
                            : game.is_wishlist
                                ? 'Remove from Wishlist'
                                : 'Add to Wishlist'
                    }
                </button>
            </div>
        </div>
    `;

    return card;
};

const renderGames = (games, searchQuery = '') => {
    gameLibrary.innerHTML = '';

    if (games.length === 0) {
        const emptyState = document.createElement('div');

        emptyState.className = 'empty_state';

        if (searchQuery) {
            emptyState.innerHTML = `
                <h3 class="empty_state_title">No games found</h3>
                <p class="empty_state_description">
                    No games match "${searchQuery}".
                </p>
            `;
        } else {
            emptyState.innerHTML = `
                <h3 class="empty_state_title">No games found</h3>
                <p class="empty_state_description">
                    Your game library is empty.
                </p>
            `;
        }

        gameLibrary.appendChild(emptyState);

        return;
    }

    games.forEach((game) => {
        gameLibrary.appendChild(
            createGameCard(game)
        );
    });
};
loadSettings();
applySettings();

loadGamesWithControls();
loadWishlist();

loadFilterOptions();
loadDashboardStats();

searchInput.addEventListener('input', (event) => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        loadGamesWithControls();
    }, 300);
});

genreFilter.addEventListener('change', loadGamesWithControls);

platformFilter.addEventListener('change', loadGamesWithControls);

statusFilter.addEventListener('change', loadGamesWithControls);

ratingFilter.addEventListener('change', loadGamesWithControls);

sortFilter.addEventListener('change', loadGamesWithControls);

addGameButton.addEventListener('click', openAddGameModal);

addGameForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const gameData = getGameFormData(addGameForm);

    const errors = validateGameData(gameData);

    if (errors.length > 0) {

        showFormError(formMessage, errors.join(', '));

        return;
    }

    showFormLoading();

    try {
        const game = await createGame(gameData);

        showFormSuccess();

        addGameForm.reset();

        await loadFilterOptions();
        await refreshGameData();

        setTimeout(() => {
            closeAddGameModal();
            resetFormState();
        }, 500);

    } catch (error) {
        console.error('Failed to create game: ', error);

        showFormError(formMessage, 'Failed to create game. Please try again.');

        resetFormState();
    }
});

closeModalButton.addEventListener('click', closeAddGameModal);

cancelModalButton.addEventListener('click', closeAddGameModal);

modalOverlay.addEventListener('click', closeAddGameModal);

gameLibrary.addEventListener('click', async (event) => {
    const editButton = event.target.closest('.edit_game_button');

    if (editButton) {
        const gameId = Number(editButton.dataset.id);

        openEditGame(gameId);

        return;
    }

    const deleteButton = event.target.closest(
        '.delete_game_button'
    );

    if (deleteButton) {
        const gameId = Number(deleteButton.dataset.id);

        await openDeleteGame(gameId, deleteButton);
    }

    if (
        event.target.classList.contains(
            'wishlist_game_button'
        )
    ) {
        const gameId = Number(
            event.target.dataset.id
        );

        const game = await getGameById(gameId);

        await updateWishlist(
            gameId,
            !game.is_wishlist
        );

        await refreshGameData();

        return;
    }
});

closeEditModalButton.addEventListener(
    'click',
    closeEditGameModal
);

cancelEditModalButton.addEventListener(
    'click',
    closeEditGameModal
);

editModalOverlay.addEventListener(
    'click',
    closeEditGameModal
);

editGameForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!editingGameId) {
        console.error('No game selected for editing');
        return;
    }

    const gameData = getGameFormData(editGameForm);

    try {
        updateGameButton.disabled = true;
        updateGameButton.textContent = 'Updating...';

        const game = await updateGame(
            editingGameId,
            gameData
        );

        closeEditGameModal();

        editingGameId = null;

        await refreshGameData();

        updateGameButton.disabled = false;
        updateGameButton.textContent = 'Update';
    } catch (error) {
        console.error('Failed to update game: ', error);

        updateGameButton.disabled = false;
        updateGameButton.textContent = 'Update';

        showFormError(editFormMessage, 'Failed to update game. Please try again.');
    }
});

settingsButton.addEventListener('click', openSettingsModal);

closeSettingsModalButton.addEventListener('click', closeSettingsModal);

settingsModalOverlay.addEventListener('click', closeSettingsModal);

const updateSetting = (key, value) => {
    settings[key] = value;

    saveSettings();
    applySettings();
};

themeSetting.addEventListener('change', (event) => {
    updateSetting('theme', event.target.value);
});

showCoversSetting.addEventListener('change', (event) => {
    updateSetting('showCovers', event.target.checked);
});

compactCardsSetting.addEventListener('change', (event) => {
    updateSetting('compactCards', event.target.checked);
});

resetSettingsButton.addEventListener('click', () => {
    settings = {
        ...defaultSettings
    };

    saveSettings();
    applySettings();
});

wishlistNavItem.addEventListener(
    'click',
    (event) => {
        handleNavigation(
            event,
            wishlistNavItem,
            () => {
                wishlistSection.scrollIntoView({
                    behavior: 'smooth'
                });

                loadWishlist();
            }
        );
    }
);

dashboardNavItem.addEventListener(
    'click',
    (event) => {
        handleNavigation(
            event,
            dashboardNavItem,
            () => {
                document.querySelector('.dashboard')
                    .scrollIntoView({
                        behavior: 'smooth'
                    });
            }
        );
    }
);

libraryNavItem.addEventListener(
    'click',
    (event) => {
        handleNavigation(
            event,
            libraryNavItem,
            () => {
                document.querySelector('.library')
                    .scrollIntoView({
                        behavior: 'smooth'
                    });
            }
        );
    }
);

addGameNavItem.addEventListener(
    'click',
    (event) => {
        handleNavigation(
            event,
            addGameNavItem,
            openAddGameModal
        );
    }
);

settingsNavItem.addEventListener(
    'click',
    (event) => {
        handleNavigation(
            event,
            settingsNavItem,
            openSettingsModal
        );
    }
);

wishlistLibrary.addEventListener(
    'click',
    async (event) => {
        const editButton =
            event.target.closest(
                '.edit_game_button'
            );

        const wishlistButton =
            event.target.closest(
                '.wishlist_game_button'
            );

        if (editButton) {
            const gameId = Number(
                editButton.dataset.id
            );

            await openEditGame(gameId);

            return;
        }

        if (wishlistButton) {
            const gameId = Number(
                wishlistButton.dataset.id
            );

            try {
                wishlistButton.disabled = true;

                await updateWishlist(
                    gameId,
                    false
                );

                await refreshGameData();
            } catch (error) {
                console.error(
                    'Failed to remove game from wishlist: ',
                    error
                );
            }
        }
    }
);

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
        return;
    }

    closeAddGameModal();
    closeEditGameModal();
    closeSettingsModal();
});