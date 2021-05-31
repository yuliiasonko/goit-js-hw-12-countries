const debounce = require('lodash.debounce');

import error from './pnotify';
import { refs } from './refs';
import fetchCountries from './fetchCountries';
import countryListItemTempalte from './tamplate/countryListItem.hbs'


refs.input.addEventListener(
  'input',
  debounce(handleGenerateListFromResponse, 1000),
);

// Забираем значение с инпута 
function handleGenerateListFromResponse(event) {
  let inputValue = event.target.value.trim();

  if (!inputValue) {      
    error404();
    return;
  }

    getCountriesList(inputValue)
}

// Создаем разметку страны по шаблону hbs
function addFullCoutryInfo(country) {
  const markup = countryListItemTempalte(country);

   //   Добавляем новую разметку страны
  refs.countryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearContent(){
  refs.input.value = '';
  refs.inputMessage.innerHTML = '';
  refs.inputList.innerHTML = '';
  refs.countryContainer.innerHTML = '';  
}

// Выводим значение в зависимости от полученого к-ва стран
function selectTypeOutputInfo(numberOfCountries) {
  console.log(numberOfCountries);

  if (numberOfCountries.length < 2) {
    clearContent();
    addFullCoutryInfo(numberOfCountries);
  }

  if(numberOfCountries.length >= 2 && numberOfCountries.length <= 10) {
        clearContent();                    
        numberOfCountries.forEach(country => {
            refs.inputList.insertAdjacentHTML('beforeend',`<li>${country.name}</li>`)
        });             

        refs.inputList.addEventListener('click', e => {
            clearContent();
            const getInputValue = refs.input.value = e.target.textContent;            
            const country = numberOfCountries.find(country => {              
              return country.name === getInputValue
            })            
            addFullCoutryInfo({country});
        })                 
    }
 
  if (numberOfCountries.length > 10) {
    clearContent();
    const message = 'Найдено слишком много совпадений, уточните ваш запрос'
    refs.inputMessage.insertAdjacentHTML('beforeend', message);
    error({
      title: 'Ошибка',
      text: message,
      delay: 2000,  
  }); 
  }
}

function getCountriesList(value) {
  fetchCountries(value)
    .then(countries => selectTypeOutputInfo(countries))
    .catch(error => error404(error));
}

function error404(err){
  clearContent();
  const message = 'Не корректный запрос. Повторите попытку еще раз'
  refs.inputMessage.insertAdjacentHTML('beforeend', message);  
}