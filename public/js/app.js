const gameLibrary = document.getElementById('game_library');

const searchInput = document.getElementById('search_input');

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

const openAddGameModal = () => {
    addGameModal.classList.add('active');
};

const closeAddGameModal = () => {
    addGameModal.classList.remove('active');
};

const createGame = async (gameData) => {
    const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
    });

    if (!response.ok) {
        throw new Error('Failed to create game');
    }

    return response.json();
};

const updateGame = async (gameId, gameData) => {
    const response = await fetch(`/api/games/${gameId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
    });

    if (!response.ok) {
        throw new Error('Failed to update game');
    }

    return response.json();
};

const getGameById = async (gameId) => {
    const response = await fetch(`/api/games/${gameId}`);

    if (!response.ok) {
        throw new Error('Failed to load game');
    }

    return response.json();
};

const deleteGame = async (gameId) => {
    const response = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete game');
    }

    return response.status === 204
        ? null
        : response.json();
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

const showFormError = (message) => {
    formMessage.textContent = message;
    formMessage.className = 'form_message error';
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

const showSearchErrorState = () => {
    gameLibrary.innerHTML = `
        <div class="error_state">
            <h3 class="error_state_title">
                Failed to search games
            </h3>
            <p class="error_state_description">
                Something went wrong while searching your game library.
            </p>
        </div>
    `;
};

const showEditFormError = (message) => {
    editFormMessage.textContent = message;
    editFormMessage.className = 'form_message error';
};

const openEditGame = async (gameId) => {
    console.log('Edit game: ', gameId);

    try {
        const game = await getGameById(gameId);

        console.log('Game to edit: ', game);

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
        console.log('Delete cancelled: ', gameId);
        return;
    }

    try {
        deleteButton.disabled = true;
        deleteButton.textContent = 'Deleting...';

        await deleteGame(gameId);

        console.log('Game deleted: ', gameId);

        await loadGames();
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

const loadGames = async () => {
    showLoadingState();

    try {
        const response = await fetch('/api/games');

        if (!response.ok) {
            throw new Error('Failed to load games');
        }

        const games = await response.json();

        renderGames(games);
    } catch (error) {
        console.error('Failed to load games: ', error);

        showErrorState();
    }
};

const searchGames = async (query) => {
    try {
        const response = await fetch(
            `/api/games?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error('Failed to search games');
        }

        const games = await response.json();

        renderGames(games, query);
    } catch (error) {
        console.error('Failed to search games: ', error);

        showSearchErrorState();
    }
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
        const card = document.createElement('div');

        card.className = 'game_card';

        const cover = game.cover_url 
            ? ` <img
                 class="game_cover"
                 src="${game.cover_url}"
                 alt="${game.title} cover"
            >`
            : '';

        card.innerHTML = `
            ${cover}

            <div class="game_content">
                <h3 class="game_title">${game.title}</h3>
            
                <p class="game_info">${game.genre}</p>
            
                <p class="game_info">${game.platform}</p>
            
                <p class="game_rating">
                    ⭐ ${game.rating ?? '-'}/10
                </p>
            
                <span class="game_status">
                    ${game.status}
                </span>

                <div class="game_actions">

                    <button
                        type="button"
                        class="edit_game_button"
                        data-id="${game.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete_game_button"
                        data-id="${game.id}"
                    >
                        Delete
                    </button>

                </div>
            </div>
        `;

        gameLibrary.appendChild(card);
    });
};

loadGames();

searchInput.addEventListener('input', (event) => {
    const query = event.target.value.trim();

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        searchGames(query);
    }, 300);
});

addGameButton.addEventListener('click', openAddGameModal);

addGameForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(addGameForm);

    const gameData = {
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

    const errors = validateGameData(gameData);

    if (errors.length > 0) {
        console.log('Validation errors: ', errors);

        showFormError(errors.join(', '));

        return;
    }

    showFormLoading();

    try {
        const game = await createGame(gameData);

        console.log('Game created: ', game);

        showFormSuccess();

        addGameForm.reset();

        await loadGames();

        setTimeout(() => {
            closeAddGameModal();
            resetFormState();
        }, 500);

    } catch (error) {
        console.error('Failed to create game: ', error);

        showFormError(
            'Failed to create game. Please try again.'
        );

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

    const formData = new FormData(editGameForm);

    const gameData = {
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

    console.log('Game update data: ', gameData);

    try {
        updateGameButton.disabled = true;
        updateGameButton.textContent = 'Updating...';

        const game = await updateGame(
            editingGameId,
            gameData
        );

        console.log('Game updated: ', game);

        closeEditGameModal();

        editingGameId = null;

        await loadGames();

        updateGameButton.disabled = false;
        updateGameButton.textContent = 'Update';
    } catch (error) {
        console.error('Failed to update game: ', error);

        updateGameButton.disabled = false;
        updateGameButton.textContent = 'Update';

        showEditFormError(
            'Failed to update game. Please try again.'
        );
    }
});