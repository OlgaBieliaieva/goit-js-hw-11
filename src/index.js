import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './get-images';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchFormInput: document.querySelector('.search-form input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

let queryValue = '';

function onSearch(event) {
  event.preventDefault();

  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  queryValue = searchQuery.value.trim().toLowerCase();

  if (queryValue.length === 0) {
    return;
  }

  getImages(queryValue).then(checkResult).catch(showError);
}

function checkResult(result) {
  if (result.data.total === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.searchFormInput.value = '';
    return;
  } else {
    Notify.info(`Hooray! We found ${result.data.totalHits} images.`);
  }
  createGalleryMarkup(result.data.hits);
}

function showError(error) {
  console.log(error);
}

function createGalleryMarkup(data) {
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
  showGallery(galleryMarkup);
}

function showGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  refs.loadMoreBtn.classList.remove('is-hidden');

  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function onLoadMore() {
  getImages(queryValue).then(checkLoadMoreResult).catch(showError);
}

function checkLoadMoreResult(result) {
  if (result.data.hits.length === 0) {
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }
  createGalleryMarkup(result.data.hits);
}
