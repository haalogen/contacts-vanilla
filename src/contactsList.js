import 'whatwg-fetch'; // Global Fetch polyfill


// Global "state" array of contacts data
const contacts = new Map();
const sampleData = [];

// DOM elements (global)
const contactsListNode = document.querySelector('.contacts__contacts-list');
const addContactForm = document.querySelector('.contacts__add-contact');
const searchBox = document.querySelector('.contacts__search-box');

// Button Bar
const addContactBtn = document.querySelector('.add-contact-btn');
const pullContactsButton = document.querySelector('.pull-contacts-btn');
const pushContactsButton = document.querySelector('.push-contacts-btn');
const populateListBtn = document.querySelector('.populate-list-btn');
const searchBoxBtn = document.querySelector('.search-box-btn');



// Initializes `contacts`
function init (contacts) {
  // Asyncly(!) Load sample data
  const url = 'src/sample-data.json';
  fetch(url)
    .then(response => response.json())
    .then(data => sampleData.push(...data))
    .catch((reject) => {
      console.log('reject', reject);
    });

  // // Load `contacts` from localStorage
  // const localStorageRef = localStorage.getItem('contacts');
  // if (localStorageRef) {
  //   const data = JSON.parse(localStorageRef);
  //   console.log(data);

  //   data.forEach(item => {
  //     contacts.set(item.name, item); // Add to Map
  //   });
  // }
} /* init (contacts) */


// Creates DOM-element that represents `item`
function appendContactNode (item) {
  const html = `
      <li class="contacts-list__item" data-name="${item.name}">
        <div class="contact-header" data-name="${item.name}" onclick="toggleOpenContact(event)">
          <span>${item.name}</span>
          <button class="remove-btn" data-name="${item.name}" onclick="removeContact(event)">
            <i class="fa fa-trash-o fa-lg"></i>
          </button>
        </div>
        <div class="card hidden">
          <img src="src/img/${item.image}" alt="<img/>" />
          <p>${item.info}</p>
          <p>
            <label for="tel"><i class="fa fa-phone"></i></label>
            ${item.tel}
          </p>
          <p>
            <label for="tel"><i class="fa fa-paper-plane-o"></i></label>
            ${item.telegram}
          </p>
        </div>
      </li>
    `;
    contactsListNode.innerHTML += html;
}


// Renders full list of contacts
function renderContacts() {
  contactsListNode.innerHTML = ''; /* Clear contacts list */

  // Add to list all contacts from `contacts`
  contacts.forEach(item => appendContactNode(item));
} /* renderContacts() */


// Global function because used in "onclick" attr in index.html
window.removeContact = function (event) {
  event.stopPropagation(); /* Stop on `button.remove-btn` */

  // `currentTarget` gives the eventListener node
  const name = event.currentTarget.dataset.name;

  if (name.toLowerCase().includes('кадыров')) { /* Easter Egg */
    const msg = `Вы уверены, что хотите удалить "${name}" из списка контактов?`;
    const wantToRemove = confirm(msg);
    if (!wantToRemove) return;
  }

  // Remove item from state
  contacts.delete(name);

  // Remove node from DOM
  const nodeToRemove = document.querySelector(
    `.contacts-list__item[data-name="${name}"]`
  );
  console.log(nodeToRemove);
  contactsListNode.removeChild(nodeToRemove);
}


// Global function because used in "onclick" attr in index.html
window.toggleOpenContact = function (event) {
  const name = event.currentTarget.dataset.name;
  const contactCard = document.querySelector(
    `.contacts-list__item[data-name="${name}"] .card`
  );

  contactCard.classList.toggle('hidden');
  console.log(contacts.get(name));
}


function addContact(event) {
  event.preventDefault(); /* Stop from reloading page */

  // Get all input values from submitted form
  const form = event.target; /* === addContactForm */

  const name = form.querySelector('[name="name"]').value;
  const info = form.querySelector('[name="info"]').value;
  const tel = form.querySelector('[name="tel"]').value;
  const telegram = form.querySelector('[name="telegram"]').value;
  const image = form.querySelector('[name="image"]').value;

  const item = {name, info, tel, telegram, image};
  console.log('newContact:', item);

  // Add item to state
  contacts.set(item.name, item);
}



// Pushes contacts to server
function pushContacts () {
  console.log(JSON.stringify(Array.from(contacts)));
  const url = "/contacts";

  // Fetch (POST) contacts to server
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(Array.from(contacts))
  })
    .then(response => console.log(response))
    .catch((reject) => {
      console.log('reject', reject);
    });
}

// Pulls contacts from server
function pullContacts () {
  // Fetch contacts from server
  const url = "/contacts";
  fetch(url)
    .then(response => console.log(response))
    .catch((reject) => {
      console.log('reject', reject);
    });

  // Merge (rewrite) fetched contacts
}



//
// Event listeners
//

// On page load
window.addEventListener("load", () => {
  init(contacts); /* Initialize state of Contacts List */

  // Render contacts from Local Storage `contacts` (add to DOM)
  renderContacts();
});


// // Before page unload
// window.addEventListener("beforeunload", () => {
//   // Save `contacts` to Local Storage
//   // const state = JSON.stringify(Array.from(contacts));
//   // localStorage.setItem('contacts', state);
// });


populateListBtn.addEventListener('click', () => {
  // Add sampleData to contacts
  sampleData.forEach(item => contacts.set(item.name, item));

  // Rerender contacts
  renderContacts();
});

addContactBtn.addEventListener('click', () => {
  // Show 'new contact' form for user to fill
  addContactForm.classList.toggle('hidden');
});

pullContactsButton.addEventListener('click', pullContacts);
pushContactsButton.addEventListener('click', pushContacts);

// searchBoxBtn.addEventListener('click', () => {
//   // Show search box
//   searchBox.classList.toggle('hidden');
// });


addContactForm.addEventListener('submit', (event) => {
  addContact(event);
  addContactForm.reset();
  addContactForm.classList.toggle('hidden'); /* hide form */

  // Rerender contacts
  renderContacts();
});


