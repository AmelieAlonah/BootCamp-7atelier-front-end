console.log( "Module/composant taskForm chargé !" );

let taskForm = {

  init: function()
  {
    let formElement = document.querySelector( ".task--add form" );
    formElement.addEventListener( "submit", taskForm.handleFormSubmit )
  },

  // ===========================================
  //  Events callbacks / handlers
  // ===========================================

  handleFormSubmit: function( evt )
  {
    evt.preventDefault();

    let formElement = evt.currentTarget;

    let taskNewNameElement = formElement.querySelector( ".task__name-edit" );
    let taskNewName = taskNewNameElement.value;

    let taskCategorySelectElement = formElement.querySelector( ".task__category select" );
    let taskCategory = taskCategorySelectElement.value;

    let taskData = {
      title : taskNewName,
      categoryId : taskCategory,
      completion : 0,
      status : 1
    };

    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    let fetchOptions = {
      method : "POST",
      mode   : "cors",
      cache  : "no-cache",
      headers: httpHeaders,
      body   : JSON.stringify( taskData )
    };

    fetch( app.apiBaseURL + "tasks", fetchOptions )
    
    .then(
      function( response )
      {
        if( response.status === 201 )
        {
          return response.json();
        }
        else
        {
          alert( "une erreur est survenue lors de l'ajout" );
          return;
        }
      }
    ) 
    .then(
      function( jsonResponse )
      {
        tasksList.tasks[jsonResponse.id] = jsonResponse;
        let category = categoriesList.categories[ jsonResponse.category_id ];
        task.createNewTask( jsonResponse.title, category.name, jsonResponse.id );
      }
    );
  }    
};
