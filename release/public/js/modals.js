const addGameButton = document.getElementById(
    'add_game_button'
);

const addGameModal = document.getElementById(
    'add_game_modal'
);

const closeModalButton = document.getElementById(
    'close_modal_button'
);

const cancelModalButton = document.getElementById(
    'cancel_modal_button'
);

const modalOverlay = document.querySelector(
    '.modal_overlay'
);

const editGameModal = document.getElementById(
    'edit_game_modal'
);

const closeEditModalButton = document.getElementById(
    'close_edit_modal_button'
);

const cancelEditModalButton = document.getElementById(
    'cancel_edit_modal_button'
);

const editModalOverlay = document.querySelector(
    '.edit_modal_overlay'
);

const openAddGameModal = () => {
    addGameModal.classList.add('active');
};

const closeAddGameModal = () => {
    addGameModal.classList.remove('active');
};

const closeEditGameModal = () => {
    editGameModal.classList.remove('active');
};

addGameButton.addEventListener(
    'click',
    openAddGameModal
);

closeModalButton.addEventListener(
    'click',
    closeAddGameModal
);

cancelModalButton.addEventListener(
    'click',
    closeAddGameModal
);

modalOverlay.addEventListener(
    'click',
    closeAddGameModal
);

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

document.addEventListener(
    'keydown',
    (event) => {
        if (event.key !== 'Escape') {
            return;
        }

        closeAddGameModal();
        closeEditGameModal();
        closeSettingsModal();
    }
);