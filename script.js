'use-strict';

const countryContainer = document.querySelector('.countries--container');
const searchBar = document.querySelector('.search');
const regionSelect = document.querySelector('#region');
const errorDisplay = document.querySelector('.error--display-overlay');

const renderCountry = function (countryArr) {
  countryContainer.innerHTML = '';
  countryArr.forEach(country => {
    const html = `<div class="country--leaf">
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

const countriesByRegion = async function (regionPassed) {
  try {
    const response =
      regionPassed === 'all'
        ? await fetch(`https://restcountries.com/v3.1/all`)
        : await fetch(`https://restcountries.com/v3.1/region/${regionPassed}`);
    console.log(response);
    if (!response.ok) {
      const error = new Error('Server is Down');
      errorOverlay(error.message);
      throw new Error();
    }
    const countriesArray = await response.json();
    renderCountry(countriesArray);
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
