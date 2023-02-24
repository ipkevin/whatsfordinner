//https://www.themealdb.com/api.php

const apiUrl = "https://www.themealdb.com/api/json/v1/1/";

const recipesDOM = document.querySelector(".recipes");

const findButton = document.querySelector(".button__find");

const surpriseButton = document.querySelector(".button__surprise");

const numberRandomRecipes = 6;

const inputField = document.querySelector(".header__input");

const enterKeyCode = 13;

findButton.addEventListener("click", () => {
  const inputEl = document.querySelector(".header__input");
  const input = inputEl.value;

  if (input === "") {
    inputEl.classList.add("input-error");
    document.querySelector(".error__text").innerHTML = "Please enter an ingredient";

    inputEl.addEventListener("click", () => {
      inputEl.classList.remove("input-error");
      document.querySelector(".error__text").innerHTML = "";
    });
  } else {
    getRecipes(input);
  }
});

inputField.addEventListener("keyup", (event) => {
  if (event.keyCode === enterKeyCode) {
    event.preventDefault();
    findButton.click();
  }
});

surpriseButton.addEventListener("click", randomRecipes);

function randomRecipes() {
  recipesDOM.innerHTML = "";
  for (let count = 0; count < numberRandomRecipes; count++) {
    axios
      .get(`${apiUrl}random.php`)
      .then((response) => {
        const data = response.data.meals;

        data.forEach((recipe) => {
          getRecipeById(recipe.idMeal);
        });
        addShowRecipeFullView();
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }
}

randomRecipes();

//www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
function getRecipes(ingredient) {
  axios
    .get(`${apiUrl}filter.php?i=${ingredient}`)
    .then((response) => {
      recipesDOM.innerHTML = "";
      const data = response.data.meals;

      data.forEach((recipe) => {
        getRecipeById(recipe.idMeal);
      });
    })
    .catch((error) => {
      recipesDOM.innerHTML = `We cannot find any recipes for ${ingredient}.`;
      console.log("error: ", error);
    });
}

function getRecipeById(id) {
  axios
    .get(`${apiUrl}lookup.php?i=${id}`)
    .then((response) => {
      const data = response.data.meals[0];
      displayRecipe(data);
      addShowRecipeFullView();
    })
    .catch((error) => {
      console.log("error: ", error);
    });
}

function displayRecipe(data) {
  // each recipe will be contained in this element
  const articleOrigin = document.createElement("article");
  articleOrigin.classList.add("recipes__article");

  const articleWrapperEl = document.createElement("div");
  articleWrapperEl.classList.add("recipes__article-wrapper");

  // add image
  const imgEl = document.createElement("img");
  imgEl.classList.add("recipes__image");
  imgEl.setAttribute("src", data.strMealThumb);
  imgEl.setAttribute("alt", data.strMeal + " photo");

  let tempEl = document.createElement("div");
  tempEl.classList.add("recipes__image-wrapper");
  tempEl.appendChild(imgEl);

  articleWrapperEl.appendChild(tempEl);

  // add recipe title
  tempEl = document.createElement("h2");
  tempEl.classList.add("recipes__title");
  tempEl.innerText = data.strMeal;
  articleWrapperEl.appendChild(tempEl);

  // Holds the portion of the recipe that can be toggled on/off
  const detailsWrapElem = document.createElement("div");
  detailsWrapElem.classList.add("recipes__details");

  const aCloseEl = document.createElement("a");
  aCloseEl.classList.add("button");
  aCloseEl.classList.add("recipes__close-button");
  aCloseEl.setAttribute("href", "#");
  aCloseEl.innerText = "Close";
  detailsWrapElem.appendChild(aCloseEl);

  // add ingredients title
  tempEl = document.createElement("h3");
  tempEl.classList.add("recipes__subtitle");
  tempEl.innerText = "Ingredients";
  detailsWrapElem.appendChild(tempEl);

  // create ingredients list
  const recipesListEl = document.createElement("ul");
  recipesListEl.classList.add("recipes__ingredient-list");
  // pull out ingredient with their matching measurement and display together
  let i = 1;
  let ingredKey = "strIngredient" + i;
  let measureKey = "strMeasure" + i;
  while (data[ingredKey] !== "" && i <= 20) {
    tempEl = document.createElement("li");
    tempEl.classList.add("recipes__ingredient");
    tempEl.innerText = `${data[measureKey]} ${data[ingredKey]}`;
    recipesListEl.appendChild(tempEl);
    ++i;
    ingredKey = "strIngredient" + i;
    measureKey = "strMeasure" + i;
  }
  detailsWrapElem.appendChild(recipesListEl);

  tempEl = document.createElement("h3");
  tempEl.classList.add("recipes__subtitle");
  tempEl.innerText = "Instructions";
  detailsWrapElem.appendChild(tempEl);

  // add instructions
  tempEl = document.createElement("p");
  tempEl.classList.add("recipes__instructions");
  tempEl.innerText = data.strInstructions;
  detailsWrapElem.appendChild(tempEl);

  // add Youtube video
  tempEl = document.createElement("iframe");
  tempEl.classList.add("recipes__video");
  let embedUrl = data.strYoutube.replace("watch?v=", "embed/");
  tempEl.setAttribute("src", embedUrl);
  tempEl.setAttribute("frameborder", "0");
  tempEl.setAttribute("height", "315");
  tempEl.setAttribute("width", "560");
  tempEl.setAttribute("title", `Youtube Video for ${data.strMeal}`);
  tempEl.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
  tempEl.setAttribute("allowfullscreen", "");
  detailsWrapElem.appendChild(tempEl);

  // add source link
  tempEl = document.createElement("a");
  tempEl.classList.add("recipes__source-link");
  tempEl.setAttribute("href", data.strSource);
  tempEl.setAttribute("target", "_blank");
  tempEl.innerText = "Source";
  let tempEl2 = document.createElement("p");
  tempEl2.classList.add("recipes__source");
  tempEl2.appendChild(tempEl);
  detailsWrapElem.appendChild(tempEl2);

  // add the toggle-able portion of recipe to rest of recipe
  articleWrapperEl.appendChild(detailsWrapElem);
  articleOrigin.appendChild(articleWrapperEl);

  // Finally, add recipe to the recipe area
  recipesDOM.appendChild(articleOrigin);
}

function addShowRecipeFullView() {
  // find all elements that have the class .recipes__close-button
  const closeButtons = document.querySelectorAll(".recipes__close-button");

  // find all elements that have the class .recipes__image
  const recipeImages = document.querySelectorAll(".recipes__image");

  // iterate over all images to add the click event
  for (let i = 0; i < recipeImages.length; i++) {
    recipeImages[i].addEventListener("click", (event) => {
      // event.target is the image that was clicked
      // .closest finds the closest ancestor with the class .recipes__article (article)
      const articleElement = event.target.closest(".recipes__article");

      // add the active class to the article
      articleElement.classList.add("recipes__article--active");

      // align the window with the article element (roughly adjusts position on the detail view)
      articleElement.scrollIntoView(true);
    });
  }

  // iterate over all buttons to add the click event
  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener("click", (event) => {
      event.preventDefault();

      // event.target is the button
      // .closest finds the closest ancestor with the class .recipes__article (article)
      const articleElement = event.target.closest(".recipes__article");

      // remove the active class
      articleElement.classList.remove("recipes__article--active");

      // align the window with the article element (roughly restores position on the list view)
      articleElement.scrollIntoView(true);
    });
  }
}
