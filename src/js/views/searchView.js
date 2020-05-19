import { element } from './base';

export const getInput = () => element.searchInput.value;

export const clearInput = () => {
   element.searchInput.value = '';
};


export const clearResults = () => {
  element.searchResultList.innerHTML = '';
  element.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {

  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach(el => {
    el.classList.remove('.results__link--active');
  });
  document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

// 'Pasta and tmoato'
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    // return the result
    return `${newTitle.join(' ')}...`;
  }
  return title;
};

const renderRecipe = recipe => {
  const markUp = `
<li>
  <a class="results__link results__link" href="#${recipe.recipe_id}">
      <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
      </figure>
      <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
      </div>
  </a>
</li> 
  `;
  element.searchResultList.insertAdjacentHTML('beforeend', markUp);
};

//type: 'prev' or 'next'
const createBtn = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}> 
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
  </button>

      <!--
        <button class="btn-inline results__btn--prev">
          <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-left"></use>
        </svg>
        <span>Page 1</span>
        </button>
        <button class="btn-inline results__btn--next">
        <span>Page 3</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
        </button>
        -->
`;

const renderButtons = (page, numRresults, resPerPage) => {
  const pages = Math.ceil(numRresults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    // only Button to go to next page
   button = createBtn(page, 'next');
  } else if (page < pages) {
    //both buttons
    button = `
      ${createBtn(page, 'next')}
      ${createBtn(page, 'prev')}
    `;
  } else if (page === pages && pages > 1) {
    //only button to go to previsous page
    button = createBtn(page, 'prev');

  }

  element.searchResPages.insertAdjacentHTML('afterbegin', button);
};


export const renderResults = (recipes, page = 2, resPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  //render pagination buttons 
  renderButtons(page, recipes.length, resPerPage);
};