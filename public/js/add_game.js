const addGameForm = document.getElementById(
    'add_game_form'
);

const saveGameButton = document.getElementById(
    'save_game_button'
);

const formMessage = document.getElementById(
    'form_message'
);

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

const showFormError = (
    messageElement,
    message
) => {
    messageElement.textContent = message;
    messageElement.className = 'form_message error';
};

const resetFormState = () => {
    saveGameButton.disabled = false;
    saveGameButton.textContent = 'Save';

    formMessage.textContent = '';
    formMessage.className = 'form_message';
};

addGameForm.addEventListener(
    'submit',
    async (event) => {
        event.preventDefault();

        const gameData = getGameFormData(
            addGameForm
        );

        const errors = validateGameData(
            gameData
        );

        if (errors.length > 0) {
            showFormError(
                formMessage,
                errors.join(', ')
            );

            return;
        }

        showFormLoading();

        try {
            await createGame(gameData);

            showFormSuccess();

            addGameForm.reset();

            await loadFilterOptions();
            await refreshGameData();

            setTimeout(() => {
                closeAddGameModal();
                resetFormState();
            }, 500);

        } catch (error) {
            console.error(
                'Failed to create game: ',
                error
            );

            showFormError(
                formMessage,
                'Failed to create game. Please try again.'
            );

            resetFormState();
        }
    }
);