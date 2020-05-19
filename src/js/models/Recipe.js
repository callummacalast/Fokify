import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }


 async getRecipe() {
  try {
    const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
    this.title = res.data.recipe.title;
    this.author = res.data.recipe.publisher;
    this.img = res.data.recipe.image_url;
    this.url = res.data.recipe.source_url;
    this.ingredients = res.data.recipe.ingredients;

    // console.log(res);
  } catch (error) {
    console.log(error);
    alert("something went wrong :(");
  }
  }

  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 10;
  }

  parseIngredient() {
    const unitLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lbs'];
    const units = [...unitShort, 'kg', 'g'];
    const newIngredient = this.ingredients.map(el => {
      // 1. uniform units
      let ingredient = el.toLowerCase();
      unitLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });

      // 2. remove parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3. parse new ingredient into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

      let objIng;
       if (unitIndex > -1) {
        //there is a unit
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ') 
        };

      } else if(parseInt(arrIng[0], 10)) {
        //There is no unit but 1st element is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1) {
        //There is no unit
        objIng = {
          count: 1,
          unit: '',
          ingredient
        }

      }

      return objIng;
    });
    this.ingredients = newIngredient;
  }

  updateServings(type) {
    //Update servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    // ingredients
    this.ingredients.forEach(ing => {
      ing.count *= (newServings / this.servings);
    });

    this.servings = newServings;
  }

}