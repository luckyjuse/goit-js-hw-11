import './css/styles.css';
import { Notify } from 'notiflix';
import PixabaeApiService from './js/pixabae-api';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryDiv: document.querySelector('.gallery'),
  loadButton: document.querySelector('.load-more'),
};

const pixabaeApiService = new PixabaeApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadButton.addEventListener('click', onLoadMore);
refs.loadButton.classList.add('visually-hidden');

function onSearch(e) {
  e.preventDefault();
  clearGalleryDiv();
  pixabaeApiService.name = e.currentTarget.elements.searchQuery.value.trim();
  pixabaeApiService.resetPage();
  if (pixabaeApiService.name === '') {
    Notify.warning('Please enter a non empty search string.');
    refs.loadButton.classList.add('visually-hidden');
    return;
  }

  loadImages();
}

async function loadImages() {
  const imagesObject = await pixabaeApiService.fetchImages();
  if (imagesObject.length === 0) {
    refs.loadButton.classList.add('visually-hidden');
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  renderImages(imagesObject);
  refs.loadButton.classList.remove('visually-hidden');
}

async function onLoadMore() {
  pixabaeApiService.incrementPage();
  const imagesObject = await pixabaeApiService.fetchImages();
  if (imagesObject.length < 40) {
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
  renderImages(imagesObject);
}

function renderImages(images) {
  const galleryMarkup = images
    .map(
      image =>
        `<a class="photo-link" href="${image.largeImageURL}">
    <div class="photo-card">
    <div class="photo">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/>
    </div>
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    ${image.likes}
                </p>
                <p class="info-item">
                    <b>Views</b>
                    ${image.views}
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    ${image.comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    ${image.downloads}
                </p>
            </div>
    </div>
</a>`
    )
    .join('');
  refs.galleryDiv.insertAdjacentHTML('beforeend', galleryMarkup);
}

function clearGalleryDiv() {
  refs.galleryDiv.innerHTML = '';
}
