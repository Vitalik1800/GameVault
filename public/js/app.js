const gameLibrary = document.getElementById('game_library');

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
            <h3 class="error_state_title"Failed to load games</h3>
            <p class="error_state_description">
                Something went wrong while loading your game library.
            </p>
        </div>
    `;
}

const loadGames = async () => {
    showLoadingState();

    await new Promise((resolve) => setTimeout(resolve, 2000));

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