import './styles/main.scss';

import header from './components/header.html';

function initApp() {
    document.body.style.backgroundColor = 'rgb(55, 65, 81)';
    const root = document.getElementById('root');
    root.innerHTML = header;
    setTimeout(() => (root.style.opacity = 1), 500);
}

setTimeout(() => initApp(), 2000);
