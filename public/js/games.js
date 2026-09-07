const gameLibrary = document.getElementById(
    'game_library'
);

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
                <h3 class="empty_state_title">
                    No games found
                </h3>

                <p class="empty_state_description">
                    No games match "${searchQuery}".
                </p>
            `;
        } else {
            emptyState.innerHTML = `
                <h3 class="empty_state_title">
                    No games found
                </h3>

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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderGames
    };
}