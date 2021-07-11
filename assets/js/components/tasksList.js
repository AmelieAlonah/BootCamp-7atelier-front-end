
console.log( "Module/composant tasksList chargé !" );

let tasksList = {

  tasks : {},

  initializeTasksFromAPI : function()
  {
    let fetchOptions = {
      method : "GET",
      mode   : "cors",
      cache  : "no-cache"
    };

    fetch( app.apiBaseURL + "tasks", fetchOptions )
    
    // A partir d'ici, on a une promesse de réponse
    .then(
      function( response )
      {
        return response.json();
      }
    ) 
    .then(
      function( jsonResponse )
      {
        for( let taskData of jsonResponse )
        {
          tasksList.tasks[ taskData.id ] = taskData;
          task.createNewTask( taskData.title, taskData.category.name, taskData.id );
        }
      }
    )
  },

  initializeTasksFromDOM : function()
  {
    let taskElements = document.querySelectorAll( ".tasks .task" );

    for( let currentTaskElement of taskElements )
    {
      task.initTask( currentTaskElement );
    }
  }
};
