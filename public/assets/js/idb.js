// create vartiable to hold db connection 
let db;

// establish connection to IndexedDB database called 'pizza_hunt' and set it to version 1
// acts as an event listener for the database
// by default it starts at 1, represents the version of the DB
const request = indexedDB.open('pizza_hunt', 1)

// this event will emit if the database version changes
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    // create an object store(table) called 'new_pizza', set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful 
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradeneed event above) or simply established a connection, save reference to db in glabal variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() to send all local db data to api
    if (navigator.onLine) {
        uploadPizza();
    }
}

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// if we try to submit a pizza without internet
function saveRecord(record) {
    // open a new transaction named new_pizza with the database with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with object storeadd method
    pizzaObjectStore.add(record);
};

// function literally checks if we have unsaved info and then uploads it to the DB from IndexedDD
function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from the store and set to a varibale
    const getAll = pizzaObjectStore.getAll();

    // upon successful .getall() exectution run this function to submit the data to actual DB
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, send to api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                // clear all items in your store
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
}

// listens for app to come back online, and then uploads pizza!! 
window.addEventListener('online', uploadPizza);