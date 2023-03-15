import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/?';

export async function getImages(value) {
  const options = new URLSearchParams({
    key: '34369155-5d93acadffc22e75da017de5a',
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  });
  try {
    const response = await axios.get(`${BASE_URL}${options}`);
    const images = await response;

    return images;
  } catch (error) {
    console.log(error);
  }
}
