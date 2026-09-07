gameLibrary.addEventListener(
    'click',
    async (event) => {
        const editButton = event.target.closest(
            '.edit_game_button'
        );

        if (editButton) {
            const gameId = Number(
                editButton.dataset.id
            );

            openEditGame(gameId);

            return;
        }

        const deleteButton = event.target.closest(
            '.delete_game_button'
        );

        if (deleteButton) {
            const gameId = Number(
                deleteButton.dataset.id
            );

            await openDeleteGame(
                gameId,
                deleteButton
            );

            return;
        }

        const wishlistButton = event.target.closest(
            '.wishlist_game_button'
        );

        if (wishlistButton) {
            const gameId = Number(
                wishlistButton.dataset.id
            );

            const game = await getGameById(gameId);

            await updateWishlist(
                gameId,
                !game.is_wishlist
            );

            await refreshGameData();
        }
    }
);