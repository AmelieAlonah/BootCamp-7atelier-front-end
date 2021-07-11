
console.log( "Module/composant task chargé !" );

let task = {

  initTask : function( taskElement )
  {
    let taskNameElement = taskElement.querySelector('.task__name-display');
    taskNameElement.addEventListener( "click", task.handleClickOnTaskName );

    let taskEditButtonElement = taskElement.querySelector( '.task__button--modify' );
    taskEditButtonElement.addEventListener( "click", task.handleClickOnEditButton );

    let taskInputNameElement = taskElement.querySelector( ".task__name-edit" );
    taskInputNameElement.addEventListener( "keyup", task.handleKeyUpOnTaskName );
    taskInputNameElement.addEventListener( "blur", task.handleBlurOnTaskName )

    let taskValidateButtonElement = taskElement.querySelector( ".task__button--validate" );
    taskValidateButtonElement.addEventListener( "click", task.handleClickOnValidateButton );

    let taskUnvalidateButtonElement = taskElement.querySelector( ".task__button--incomplete" );
    taskUnvalidateButtonElement.addEventListener( "click", task.handleClickOnUnvalidateButton );
  },

  createNewTask: function( taskNewName, taskCategory, taskId )
  {
    // Première étape, on récupère le template
    let template = document.querySelector("#task-template");
    let newTaskFromTemplate = template.content.cloneNode( true );

    newTaskFromTemplate.querySelector( ".task" ).dataset.category = taskCategory;
    newTaskFromTemplate.querySelector( ".task__category p" ).textContent = taskCategory;

    newTaskFromTemplate.querySelector( ".task__name-display" ).textContent = taskNewName;
    newTaskFromTemplate.querySelector( ".task__name-edit" ).value = taskNewName;

    newTaskFromTemplate.querySelector( ".task__name-edit" ).setAttribute( "value", taskNewName );
    
    newTaskFromTemplate.querySelector( ".task" ).dataset.id = taskId;

    task.changeCompletion( newTaskFromTemplate.querySelector( ".task" ), tasksList.tasks[ taskId ].completion );

    task.initTask( newTaskFromTemplate );

    let taskList = document.querySelector(".tasks");
    taskList.prepend( newTaskFromTemplate );
  },

  // Modifie le DOM d'une tache pour la marquer comme complétée
  changeCompletion( taskElement, completion )
  {
    if( completion == 100 )
    {
      taskElement.classList.remove( "task--todo" );
      taskElement.classList.add( "task--complete" );
    }
    else
    {
      taskElement.classList.remove( "task--complete" );
      taskElement.classList.add( "task--todo" );
    }    

    let currentProgressBarElement = taskElement.querySelector( ".progress-bar__level" );
    currentProgressBarElement.style.width = completion + "%";
  },

  // ===========================================
  //  Events callbacks / handlers
  // ===========================================

  handleClickOnTaskName: function( evt )
  {
    let taskNameElement = evt.currentTarget;

    let taskElement = taskNameElement.closest( ".task" );

    taskElement.classList.add( "task--edit" );

    let taskNameInputElement = taskElement.querySelector( ".task__name-edit" );
    taskNameInputElement.focus();
  },

  handleClickOnEditButton: function( evt )
  {
    task.handleClickOnTaskName( evt )
  },

  handleBlurOnTaskName: function( evt )
  {
    let taskInputNameElement = evt.currentTarget;
    let taskNewName = taskInputNameElement.value;
    let taskElement = taskInputNameElement.closest( ".task" )

    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    let data = {
      title : taskNewName
    };

    // On appelle l'API pour lui dire de modifier le titre de la tache
    let fetchOptions = {
      method : "PATCH",
      mode   : "cors",
      cache  : "no-cache", 
      headers: httpHeaders,
      body   : JSON.stringify(data)
    };

    fetch( app.apiBaseURL + "tasks/" + taskElement.dataset.id, fetchOptions )
    .then(
      function( response )
      {
        if( response.status === 204 )
        {
          let taskNameElement = taskElement.querySelector( ".task__name-display" );
          taskNameElement.textContent = taskNewName;
          taskElement.classList.remove( "task--edit" );
        }
        else
        {
          alert( "Une erreur est survenue lors du changement de nom !" );
        }        
      }
    );
  },

  handleKeyUpOnTaskName: function( evt )
  {
    if( evt.key === "Enter" )
    {
      task.handleBlurOnTaskName( evt );
    }
  },

  handleClickOnValidateButton: function( evt )
  {
    // Récupération de l'élément concerné 
    let validateButtonElement = evt.currentTarget;
    // Récupération de la tache concernée
    let taskElement = validateButtonElement.closest( ".task" );

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On stocke les données à envoyer à l'API sous forme d'objet JS
    let data = {
      completion : 100
    };

    let fetchOptions = {
      method : "PATCH",
      mode   : "cors",
      cache  : "no-cache",     
      headers: httpHeaders,
      body   : JSON.stringify(data)
    };

    fetch( app.apiBaseURL + "tasks/" + taskElement.dataset.id, fetchOptions )
    .then(
      function( response )
      {
        if( response.status === 204 )
        {
          task.changeCompletion( taskElement, 100 );
        }
        else
        {
          alert( "Une erreur est survenue !" );
        }        
      }
    );
  },

  handleClickOnUnvalidateButton: function( evt )
  {
    // Récupération de l'élément concerné 
    let validateButtonElement = evt.currentTarget;
    // Récupération de la tache concernée
    let taskElement = validateButtonElement.closest( ".task" );
    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");
    // On stocke les données à envoyer à l'API sous forme d'objet JS
    let data = {
      completion : 0
    };
    // On appelle l'API pour lui dire de modifier la complétion de la tache
    let fetchOptions = {
      method : "PATCH",
      mode   : "cors",
      cache  : "no-cache",      
      headers: httpHeaders,
      body   : JSON.stringify(data)
    };

    fetch( app.apiBaseURL + "tasks/" + taskElement.dataset.id, fetchOptions ) 
    .then( 
      function( response )
      {
        if( response.status === 204 )
        {
          task.changeCompletion( taskElement, 0 );
        }
        else
        {
          alert( "Une erreur est survenue !" );
        }        
      }
    );
  }
};