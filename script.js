// 1. Variable and State Declarations
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// 2. Utility Functions
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function getItemsFromStorage() {
  if (localStorage.getItem('items') === null) {
    return [];
  } else {
    return JSON.parse(localStorage.getItem('items'));
  }
}

function addItemToStorage(item) {
  const items = getItemsFromStorage();
  sortItems();
  items.push(item);
  localStorage.setItem('items', JSON.stringify(items));
}

function removeItemFromStorage(itemElement) {
  let items = getItemsFromStorage();
  items = items.filter((item) => item !== itemElement.textContent);
  localStorage.setItem('items', JSON.stringify(items));
}

// 3. Core Functionalities
function addItemToDOM(item) {
  const li = document.createElement('li');
  li.textContent = item;
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);
}

function displayItems() {
  const items = getItemsFromStorage();
  items.forEach(addItemToDOM);
  checkUI();
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.removeItem('items');
  checkUI();
}

// 4. Event Handlers
function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  if (newItem === '') {
    alert('Please enter an item');
    return;
  } else if (checkForDuplicates(newItem)) {
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-item');
    removeItemFromStorage(itemToEdit);
    itemToEdit.remove();
    isEditMode = false;
  }

  checkForDuplicates(newItem);
  addItemToDOM(newItem);
  addItemToStorage(newItem);
  itemInput.value = '';
  checkUI();
}

function onItemClicked(e) {
  if (
    e.target.classList.contains('fa-xmark') ||
    e.target.parentElement.classList.contains('remove-item')
  ) {
    removeItem(e);
  } else {
    setItemToEdit(e.target.closest('li'));
  }
}

function removeItem(e) {
  if (confirm('Are you sure?')) {
    const li = e.target.closest('li');
    if (li) {
      removeItemFromStorage(li);
      itemList.removeChild(li);
      checkUI();
    }
  }
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    .forEach((li) => li.classList.remove('edit-item'));
  item.classList.add('edit-item');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
  itemInput.focus();
}

function checkForDuplicates(newItem) {
  const items = itemList.querySelectorAll('li');
  let isDuplicate = false;
  items.forEach((item) => {
    if (item.textContent === newItem) {
      isDuplicate = true;
      alert('Item already exists');
    }
  });
  return isDuplicate;
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function sortItems() {
  const items = itemList.querySelectorAll('li');
  const itemsArray = Array.from(items);
  itemsArray.sort((a, b) => a.textContent.localeCompare(b.textContent));
  itemsArray.forEach((item) => itemList.appendChild(item));
}

// 5. UI Manipulations
function checkUI() {
  const items = itemList.querySelectorAll('li');
  clearBtn.style.display = items.length ? 'block' : 'none';
  itemFilter.style.display = items.length ? 'block' : 'none';
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#007bff';
  itemInput.value = '';
  itemInput.focus();
  isEditMode = false;
}

// 6. Initialization
function init() {
  document.addEventListener('DOMContentLoaded', displayItems);
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onItemClicked);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
}

init();
