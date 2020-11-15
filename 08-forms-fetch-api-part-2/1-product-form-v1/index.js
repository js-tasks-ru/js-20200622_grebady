import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';
import ListItem from "./listItem.js";

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {

  onSubmit = event => {
    event.preventDefault();
    this.save();
  }

  upgradeProductObj = event => {
    const input = event.target;
    if (!input) {
      return;
    }
    const key = input.getAttribute('name');
    if (key === 'discount' || key === 'price' || key === 'quantity' || key === 'status') {
      this.product[key] = parseInt(input.value);
    } else {
      this.product[key] = input.value;
    }
  }

  uploadImage = () => {
    const newFileButton = document.createElement('input');
    newFileButton.type = 'file';
    newFileButton.accept = 'image/*';
    newFileButton.click();

    const uploadToImgur = async () => {
      const [file] = newFileButton.files;
      if (!file) {return;}

      const formForNewFile = new FormData();
      formForNewFile.append('image', file);

      const {imageListContainer, uploadImage} = this.subElements;
      uploadImage.classList.add('is-loading');
      uploadImage.disabled = true;

      let responseJson = await fetchJson('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formForNewFile,
      });
      const url = responseJson.data.link;
      const source = file.name;

      imageListContainer.firstElementChild.insertAdjacentHTML('beforeend', new ListItem({url, source}).elementHTML);
      this.product.images.push({url, source});

      uploadImage.classList.remove('is-loading');
      uploadImage.disabled = false;

      newFileButton.remove();
      newFileButton.removeEventListener('change', uploadToImgur);
    };

    newFileButton.addEventListener('change', uploadToImgur);
  }

  deleteImage = event => {
    let imgTrash = event.target.closest('[data-delete-handle]');
    if (!imgTrash) {return;}

    while (imgTrash = imgTrash.parentElement) { // идти наверх до <html>
      if (imgTrash.classList.contains('sortable-list__item')) {
        const li = imgTrash;
        const input = li.querySelector('input');
        const key = input.getAttribute('name');
        const value = input.value;
        const deleteIndex = this.product.images.findIndex(image => image[key] === value);
        this.product.images = [...this.product.images.slice(0, deleteIndex), ...this.product.images.slice(deleteIndex + 1)];
        imgTrash.remove();
        return ;
      }
    }
  }



  constructor (productId = null) {
    this.urlProducts = new URL('api/rest/products', BACKEND_URL);
    this.urlCategories = new URL('api/rest/categories', BACKEND_URL);
    this.productId = productId;
    this.element = this.template;
    this.product = {
      description: '',
      discount: 0,
      id: productId,
      images: null,
      price: 100,
      quantity: 1,
      status: 1,
      subcategory: null,
      title: null,
    };
    this.subElements = this.getSubElements(this.element);
    this.findInputs = ['title', 'description', 'subcategory', 'price', 'discount', 'quantity', 'status'];
    this.fields = this.getFields();
    this.initEventListeners();
  }

  async render () {
    this.urlCategories.searchParams.set('_sort', 'weight');
    this.urlCategories.searchParams.set('_refs', 'subcategory');
    const jsonCategories = await fetchJson(this.urlCategories);
    const subcategory = this.fields.find(field => field.id === 'subcategory');
    subcategory.innerHTML = this.getCategories(jsonCategories);

    if (this.productId) {
      this.urlProducts.searchParams.set('id', this.product.id);
      const [inputsValues] = await fetchJson(this.urlProducts);
      this.product.images = inputsValues.images;

      for (const field of this.fields) {
        if (field.id in inputsValues) {
          field.value = inputsValues[field.id];
          this.product[field.id] = inputsValues[field.id];
        }
      }
      this.subElements.imageListContainer.innerHTML = `<ul class="sortable-list">${this.getImages(inputsValues.images)}</ul>`;
      this.subElements.imageListContainer.addEventListener('pointerdown', this.deleteImage);
    }

    else {
      for (const field of this.fields) {
        if (field.id in this.product) {
          if (field.id === 'subcategory') {
            field.value = jsonCategories[0].subcategories[0].id;
          }
          else {
            field.value = this.product[field.id];
          }
        }
      }

      this.product.subcategory = jsonCategories[0].subcategories[0].id;
    }
    return this.element;
  }

  get template() {
    const wrapper = document.createElement('div');
    wrapper.className = "product-form";
    wrapper.innerHTML = `
         <form data-element="productForm" class="form-grid is-loading">
            <div class="form-group form-group__half_left">
              <fieldset>
                <label class="form-label">Название товара</label>
                <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
              </fieldset>
            </div>
            <div class="form-group form-group__wide">
              <label class="form-label">Описание</label>
              <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
            </div>
            <div class="form-group form-group__wide" data-element="sortable-list-container">
              <label class="form-label">Фото</label>
              <div data-element="imageListContainer">
                <ul class="sortable-list">
                </ul>
              </div>
              <button type="button" data-element="uploadImage" class="button-primary-outline fit-content"><span>Загрузить</span></button>
            </div>
            <div class="form-group form-group__half_left">
              <label class="form-label">Категория</label>
              <select class="form-control" id="subcategory" name="subcategory">
              </select>
            </div>
            <div class="form-group form-group__half_left form-group__two-col">
              <fieldset>
                <label class="form-label">Цена ($)</label>
                <input id="price" required="" type="number" name="price" class="form-control" placeholder="100">
              </fieldset>
              <fieldset>
                <label class="form-label">Скидка ($)</label>
                <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0">
              </fieldset>
            </div>
            <div class="form-group form-group__part-half">
              <label class="form-label">Количество</label>
              <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
            </div>
            <div class="form-group form-group__part-half">
              <label class="form-label">Статус</label>
              <select id="status" class="form-control" name="status">
                <option value="1">Активен</option>
                <option value="0">Неактивен</option>
              </select>
            </div>
            <div class="form-buttons">
              <button id="save" type="submit" name="save" class="button-primary-outline">
                Сохранить товар
              </button>
            </div>
         </form>
    `;
    return wrapper;
  }
  getCategories(categories) {
    return categories.map(category => this.getSubcategories(category.title, category.subcategories)).join('');
  }
  getSubcategories(title, subcategories) {
    return subcategories.map(subCategory => this.getOption(title, subCategory)).join('');
  }

  getOption(category, {title: subCategory, id}) {
    return `<option value="${id}">${category} &gt; ${subCategory}</option>`;
  }

  getImages(images) {
    return images.map(infoImage => new ListItem(infoImage).elementHTML).join('');
  }

  async save() {
    if (!this.productId) {
      this.product.id = this.transliter(this.product.title);
    }
    let responseJson = await fetchJson(`${BACKEND_URL}/api/rest/products`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(this.product),
    });

    if (responseJson) {
      this.dispatchEvent();
    }
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  getFields() {
    const {productForm: form} = this.subElements;
    return this.findInputs.map(fieldId => form.querySelector(`#${fieldId}`));
  }

  transliter(str) {
    const ru = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
      'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
      'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
      'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
      'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya', ' ': '-'
    };
    const n_str = [];
    str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');

    for (const letter of str) {
      n_str.push(
        ru[letter]
        || ru[letter.toLowerCase()] === undefined && letter
        || ru[letter.toLowerCase()].replace(/^(.)/, function (match) { return match.toUpperCase(); })
      );
    }

    return n_str.join('');
  }

  initEventListeners() {
    const {uploadImage, productForm: form} = this.subElements;
    uploadImage.addEventListener('pointerdown', this.uploadImage);
    form.addEventListener('change', this.upgradeProductObj);
    form.addEventListener('submit', this.onSubmit);
  }

  dispatchEvent() {
    const event = this.productId ?
      new CustomEvent('product-updated', {bubbles: true, detail: this.product.id})
      :
      new CustomEvent('product-saved', {bubbles: true});
    this.element.dispatchEvent(event);
  }


  remove () {
    this.element.remove();
  }

  destroy() {
    this.columns = null;
    this.element.remove();
  }
}
