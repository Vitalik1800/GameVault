const apiRequest = async (
    url,
    options = {},
    errorMessage = 'Request failed'
) => {
    const response = await fetch(url, options);

    if (!response.ok) {
        const errorData = await response.json().catch(
            () => null
        );

        console.error(
            'API error:',
            response.status,
            errorData
        );

        throw new Error(
            errorData?.error || errorMessage
        );
    }

    return response.status === 204
        ? null
        : response.json();
};

const createGame = (gameData) => {
    return apiRequest(
        '/api/games',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        },
        'Failed to create game'
    );
};

const updateGame = (gameId, gameData) => {
    return apiRequest(
        `/api/games/${gameId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        },
        'Failed to update game'
    );
};

const getGameById = (gameId) => {
    return apiRequest(
        `/api/games/${gameId}`,
        {},
        'Failed to load game'
    );
};

const deleteGame = (gameId) => {
    return apiRequest(
        `/api/games/${gameId}`,
        {
            method: 'DELETE'
        },
        'Failed to delete game'
    );
};

const updateWishlist = (gameId, isWishlist) => {
    return apiRequest(
        `/api/games/${gameId}/wishlist`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isWishlist
            })
        },
        'Failed to update wishlist'
    );
};