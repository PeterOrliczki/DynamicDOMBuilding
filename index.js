const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let loadButtonEl;

function createPostsList(posts) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        // creating paragraph
        const strongEl = document.createElement('strong');
        strongEl.textContent = post.title;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`: ${post.body}`));

        // creating list item
        const liEl = document.createElement('li');
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function onPostsReceived() {
    postsDivEl.style.display = 'block';

    const text = this.responseText;
    const posts = JSON.parse(text);

    const divEl = document.getElementById('posts-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createPostsList(posts));
}

function onLoadPosts() {
    const el = this;
    const userId = el.getAttribute('data-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPostsReceived);
    xhr.open('GET', BASE_URL + '/posts?userId=' + userId);
    xhr.send();
}

function createPhotosList(photos) {
    const ulEl = document.createElement('ul');
    ulEl.classList.add('photos');

    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];

        ulEl.setAttribute('id', photo.albumId);

        const aEl = document.createElement('a');
        aEl.setAttribute('href', photo.url);

        const imgEl = document.createElement('img');
        imgEl.setAttribute('src', photo.thumbnailUrl);
        aEl.appendChild(imgEl);

        const liEl = document.createElement('li');
        liEl.appendChild(aEl);

        ulEl.appendChild(liEl);
    }
    return ulEl;
}

function createAlbumsList(albums) {
    const ulEl = document.createElement('ul');

    const h2El = document.createElement('h2');
    h2El.textContent = 'Albums';
    ulEl.appendChild(h2El);

    for (let i = 0; i < albums.length; i++) {
        const album = albums[i];

        const strongEl = document.createElement('strong');
        strongEl.textContent = album.title;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);

        const albumId = album.id;
        pEl.setAttribute('id', albumId);
        pEl.addEventListener('click', onLoadPhotos);

        const liEl = document.createElement('li');
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }
    return ulEl;
}

function createUsersTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    return theadEl;
}

function createUsersTableBody(users) {
    const tbodyEl = document.createElement('tbody');

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // creating id cell
        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        // creating name cell
        const dataUserIdAttr = document.createAttribute('data-user-id');
        dataUserIdAttr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadPosts);

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonEl);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);

        tbodyEl.appendChild(trEl);
    }

    return tbodyEl;
}

function createUsersTable(users) {
    const tableEl = document.createElement('table');
    tableEl.appendChild(createUsersTableHeader());
    tableEl.appendChild(createUsersTableBody(users));
    return tableEl;
}

function onUsersReceived() {
    loadButtonEl.remove();

    const text = this.responseText;
    const users = JSON.parse(text);

    const divEl = document.getElementById('users-content');
    divEl.appendChild(createUsersTable(users));
}

function onLoadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.open('GET', BASE_URL + '/users');
    xhr.send();
}

document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    loadButtonEl = document.getElementById('load-users');
    loadButtonEl.addEventListener('click', onLoadUsers);
});