'use-strict';

const countryContainer = document.querySelector('.countries--container');
const searchBar = document.querySelector('.search');
const regionSelect = document.querySelector('#region');
const errorDisplay = document.querySelector('.error--display-overlay');

let countriesInfo;

console.log(searchBar);
const renderCountry = function (countryArr) {
  countryContainer.innerHTML = '';
  countryArr.forEach((country, i) => {
    const html = `<div class="country--leaf" data-countryNo=${i}>
          <img src=${country.flags.png} alt=${country.flags.alt} />
          <div class="country--leaf--details">
            <div class="country--leaf--details-name">${
              country.name.common
            }</div>
            <div class="country--leaf--details-population">
              <strong>Population: </strong>${(
                country.population / 1000000
              ).toFixed(2)}M
            </div>
            <div class="country--leaf--details-region">
              <strong>Region: </strong>${country.region}
            </div>
            <div class="country--leaf--details-capital">
              <strong>Capital: </strong>${country.capital?.[0]}
            </div>
          </div>
        </div>`;
    countryContainer.insertAdjacentHTML('beforeend', html);
  });
};

const errorOverlay = function (err) {
  errorDisplay.textContent = '';
  errorDisplay.textContent = err;
  errorDisplay.classList.remove('hidden');

  setTimeout(function () {
    errorDisplay.classList.add('hidden');
  }, 2500);
};

const countriesByRegion = async function (regionPassed, isCountry = false) {
  try {
    const response =
      regionPassed === 'all'
        ? await fetch(`https://restcountries.com/v3.1/all`)
        : isCountry
        ? await fetch(`https://restcountries.com/v3.1/name/${regionPassed}
`)
        : await fetch(`https://restcountries.com/v3.1/region/${regionPassed}`);
    console.log(response);
    if (!response.ok) {
      const error = new Error('Server is Down');
      errorOverlay(error.message);
      throw new Error();
    }
    const countriesArray = await response.json();
    renderCountry(countriesArray);
    console.log(countriesArray);
    countriesInfo = countriesArray;
    return countriesArray;
  } catch (err) {
    console.error(err);
  }
};

countriesByRegion('all');

regionSelect.addEventListener('change', function (e) {
  e.preventDefault();
  countriesByRegion(this.value);
  console.log(this.value);
});

searchBar.addEventListener('focus', function () {
  window.addEventListener('keypress', function (e) {
    if (!(e.key === 'Enter' || e.key === '')) return;
    countriesByRegion(searchBar.value.trim(), true);
  });
});

countryContainer.addEventListener('click', function (e) {
  console.log();
  const target = e.target.closest('.country--leaf');
  if (!target) return;
  const countryNumber = +target.dataset.countryno;
  const countryData = countriesInfo[countryNumber];
});
