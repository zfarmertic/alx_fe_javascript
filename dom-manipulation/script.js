const quoteObj = [
    {
        category: "advice",
        text:"once beaten twice shy",
    },
    {
        category: "christianity",
        text: "Christ in me the Hope of glory",
    },
    {
        category: "Christianity",
        text: "That the excellency of the power may be of God and not of us"
    },
    {
        category: "Inspiration",
        text: "If God be for us who can be against"
    }
]




const newQuote = document.getElementById("newQuote")
const quoteDisplay = document.getElementById("quoteDisplay")
function showRandomQuote(){
    const randomIndex = Math.floor(Math.random() * quoteObj.length)
    // console.log(randomIndex)
    const Quoted = quoteObj[randomIndex].text
    quoteDisplay.textContent = Quoted
    // console.log(Quoted)

}

newQuote.addEventListener("click", showRandomQuote)

const newQuoteText = document.getElementById("newQuoteText")

const newQuoteCategory = document.getElementById("newQuoteCategory")

function addQuote(){
    const userObj = {}
    userObj.category = newQuoteCategory.value;
    userObj.text = newQuoteText.value;

    quoteObj.push(userObj)

    console.log(quoteObj)

    const randomIndex = Math.floor(Math.random() * quoteObj.length)
    const Quoted = quoteObj[randomIndex].text
    const div = document.createElement("div")
    div.innerHTML = Quoted
    quoteDisplay.appendChild(div)
}
