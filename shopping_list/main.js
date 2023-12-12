const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemClear = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button')
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach((item) => addItemToDom(item));
    checkUI()
}

//FUNCTION add item
function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value
    //Validate Input
    if (newItem === '') {
        alert('Please enter a value');
        return;
    }

    // check for edit mode
    if (isEditMode) {
        const itemToEdit = document.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode')
        itemToEdit.remove()
        isEditMode = false;
    } else {
        if (checkIfItemsExist(newItem)) {
            alert('Item already exists')
            return
        }
    }

    // Add item to DOM element
    addItemToDom(newItem);

    checkUI()

    // Add item to localstorage
    addItemToStorage(newItem);

    itemInput.value =''  
}

// FUNCTION Add item to DOM
function addItemToDom(item) {
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))

    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button);
    itemList.appendChild(li)
}   

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
    return icon
}

// FUNCTION Add item to storage
function addItemToStorage(item) {
    const itemsFromStorage = getItemFromStorage();

    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));   
}

function getItemFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
       setItemToEdit(e.target)
    }
}

function checkIfItemsExist(item) {
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228b22'
    itemInput.value = item.textContent

}

//FUNCTION remove item
function removeItem(item) {
    if(confirm('Are you sure?')) {
        item.remove();
    
    // remove item from storage
    removeItemFromStorage(item.textContent)


    checkUI()
    } 
}

//FUNCTION remove all 
 /*function removeAll() {
    const items = itemList.querySelectorAll('li');
    if (confirm('Are you sure you want to delete all')){
        while(itemList.firstChild) {       
            itemList.removeChild(itemList.firstChild);
    }}
    checkUI()
}
*/
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage()
    
    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

function clearItems() {
    if (confirm('Are you sure you want to delete all')){
        while(itemList.firstChild) {       
            itemList.removeChild(itemList.firstChild);
    }}

    //clear from localstorage
    localStorage.removeItem('items');

    checkUI()
}


//FUNCTION filter 
function filterItems(e) {
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase()

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display="flex";
        } else {
            item.style.display ='none';
        }
    })
   
}


//FUNCTION check if there are values on page load
function checkUI() {
    itemInput.value = ''

    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        itemClear.style.display="none";
        itemFilter.style.display = "none";
    } else {
        itemClear.style.display = 'block';
        itemFilter.style.display ='block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

// Event Listener
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
itemClear.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI()