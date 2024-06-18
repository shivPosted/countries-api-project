'use-strict';

const countryContainer = document.querySelector('.countries--container');
const darkModeSwitch = document.querySelector('.theme-switcher');
const searchBar = document.querySelector('.search');
const regionSelect = document.querySelector('#region');
const errorDisplay = document.querySelector('.error--display-overlay');
const mainSection = document.querySelector('.main--section');
const countryInfoCreator = document.querySelector('.country--details--info');
const backBtn = document.querySelector('.arrow-back');
const header = document.querySelector('.header');

let borderCountryContainer;
const countryDetailsBox = document.querySelector(
  '.overlay--country--details--click'
);
let isDarkModeOn = false;
// mainSection.style.marginTop =
//   Number.parseFloat(getComputedStyle(header).height) + 10 + 'px';
let countriesInfo;

const errorOverlay = function (err) {
  errorDisplay.textContent = '';
  errorDisplay.textContent = err;
  errorDisplay.classList.remove('hidden');

  setTimeout(function () {
    errorDisplay.classList.add('hidden');
  }, 2500);
};

const darkModeToggle = function () {
  console.log('clicked');
  header.classList.toggle('dark');
  document.querySelector('body').classList.toggle('dark');
  mainSection.classList.toggle('dark');
  searchBar.classList.toggle('dark');
  regionSelect.classList.toggle('dark');
  searchBar.closest('.search--bar').classList.toggle('dark');
  backBtn.classList.toggle('dark');
  countryDetailsBox.classList.toggle('dark');
  document.querySelectorAll('.country--leaf').forEach(elem => {
    elem.classList.toggle('dark');
  });

  this.querySelectorAll('.icon').forEach(icon =>
    icon.classList.toggle('hidden')
  );
  console.log(this.querySelectorAll('.icon'));
  isDarkModeOn = !isDarkModeOn;
};

const getBorderCountryName = async function (borderCodeArr) {
  try {
    const promiseArr = borderCodeArr.map(async cur => {
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${cur}`
      );
      if (!response.ok) throw new Error("Can't get countries borders");
      return response.json();
    });
    const response = await Promise.all(promiseArr);
    const borderCountryDatas = response.flat();
    const border = borderCountryDatas.map(borderObj => borderObj.name.common);
    return border;
  } catch (err) {
    throw err;
  }
};

const displayBorders = function (borderArr) {
  let countryArr;
  getBorderCountryName(borderArr)
    .then(res => {
      countryArr = res;
      countryArr.forEach(borderCountry => {
        const borderHtml = `<p class="border--country--individual">${borderCountry}</p>`;
        borderCountryContainer.insertAdjacentHTML('beforeend', borderHtml);
      });
      // console.log(countryArr);
    })
    .catch(err => {
      errorOverlay(err.message);
      console.error(err);
    });
  console.log(countryArr);
};

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
              <strong>Population: </strong> ${(
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
  if (isDarkModeOn)
    document.querySelectorAll('.country--leaf').forEach(elem => {
      elem.classList.add('dark');
    });
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

    if (!response.ok) {
      const error = new Error('Server is Down or Wrong country typed');
      throw error;
    }
    const countriesArray = await response.json();
    renderCountry(countriesArray);
    countriesInfo = countriesArray;
    return countriesArray;
  } catch (err) {
    console.error(err);
    errorOverlay(err.message);
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
    if (!(e.key === 'Enter')) return;

    e.target.value === ''
      ? countriesByRegion('all')
      : countriesByRegion(searchBar.value.trim(), true);
    e.target.value = '';
  });
});

const renderCountryBox = country => {
  countryDetailsBox.querySelector('.country-flag').src = country.flags.png;
  const [, nativesName] = Object.entries(country.name.nativeName)[0];
  const nativeName = nativesName.common;
  const languages = Object.values(country.languages).join(', ');
  const currencies = Object.values(country.currencies)
    .map(elem => elem.name + ` (${elem.symbol})`)
    .join(', ');

  const html = `
            <h3 class="country--detail--name">${country.name.common}</h3>
          <div class="country--detail--general-box">
            <p class="country--detail--general--name">
              <strong>Native Name: </strong>${nativeName}
            </p>
            <p class="country--detail--general--Population">
              <strong>Population: </strong>${(
                country.population / 1000000
              ).toFixed(2)}M
            </p>
            <p class="country--detail--general--region">
              <strong>Region: </strong>${country.region}
            </p>
            <p class="country--detail--general--sub-region">
              <strong>Sub Region: </strong>${country.subregion}
            </p>
            <p class="country--detail--general--capital">
              <strong>Capital: </strong>${country.capital?.[0]}
            </p>
            <p class="country--detail--general--domain">
              <strong>Top Level Domain: </strong>${country.tld?.[0]}
            </p>
            <p class="country--detail--general--currencies">
              <strong>Currecies: </strong>${currencies}
            </p>
            <p class="country--detail--general--language">
              <strong>Languages: </strong>${languages}
            </p>
          </div>
          <div class="country--details--border">
            <p><strong>Border Countries:</strong></p>
            <div class="border-country-container"></div>
          </div>
  `;
  countryInfoCreator.textContent = '';
  countryInfoCreator.insertAdjacentHTML('afterbegin', html);
  borderCountryContainer = document.querySelector('.border-country-container');
  console.log(borderCountryContainer);
  country.borders
    ? displayBorders(country.borders)
    : (document.querySelector('.country--details--border').textContent =
        'This is an island');
};

countryContainer.addEventListener('click', function (e) {
  const target = e.target.closest('.country--leaf');
  if (!target) return;
  const countryNumber = +target.dataset.countryno;

  const countryData = countriesInfo[countryNumber];
  console.log(countryData);

  setTimeout(() => {
    backBtn.classList.remove('hidden');
    header.style.position = 'fixed';
  }, 300);

  countryDetailsBox.classList.remove('hidden');
  renderCountryBox(countryData);
  document.querySelector('body').classList.add('no-scroll');
});

backBtn.addEventListener('click', function () {
  this.classList.add('hidden');
  countryDetailsBox.classList.add('hidden');
  document.querySelector('body').classList.remove('no-scroll');
  header.style.position = 'sticky';
});

//back to top button
document.querySelector('.back-to-top').addEventListener('click', function () {
  errorDisplay.scrollIntoView({ behavior: 'smooth' });
  console.log('clicked');
});

darkModeSwitch.addEventListener('click', darkModeToggle.bind(darkModeSwitch));

console.log(getComputedStyle(header).height);
