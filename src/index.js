import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './get-images';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchFormInput: document.querySelector('.search-form input'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();

  refs.gallery.innerHTML = '';

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  const queryValue = searchQuery.value.trim().toLowerCase();

  if (queryValue.length === 0) {
    return;
  }

  getImages(queryValue).then(showResult).catch(showError);
}

function showResult(result) {
  if (result.data.total === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.searchFormInput.value = '';
    return;
  } else {
    Notify.info(`Hooray! We found ${result.data.total} images.`);
  }
  console.log(result);
  createGalleryMarkup(result.data.hits);
}

function showError(error) {
  console.log(error);
}

function createGalleryMarkup(data) {
  console.log(data);
  const galleryMarkup = data
    .map(
      element => `<a class="item" href="${element.largeImageURL}">
      <div class="photo-card">
  <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${element.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${element.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${element.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${element.downloads}</b>
    </p>
  </div>
</div></a>`
    )
    .join('');
  addMarkup(galleryMarkup);
}

function addMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}
