"use strict";

// dom elements
const inputField = document.querySelector(".todo__input");
const list = document.querySelector(".todo__list");
const itemsLeft = document.querySelector(".controls__items-left");
let items = document.querySelectorAll(".item");
// sorting buttons
const controls = document.querySelector(".controls__selectors");
const selectorAll = document.querySelector(".selector__all");
const selectorActive = document.querySelector(".selector__active");
const selectorCompleted = document.querySelector(".selector__completed");
const controlClear = document.querySelector(".controls__clear");
// for dark theme switch
const themeSwitch = document.querySelector(".header__theme-switch");
const themeSwitchNight = document.querySelector(".header__switch-night");
const themeSwitchDay = document.querySelector(".header__switch-day");
// dragging helpers
let draggingEl;
let x = 0;
let y = 0;
let placeholder;
let isDragActive = false;

class App {
  constructor() {
    document.addEventListener("keyup", this._newTodo.bind(this));
    list.addEventListener("click", this._toggleChecked.bind(this));
    list.addEventListener("click", this._deleteItem.bind(this));
    controls.addEventListener("click", this._showSelection.bind(this));
    controlClear.addEventListener("click", this._clearCompleted.bind(this));
    themeSwitch.addEventListener("click", this._toggleTheme.bind(this));
    // bind always returns a new function, so it's impossible to add and remove an event listener with bind. therefore, this:
    this.dragMouseDown = this._dragMouseDown.bind(this);
    this.dragMouseMove = this._dragMouseMove.bind(this);
    this.dragMouseUp = this._dragMouseUp.bind(this);
    this._updateDraggingListeners();
    this._updateItemsLeft();
  }

  _newTodo(e) {
    e.preventDefault();
    if (e.key !== "Enter") return;
    if (!inputField.value) return;
    const todoContent = inputField.value;
    inputField.value = "";
    this._renderTodo(todoContent);
    this._updateItemsLeft();
    items = document.querySelectorAll(".item");
    this._updateDraggingListeners();
  }

  _renderTodo(todoContent) {
    let html = `<div class="item draggable">
          <div class="item__checkbox"></div>
          <p class="item__text">${todoContent}</p>
          <img
            src="./images/icon-cross.svg"
            alt="cross icon"
            class="item__delete"
          />
        </div>`;
    list.insertAdjacentHTML("afterbegin", html);
  }

  _updateItemsLeft() {
    const itemsL =
      items.length - document.querySelectorAll(".item--done").length;
    itemsLeft.textContent = `${itemsL} items left`;
  }

  _toggleChecked(e) {
    const checkbox = e.target.closest(".item__checkbox");
    if (!checkbox) return;
    const item = checkbox.closest(".item");
    item.classList.toggle("item--done");
    item.children[1].classList.toggle("item__text--done");
    checkbox.classList.toggle("item__checkbox--done");
    this._updateItemsLeft();
  }

  _deleteItem(e) {
    const del = e.target.closest(".item__delete");
    if (!del) return;
    const item = del.closest(".item");
    item.remove();
    this._updateItemsLeft();
    items = document.querySelectorAll(".item");
  }

  _showSelection(e) {
    const sel = e.target;
    if (sel.classList.contains("controls__selectors")) return;
    sel.classList.add("selector--current");
    if (sel === selectorAll) {
      items.forEach((item) => item.classList.remove("hidden"));
      selectorActive.classList.remove("selector--current");
      selectorCompleted.classList.remove("selector--current");
    }
    if (sel === selectorActive) {
      items.forEach((item) => {
        if (item.classList.contains("item--done")) {
          item.classList.add("hidden");
        } else {
          item.classList.remove("hidden");
        }
      });
      selectorAll.classList.remove("selector--current");
      selectorCompleted.classList.remove("selector--current");
    }
    if (sel === selectorCompleted) {
      items.forEach((item) => {
        if (!item.classList.contains("item--done")) {
          item.classList.add("hidden");
        } else {
          item.classList.remove("hidden");
        }
      });
      selectorAll.classList.remove("selector--current");
      selectorActive.classList.remove("selector--current");
    }
  }

  _clearCompleted(e) {
    document.querySelectorAll(".item--done").forEach((item) => item.remove());
    this._updateItemsLeft();
    items = document.querySelectorAll(".item");
  }

  // dragging helper functions
  _swapNodes(nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    //find sibling of node A - if it is node B, set to node A, if not, set to next sibling of A
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    //move nodeA to before nodeB
    nodeB.parentNode.insertBefore(nodeA, nodeB);
    //move nodeB before sibling of nodeA
    parentA.insertBefore(nodeB, siblingA);
  }
  _isAbove(nodeA, nodeB) {
    // get the bounding rectangle of nodes
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    // compare center y values of both nodes, determine if A is above, then true
    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  }

  _dragMouseMove(e) {
    // create placeholder so list does not collapse
    if (!isDragActive) {
      isDragActive = true;

      placeholder = document.createElement("div");
      placeholder.classList.add("placeholder");
      draggingEl.parentNode.insertBefore(placeholder, draggingEl.nextSibling);
    }
    // the actual dragging styles
    draggingEl.style.position = "absolute";
    draggingEl.style.top = `${e.pageY - y}px`;
    draggingEl.style.left = `${e.pageX - x}px`;

    // determine elements before and after draggingEl
    const prevEl = draggingEl.previousElementSibling;
    const nextEl = placeholder.nextElementSibling;
    // user moves item to the top - swap prev el down
    if (prevEl && this._isAbove(draggingEl, prevEl)) {
      this._swapNodes(placeholder, draggingEl);
      this._swapNodes(placeholder, prevEl);
      return;
    }
    // user moves item to the bottom - swap next el up
    if (nextEl && this._isAbove(nextEl, draggingEl)) {
      this._swapNodes(nextEl, placeholder);
      this._swapNodes(nextEl, draggingEl);
      return;
    }
  }

  _dragMouseDown(e) {
    // listener is on text, select item to drag
    draggingEl = e.target.closest(".item");
    // calculate mouse position
    const rect = draggingEl.getBoundingClientRect();
    x = e.pageX - rect.left;
    y = e.pageY - rect.top;
    // attach listeners to document
    document.addEventListener("mousemove", this.dragMouseMove);
    document.addEventListener("mouseup", this.dragMouseUp);
  }

  _dragMouseUp() {
    // remove placeholder if it exists, deactivate flag
    placeholder && placeholder.remove();
    isDragActive = false;
    // remove inline dragging styles from element
    draggingEl.style.removeProperty("top");
    draggingEl.style.removeProperty("left");
    draggingEl.style.removeProperty("position");
    // remove listeners from document
    document.removeEventListener("mousemove", this.dragMouseMove);
    document.removeEventListener("mouseup", this.dragMouseUp);
    // reset helper variables
    x = null;
    y = null;
    draggingEl = null;
  }

  // for adding listeners to new list items
  _updateDraggingListeners() {
    items.forEach((item) =>
      item.children[1].removeEventListener(
        "mousedown",
        this._dragMouseDown.bind(this)
      )
    );
    items.forEach((item) =>
      item.children[1].addEventListener(
        "mousedown",
        this._dragMouseDown.bind(this)
      )
    );
  }

  _toggleTheme() {
    document.body.classList.toggle("theme--dark");
    document.body.classList.toggle("theme--light");
    themeSwitchNight.classList.toggle("hidden");
    themeSwitchDay.classList.toggle("hidden");
  }
}

const app = new App();
