
let app = {

  apiBaseURL : "http://localhost:8000/",

  init: function()
  {
    tasksList.initializeTasksFromAPI();

    taskForm.init();

    categoriesList.init();
  }

};

document.addEventListener( "DOMContentLoaded", app.init )