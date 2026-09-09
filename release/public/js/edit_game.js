const editGameForm = document.getElementById(
    'edit_game_form'
);

const editTitleInput = document.getElementById(
    'edit_title'
);

const editDescriptionInput = document.getElementById(
    'edit_description'
);

const editGenreInput = document.getElementById(
    'edit_genre'
);

const editPlatformInput = document.getElementById(
    'edit_platform'
);

const editStatusInput = document.getElementById(
    'edit_status'
);

const editRatingInput = document.getElementById(
    'edit_rating'
);

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
        console.error(
            'Failed to load game: ',
            error
        );

        alert(
            'Failed to load game. Please try again.'
        );
    }
};

const openDeleteGame = async (
    gameId,
    deleteButton
) => {
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
        console.error(
            'Failed to delete game: ',
            error
        );

        deleteButton.disabled = false;
        deleteButton.textContent = 'Delete';

        alert(
            'Failed to delete game. Please try again.'
        );
    }
};

editGameForm.addEventListener(
    'submit',
    async (event) => {
        event.preventDefault();

        if (!editingGameId) {
            console.error(
                'No game selected for editing'
            );

            return;
        }

        const gameData = getGameFormData(
            editGameForm
        );

        const errors = validateGameData(gameData);

        if (errors.length > 0) {
            showFormError(
                editFormMessage,
                errors.join(', ')
            );

            return;
        }

        try {
            updateGameButton.disabled = true;
            updateGameButton.textContent = 'Updating...';

            await updateGame(
                editingGameId,
                gameData
            );

            closeEditGameModal();

            editingGameId = null;

            await refreshGameData();

            updateGameButton.disabled = false;
            updateGameButton.textContent = 'Update';
        } catch (error) {
            console.error(
                'Failed to update game: ',
                error
            );

            updateGameButton.disabled = false;
            updateGameButton.textContent = 'Update';

            showFormError(
                editFormMessage,
                'Failed to update game. Please try again.'
            );
        }
    }
);