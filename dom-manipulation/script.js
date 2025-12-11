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
const newQuoteText = document.getElementById("newQuoteText")
const newQuoteCategory = document.getElementById("newQuoteCategory")
const appContainer = document.querySelector('body');
const userQuote = document.getElementById("userQuote")

function showRandomQuote(){
    const randomIndex = Math.floor(Math.random()* quotes.length)
    quoteDisplay.innerHTML = quotes[randomIndex].text
}

newQuoteButton.addEventListener("click", showRandomQuote)

function createAddQuoteForm (){
        if(newQuoteText.value && newQuoteCategory.value){
            const userObj = { 
                category: newQuoteCategory.value,
                text: newQuoteText.value
            }
            const h1 = document.createElement("h1")
            h1.textContent = userObj.text
            userQuote.appendChild(h1)
        }else{
            alert("Enter a quote and category")
        }
}
const addStorage = () =>{
    localStorage.setItem('localQuotes', JSON.stringify(quotes));
    console.log(localQuotes)
}


const retrieveQuote = () =>{
    const abc = localStorage.getItem("localQuotes")
    console.log(JSON.parse(abc))
}
exportButton.addEventListener("click", retrieveQuote)



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
