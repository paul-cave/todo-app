# Frontend Mentor - Todo app

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

You can add Todos to the list, show only the active or completed ones, and delete all completed todos.
Individual Todos can be deleted or ticked off.
The order can be changed freely via drag and drop.
The dragging functionality only works with mouse events.
The app features a theme switch with dark and light modes.

The styling was done in Sass, the interactivity in Vanilla JS.

Resources that especially helped me:

[htmldom.dev: drag and drop elements in a list](https://htmldom.dev/drag-and-drop-element-in-a-list/) is where I learned how to implement the drag and drop functionality.
[Kostas Bariotis: removeEventListener and this](https://kostasbariotis.com/removeeventlistener-and-this/) let me figure out why I could remove event listeners easily in the global scope, but not when I wanted to contain them in my app class - a quirk with the **bind** method and _this_ keyword.

Live site URL: [Todo App - Paul Cave](https://todo-app-paulcave.netlify.app/)
