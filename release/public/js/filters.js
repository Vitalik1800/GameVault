const searchInput = document.getElementById(
    'search_input'
);

const genreFilter = document.getElementById(
    'genre_filter'
);

const platformFilter = document.getElementById(
    'platform_filter'
);

const statusFilter = document.getElementById(
    'status_filter'
);

const ratingFilter = document.getElementById(
    'rating_filter'
);

const sortFilter = document.getElementById(
    'sort_filter'
);

let searchTimeout = null;

const sortMap = {
    title_asc: {
        sort: 'title',
        order: 'asc'
    },
    title_desc: {
        sort: 'title',
        order: 'desc'
    },
    rating_asc: {
        sort: 'rating',
        order: 'asc'
    },
    rating_desc: {
        sort: 'rating',
        order: 'desc'
    },
    release_year_asc: {
        sort: 'release_year',
        order: 'asc'
    },
    release_year_desc: {
        sort: 'release_year',
        order: 'desc'
    }
};

const setQueryParam = (
    params,
    key,
    value
) => {
    if (value) {
        params.set(key, value);
    }
};

const loadGamesWithControls = async () => {
    try {
        const params = new URLSearchParams();

        const query = searchInput.value.trim();
        const genre = genreFilter.value;
        const platform = platformFilter.value;
        const status = statusFilter.value;
        const rating = ratingFilter.value;
        const sortValue = sortFilter.value;

        setQueryParam(params, 'q', query);
        setQueryParam(params, 'genre', genre);
        setQueryParam(params, 'platform', platform);
        setQueryParam(params, 'status', status);
        setQueryParam(params, 'rating', rating);

        if (sortValue) {
            const selectedSort = sortMap[sortValue];

            if (selectedSort) {
                params.set(
                    'sort',
                    selectedSort.sort
                );

                params.set(
                    'order',
                    selectedSort.order
                );
            }
        }

        const queryString = params.toString();

        const url = queryString
            ? `/api/games?${queryString}`
            : '/api/games';

        const games = await apiRequest(
            url,
            {},
            'Failed to load games with controls'
        );

        renderGames(games, query);

    } catch (error) {
        console.error(
            'Failed to load games with controls: ',
            error
        );

        showErrorState();
    }
};

const getUniqueSortedValues = (
    games,
    key
) => {
    return [
        ...new Set(
            games
                .map((game) => game[key])
                .filter(Boolean)
        )
    ].sort();
};

const populateSelect = (
    select,
    defaultLabel,
    values
) => {
    select.innerHTML = `
        <option value="">${defaultLabel}</option>
    `;

    values.forEach((value) => {
        const option = document.createElement(
            'option'
        );

        option.value = value;
        option.textContent = value;

        select.appendChild(option);
    });
};

const loadFilterOptions = async () => {
    try {
        const games = await apiRequest(
            '/api/games',
            {},
            'Failed to load filter options'
        );

        const genres = getUniqueSortedValues(
            games,
            'genre'
        );

        const platforms = getUniqueSortedValues(
            games,
            'platform'
        );

        populateSelect(
            genreFilter,
            'All genres',
            genres
        );

        populateSelect(
            platformFilter,
            'All platforms',
            platforms
        );

    } catch (error) {
        console.error(
            'Failed to load filter options: ',
            error
        );
    }
};

searchInput.addEventListener(
    'input',
    () => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            loadGamesWithControls();
        }, 300);
    }
);

genreFilter.addEventListener(
    'change',
    loadGamesWithControls
);

platformFilter.addEventListener(
    'change',
    loadGamesWithControls
);

statusFilter.addEventListener(
    'change',
    loadGamesWithControls
);

ratingFilter.addEventListener(
    'change',
    loadGamesWithControls
);

sortFilter.addEventListener(
    'change',
    loadGamesWithControls
);