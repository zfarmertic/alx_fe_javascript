// --- Initial Data Structure (Used only if Local Storage is empty) ---
let quotes = [
    { category: "advice", text: "once beaten twice shy" },
    { category: "christianity", text: "Christ in me the Hope of glory" },
    { category: "Christianity", text: "That the excellency of the power may be of God and not of us" },
    { category: "Inspiration", text: "If God be for us who can be against" }
];

// --- DOM Elements ---
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const exportButton = document.getElementById('exportQuotes');
const sessionTestButton = document.getElementById('sessionTest');
const addQuoteFormContainer = document.getElementById('addQuoteForm');
const appContainer = document.querySelector('body');


// =================================================================
// 💰 WEB STORAGE FUNCTIONS (Step 1)
// =================================================================

/**
 * Loads quotes from Local Storage. If none are found, initializes with the default array.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem('localQuotes');
    if (storedQuotes) {
        // Parse the JSON string back into a JavaScript array
        quotes = JSON.parse(storedQuotes);
        console.log(`Loaded ${quotes.length} quotes from Local Storage.`);
    } else {
        // Save the initial default array to Local Storage
        saveQuotes();
        console.log('Initialized default quotes and saved to Local Storage.');
    }
}

/**
 * Saves the current quotes array to Local Storage after stringifying it to JSON.
 */
function saveQuotes() {
    // Stringify the JavaScript array into a JSON string
    localStorage.setItem('localQuotes', JSON.stringify(quotes));
}

/**
 * Demonstrates Session Storage by saving the last viewed quote.
 */
function saveLastViewed(quoteText) {
    sessionStorage.setItem('lastViewedQuote', quoteText);
    alert(`Last viewed quote saved to Session Storage: "${quoteText.substring(0, 30)}..."`);
}

/**
 * Displays the last viewed quote from Session Storage.
 */
function displayLastViewed() {
    const lastQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastQuote) {
        quoteDisplay.innerHTML = `<h3>(Session Storage) Last Viewed:</h3><p>"${lastQuote}"</p>`;
    } else {
        alert("No quote found in Session Storage for this tab session.");
    }
}


// =================================================================
// 🎨 CORE DOM MANIPULATION FUNCTIONS
// =================================================================

/**
 * Selects a random quote from the array and dynamically updates the DOM.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p style="color:red;">No quotes available. Add a new quote or import a file!</p>';
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // 1. Clear previous content
    quoteDisplay.innerHTML = '';

    // 2. Create elements for the quote
    const quoteParagraph = document.createElement('p');
    quoteParagraph.classList.add('quote-text');
    quoteParagraph.textContent = `"${quote.text}"`;

    const categorySpan = document.createElement('span');
    categorySpan.classList.add('quote-category');
    categorySpan.textContent = `- Category: ${quote.category}`;

    // 3. Append new elements
    quoteDisplay.appendChild(quoteParagraph);
    quoteDisplay.appendChild(categorySpan);
    
    // 4. Update Session Storage
    saveLastViewed(quote.text);
}

/**
 * Dynamically creates and injects the 'Add Quote' form into the page.
 */
function createAddQuoteForm() {
    // Check if the form already exists
    if (document.getElementById('addQuoteButton')) {
        return;
    }

    // Create Input for Quote Text
    const quoteTextInput = document.createElement('input');
    quoteTextInput.id = 'newQuoteText';
    quoteTextInput.type = 'text';
    quoteTextInput.placeholder = 'Enter a new quote';

    // Create Input for Category
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    // Create Button to Add Quote
    const addButton = document.createElement('button');
    addButton.id = 'addQuoteButton';
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);

    // Append all elements to the form container
    addQuoteFormContainer.appendChild(quoteTextInput);
    addQuoteFormContainer.appendChild(categoryInput);
    addQuoteFormContainer.appendChild(addButton);
}

/**
 * Grabs user input, adds the new quote, and updates both the array and Local Storage.
 */
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText && quoteCategory) {
        const newQuote = {
            text: quoteText,
            category: quoteCategory
        };

        // 1. Add to the array
        quotes.push(newQuote);

        // 2. Save the updated array to Local Storage
        saveQuotes();

        // 3. Update DOM and clear inputs
        quoteDisplay.innerHTML = `<p>✅ Quote added and saved!</p>`;
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        console.log(`New quote added. Total quotes: ${quotes.length}`);

    } else {
        alert("Please enter both the quote text and the category.");
    }
}


// =================================================================
// 📥 JSON IMPORT/EXPORT FUNCTIONS (Step 2)
// =================================================================

/**
 * Exports the quotes array to a downloadable JSON file.
 */
function exportToJsonFile() {
    // Convert the array to a JSON string
    const jsonString = JSON.stringify(quotes, null, 2); // 2 spaces for formatting

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create an anchor element and set its download attributes
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.json';

    // Programmatically click the link to trigger the download
    document.body.appendChild(a); // Append to the body temporarily
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Imports quotes from a file selected via the input element.
 * (This function is called by the 'onchange' event in the HTML)
 */
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = function(event) {
        try {
            // 1. Parse the JSON string from the file content
            const importedQuotes = JSON.parse(event.target.result);
            
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
                // 2. Merge the imported quotes into the existing array
                // The spread syntax (...) adds all elements from importedQuotes individually.
                quotes.push(...importedQuotes);

                // 3. Save the new combined array to Local Storage
                saveQuotes();
                
                // 4. Update the display
                quoteDisplay.innerHTML = `<p>✅ ${importedQuotes.length} quotes imported successfully! Total quotes: ${quotes.length}</p>`;
                console.log('Quotes imported and saved successfully!');
            } else {
                 alert('Invalid JSON structure: Each item must have a "text" and "category".');
            }
        } catch (e) {
            alert('Error parsing JSON file. Please ensure the file is valid.');
            console.error('JSON Parsing Error:', e);
        }
    };
    
    // Read the file content as text
    fileReader.readAsText(file);
}


// =================================================================
// 🚀 INITIALIZATION
// =================================================================

// 1. Load quotes from Local Storage on application start
loadQuotes();

// 2. Set up the dynamic Add Quote form
createAddQuoteForm();

// 3. Attach Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);
exportButton.addEventListener('click', exportToJsonFile);
// Session storage demonstration: show the last quote that was saved
sessionTestButton.addEventListener('click', displayLastViewed);

// 4. Display the first quote
showRandomQuote();