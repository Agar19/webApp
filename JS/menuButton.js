document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.createElement('button');
    menuButton.classList.add('menu-button');
    menuButton.innerHTML = '☰';
    const header = document.querySelector('header');
    const nav = header.querySelector('nav');

    header.insertBefore(menuButton, nav);

    menuButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
});
