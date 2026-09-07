const wishlistSection = document.getElementById(
    'wishlist_section'
);

const wishlistLibrary = document.getElementById(
    'wishlist_library'
);

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