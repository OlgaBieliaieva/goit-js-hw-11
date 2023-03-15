import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/?';
const REQUEST_OPTIONS = {
  key: '34369155-5d93acadffc22e75da017de5a',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 1,
};

export async function getImages(value) {
  if (REQUEST_OPTIONS.q !== value) {
    REQUEST_OPTIONS.q = value;
    REQUEST_OPTIONS.page = 1;
  }
  const options = new URLSearchParams(REQUEST_OPTIONS);
  try {
    const response = await axios.get(`${BASE_URL}${options}`);
    REQUEST_OPTIONS.page += 1;
    return response;
  } catch (error) {
    console.log(error);
  }
}
