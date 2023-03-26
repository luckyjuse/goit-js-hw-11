import axios from 'axios';

export default class PixabaeApiService {
  constructor() {
    this.searchName = '';
    this.page = 1;
  }
  async fetchImages() {
    const options = {
      params: {
        key: '34710417-ba0b5e42dac676f820d92032d',
        q: `${this.searchName}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      },
    };

    const BASE_URL = 'https://pixabay.com/api/';

    const { data } = await axios.get(BASE_URL, options);
    return data.hits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get name() {
    return this.searchName;
  }

  set name(newName) {
    this.searchName = newName;
  }
}
