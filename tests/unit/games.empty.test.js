const createMockElement = () => {
    return {
        className: '',
        innerHTML: '',
        children: [],

        appendChild(child) {
            this.children.push(child);
        }
    };
};

const gameLibrary = createMockElement();

global.document = {
    getElementById(id) {
        if (id === 'game_library') {
            return gameLibrary;
        }

        return null;
    },

    createElement() {
        return createMockElement();
    }
};

const { renderGames } = require('../../public/js/games.js');

require('../../public/js/games.js');

describe('Frontend empty library state', () => {
    beforeEach(() => {
        gameLibrary.innerHTML = '';
        gameLibrary.children = [];
    });

    test('shows empty state when game library is empty', () => {
        renderGames([]);

        expect(gameLibrary.children).toHaveLength(1);

        const emptyState = gameLibrary.children[0];

        expect(emptyState.className)
            .toBe('empty_state');

        expect(emptyState.innerHTML)
            .toContain('No games found');

        expect(emptyState.innerHTML)
            .toContain('Your game library is empty.');
    });
});