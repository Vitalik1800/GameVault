const wishlistNavItem = document.getElementById(
    'wishlist_nav_item'
);

const dashboardNavItem = document.getElementById(
    'dashboard_nav_item'
);

const libraryNavItem = document.getElementById(
    'library_nav_item'
);

const addGameNavItem = document.getElementById(
    'add_game_nav_item'
);

const settingsNavItem = document.getElementById(
    'settings_nav_item'
);

const setActiveNavigation = (activeItem) => {
    const navigationItems = document.querySelectorAll(
        '.nav_item'
    );

    navigationItems.forEach((item) => {
        item.classList.remove('active');
    });

    activeItem.classList.add('active');
};

const handleNavigation = (
    event,
    navigationItem,
    action
) => {
    event.preventDefault();

    setActiveNavigation(navigationItem);

    action();
};

wishlistNavItem.addEventListener(
    'click',
    (event) => {
        handleNavigation(
            event,
            wishlistNavItem,
            () => {
                wishlistSection.scrollIntoView({
                    behavior: 'smooth'
                });

                loadWishlist();
            }
        );
    }
);

dashboardNavItem.addEventListener(
    'click',
    (event) => {
        handleNavigation(
            event,
            dashboardNavItem,
            () => {
                document.querySelector('.dashboard')
                    .scrollIntoView({
                        behavior: 'smooth'
                    });
            }
        );
    }
);

libraryNavItem.addEventListener(
    'click',
    (event) => {
        handleNavigation(
            event,
            libraryNavItem,
            () => {
                document.querySelector('.library')
                    .scrollIntoView({
                        behavior: 'smooth'
                    });
            }
        );
    }
);

addGameNavItem.addEventListener(
    'click',
    (event) => {
        handleNavigation(
            event,
            addGameNavItem,
            openAddGameModal
        );
    }
);

settingsNavItem.addEventListener(
    'click',
    (event) => {
        handleNavigation(
            event,
            settingsNavItem,
            openSettingsModal
        );
    }
);