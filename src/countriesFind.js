import './styles.css';
import fetchCountries from './fetchCountries.js';
import countryListItemsTemplate from './tamplate/countryListItem.hbs';
import countriesListTemplate from './tamplate/countrieList.hbs';
import '@pnotify/core/dist/BrightTheme.css';
import debounce from 'lodash.debounce';
import 'material-design-icons/iconfont/material-icons.css';
import '@pnotify/bootstrap4/dist/PNotifyBootstrap4.css';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/Angeler.css';
import '@pnotify/bootstrap4/dist/PNotifyBootstrap4.css';
 import '@pnotify/core/dist/PNotify.js';


const refs = {
  searchForm: document.querySelector('#search-form'),
  countryList: document.querySelector('#country-list'),
  searchInput: document.querySelector('.search__input'),
};

refs.searchForm.addEventListener('submit', event => {
  event.preventDefault();
});

refs.searchForm.addEventListener(
  'input',
  debounce(e => {
    searchFormInputHandler(e);
  }, 500),
);

function searchFormInputHandler(e) {
  const searchQuery = e.target.value;

  clearListItems();

  fetchCountries(searchQuery).then(data => {
    const markup = buildListItemMarkup(data);
    const renderCountriesList = buildCountriesList(data);
    if (!data) {
      return;
    } else if (data.length > 10) {
      PNotify.defaults.styling = 'material';
      PNotify.error({
        text: 'Too many matches found. Please enter a more specific query!',
      });
    } else if (data.length >= 2 && data.length <= 10) {
      insertListItem(renderCountriesList);
    } else if (data.length === 1) {
      insertListItem(markup);
    } else {
      alert('Корректно введите запрос');
    }
  });
}

function insertListItem(items) {
  refs.countryList.insertAdjacentHTML('beforeend', items);
}

function buildCountriesList(items) {
  return countriesListTemplate(items);
}

function buildListItemMarkup(items) {
  return countryListItemsTemplate(items);
}

function clearListItems() {
  refs.countryList.innerHTML = '';
}
