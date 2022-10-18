import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../css/style.css';
import { fetchCountries } from './fetchCountries';
import { getRefs } from './getRefs';

const refs = getRefs();

const DEBOUNCE_DELAY = 300;

refs.countryInfo.innerHTML = '';
refs.countryList.innerHTML = '';

Notify.init({
  width: '280px',
  position: 'center-top',
  timeout: 2500,
  plainText: true,
  borderRadius: '10px',
  cssAnimationStyle: 'zoom'
});

refs.searchField.addEventListener('input', debounce(searchFieldInput, DEBOUNCE_DELAY));

function searchFieldInput(e) {
  const name = (e.target.value.trim());
  if (name === '') {
    return clearMarkup();
  }

  console.log(name);
  fetchCountries(name).then(data => {


    if (data.length > 10) {
      Notify.info("Too many matches found. Please enter a more specific name.");
      clearMarkup();

    } if (data.length >= 2 && data.length <= 10) {
      createCountriesList(data);

    } if (data.length === 1) {
      createTargetCountry(data);

    }

  }).catch(error => {
    Notify.failure("Oops, there is no country with that name");
    clearMarkup();
  });

}


function createCountriesList(e) {

  const makeCountryList = e.map(({ flags, name }) => {

    return `<li class = 'country-list__item'>
      <img src="${flags.svg}" width = 50 alt = "flag of ${name.official}">
      <p class ='country-list__name'>${name.official}</p>
      </li>`;
  }).join('');
  refs.countryList.innerHTML = makeCountryList;
  refs.countryInfo.innerHTML = '';
};

function createTargetCountry(e) {
  const makeCountryList = e.map(({ flags, name }) => {

    return `<li class = 'country-list__item'>
      <div class='img-wrap'>
      <img src="${flags.svg}" width = 100 alt = "flag of ${name.official}">
      </div>
      <p class ='country-list__name country-list__name--big'>${name.official}</p>
      </li>`;
  }).join('');

  const makeTargetCounrty = e.map(({ capital, population, languages }) => {

    const langCountry = Object.values(languages).join(', ');

    return `
              <p><b>Population: </b><span class ='country-info__item'>${population}</span></p>
              <p><b>Capital: </b><span class ='country-info__item'>${capital}</span></p>
              <p><b>Languages: </b><span class ='country-info__item'>${langCountry}</span></p>
          `;
  }).join('');

  refs.countryInfo.innerHTML = makeTargetCounrty;
  refs.countryList.innerHTML = makeCountryList;
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}



























































// name.official - повна назва країни
// capital - столиця
// population - населення
// flags.svg - посилання на зображення прапора
// languages

