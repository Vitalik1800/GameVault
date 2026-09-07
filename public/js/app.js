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

const refreshGameData = async () => {
    await loadGamesWithControls();
    await loadWishlist();
    await loadDashboardStats();
};

loadSettings();
applySettings();

loadGamesWithControls();
loadWishlist();
loadFilterOptions();
loadDashboardStats();