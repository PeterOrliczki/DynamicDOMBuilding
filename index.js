const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let loadButtonEl;
let albumsDivEl;

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

        const postIdAttr = post.id;
        pEl.setAttribute('post-id', postIdAttr);
        pEl.addEventListener('click', onLoadComments);

        // creating list item
        const liEl = document.createElement('li');
        liEl.setAttribute('id', postIdAttr)
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function onPostsReceived() {
    postsDivEl.style.display = 'block';
    albumsDivEl.style.display = 'none';

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

function onPhotosReceived() {
    const text = this.responseText;
    const photos = JSON.parse(text);
    const albumId = photos[0].albumId;

    const photoList = document.getElementsByClassName('photos');
    for (let i = 0; i < photoList.length; i++) {
        const photo = photoList[i];
        if (photo.getAttribute('id') !== albumId) {
            photo.remove();
        }
    }

    const divClickedAlbum = document.getElementById(albumId);
    if (divClickedAlbum.childNodes.length <= 1) {
        divClickedAlbum.appendChild(createPhotosList(photos));
    }
}

function onLoadPhotos() {
    const albumEl = this;
    const albumId = albumEl.getAttribute('id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPhotosReceived);
    xhr.open('GET', BASE_URL + '/photos?albumId=' + albumId);
    xhr.send();
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

function onAlbumsReceived() {
    albumsDivEl.style.display = 'block';
    postsDivEl.style.display = 'none';

    const text = this.responseText;
    const albums = JSON.parse(text);

    const albumDivEl = document.getElementById('albums-content');

    while (albumDivEl.firstChild) {
        albumDivEl.removeChild(albumDivEl.firstChild);
    }
    albumDivEl.appendChild(createAlbumsList(albums));
}

function onLoadAlbums() {
    const albumEl = this;
    const userId = albumEl.getAttribute('album-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAlbumsReceived);
    xhr.open('GET', BASE_URL + '/albums?userId=' + userId);
    xhr.send();
}

function createCommentsList(comments) {
    const ulEl = document.createElement('ul');
    ulEl.classList.add('comments');

    const h3El = document.createElement('h3');
    h3El.textContent = 'Comments';
    ulEl.appendChild(h3El);

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        ulEl.setAttribute('id', comment.postId);

        const strongEl = document.createElement('strong');
        strongEl.textContent = comment.name;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`: ${comment.body}`));

        const liEl = document.createElement('li');
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }
    return ulEl;
}

function onCommentsReceived() {
    const text = this.responseText;
    const comments = JSON.parse(text);
    const postId = comments[0].postId;
    const idList = document.getElementsByClassName('comments');

    for (let i = 0; i < idList.length; i++) {
        const comment = idList[i];
        if (comment.getAttribute('id') !== postId) {
            comment.remove();
        }
    }
    const postDivEl = document.getElementById(postId);
    if (postDivEl.childNodes.length <= 1) {
        postDivEl.appendChild(createCommentsList(comments));
    }
}

function onLoadComments() {
    const postEl = this;
    const postId = postEl.getAttribute('post-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onCommentsReceived);
    xhr.open('GET', BASE_URL + '/comments?postId=' + postId);
    xhr.send();
}

function createUsersTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name';

    const albumTdEl = document.createElement('td');
    albumTdEl.textContent = 'Album';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    trEl.appendChild(albumTdEl);

    return theadEl;
}

function createUsersTableBody(users) {
    const tbodyEl = document.createElement('tbody');

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        const dataUserIdAttr = document.createAttribute('data-user-id');
        dataUserIdAttr.value = user.id;

        const albumUserIdAttr = document.createAttribute('album-user-id');
        albumUserIdAttr.value = user.id;

        const buttonNameEl = document.createElement('button');
        buttonNameEl.textContent = user.name;

        const buttonAlbumEl = document.createElement('button');
        buttonAlbumEl.textContent = 'Albums of ' + user.name;

        buttonNameEl.setAttributeNode(dataUserIdAttr);
        buttonAlbumEl.setAttributeNode(albumUserIdAttr);

        buttonNameEl.addEventListener('click', onLoadPosts);
        buttonAlbumEl.addEventListener('click', onLoadAlbums);

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonNameEl);

        const albumTdEl = document.createElement('td');
        albumTdEl.appendChild(buttonAlbumEl);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);
        trEl.appendChild(albumTdEl);

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
    albumsDivEl = document.getElementById('albums');
    loadButtonEl = document.getElementById('load-users');
    loadButtonEl.addEventListener('click', onLoadUsers);
});