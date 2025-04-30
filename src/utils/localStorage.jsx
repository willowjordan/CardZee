// utils/localStorage.jsx
// functions for managing local storage

function checkLocalStorage(key, defaultValue = null) {
    if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
    } 
    return defaultValue;
}