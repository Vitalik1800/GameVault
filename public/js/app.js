const gameLibrary = document.getElementById('game_library');

const addGameButton = document.getElementById('add_game_button');
const addGameModal = document.getElementById('add_game_modal');
const addGameForm = document.getElementById('add_game_form');

const closeModalButton = document.getElementById('close_modal_button');
const cancelModalButton = document.getElementById('cancel_modal_button');
const modalOverlay = document.querySelector('.modal_overlay');

const saveGameButton = document.getElementById('save_game_button');
const formMessage = document.getElementById('form_message');

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

const renderGames = (games) => {
    gameLibrary.innerHTML = '';

    if (games.length === 0) {
        const emptyState = document.createElement('div');

        emptyState.className = 'empty_state';

        emptyState.innerHTML = `
            <h3 class="empty_state_title">No games found</h3>
            <p class="empty_state_description">
                Your game library is empty.
            </p>
        `;

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
            </div>
        `;

        gameLibrary.appendChild(card);
    });
};

loadGames();

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