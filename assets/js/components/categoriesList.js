console.log( "Module/composant categoriesList chargé !" );

let categoriesList = {

  categories : {},

  init: function()
  {
    categoriesList.loadCategoriesFromAPI();
  },

  loadCategoriesFromAPI : function()
  {
    console.log( "loadCategoriesFromAPI" );

    let fetchOptions = {
      method : "GET",
      mode   : "cors",
      cache  : "no-cache"
    };
    let promise = fetch( app.apiBaseURL + "categories", fetchOptions );

    let jsonPromise = promise.then( categoriesList.convertResponseToJson );
    jsonPromise.then( categoriesList.registerCategoriesListing );
  },

  convertResponseToJson: function( response )
  {
    console.log( "convertResponseToJson" );
    return response.json();
  },

  registerCategoriesListing: function( jsonResponse )
  {
    console.log( "registerCategoriesListing" );

    for( let categoryData of jsonResponse )
    {
      categoriesList.categories[ categoryData.id ] = categoryData;
    }

    categoriesList.displayCategoriesInFilter();
    categoriesList.displayCategoriesInTaskAddForm();
  },

  displayCategoriesInFilter: function()
  {
    let categoriesFilterParentElement = document.querySelector(".filters__task--category");
    let categoriesFilterSelectElement = document.createElement( "select" );

    categoriesList.createOptionsForCategoriesSelect( categoriesFilterSelectElement );
    categoriesFilterParentElement.appendChild( categoriesFilterSelectElement );
  },

  displayCategoriesInTaskAddForm: function()
  {
    let categoriesFilterParentElement = document.querySelector(".task--add .task__category .select");
    let categoriesFilterSelectElement = document.createElement( "select" );
    categoriesList.createOptionsForCategoriesSelect( categoriesFilterSelectElement );
    categoriesFilterParentElement.appendChild( categoriesFilterSelectElement );
  },

  createOptionsForCategoriesSelect: function( selectElement )
  {
    let categoriesArray = Object.values( categoriesList.categories );
    let optionElement = document.createElement("option");

    optionElement.textContent = "Choisissez une catégorie";
    selectElement.appendChild( optionElement );

    for( let categoryData of categoriesArray )
    {
      // On créé notre option de toute pièce
      let optionElement = document.createElement("option");
      optionElement.textContent = categoryData.name;
      optionElement.setAttribute( "value", categoryData.id );

      // On l'ajoute au select
      selectElement.appendChild( optionElement );
    }
  }
};