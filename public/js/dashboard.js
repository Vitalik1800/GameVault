const totalGamesStat = document.getElementById(
    'total_games_stat'
);

const completedGamesStat = document.getElementById(
    'completed_games_stat'
);

const playingGamesStat = document.getElementById(
    'playing_games_stat'
);

const backlogGamesStat = document.getElementById(
    'backlog_games_stat'
);

const averageRatingStat = document.getElementById(
    'average_rating_stat'
);

const loadDashboardStats = async () => {
    try {
        const stats = await apiRequest(
            '/api/games/stats',
            {},
            'Failed to load dashboard statistics'
        );

        totalGamesStat.textContent =
            stats.totalGames;

        completedGamesStat.textContent =
            stats.byStatus.Completed || 0;

        playingGamesStat.textContent =
            stats.byStatus.Playing || 0;

        backlogGamesStat.textContent =
            stats.byStatus.Backlog || 0;

        averageRatingStat.textContent =
            stats.averageRating ?? 0;

    } catch (error) {
        console.error(
            'Failed to load dashboard statistics: ',
            error
        );

        totalGamesStat.textContent = '-';
        completedGamesStat.textContent = '-';
        playingGamesStat.textContent = '-';
        backlogGamesStat.textContent = '-';
        averageRatingStat.textContent = '-';
    }
};