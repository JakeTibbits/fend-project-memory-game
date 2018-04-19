/*
 * Create a list that holds all of your cards
 */

//get the deck
const deck = document.querySelector('.deck');

//create an empty array to hold all cards
let cards = [];

// declare counter to keep track of number of moves
let movesCounter = 0;

//declare array to keep track of open cards
let openCards = [];



//populate the array with cards elements
deck.querySelectorAll('.card').forEach(function(card) {
  cards.push(card);
  card.addEventListener('click', clickCard);
});



/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/
function refreshCards(){

  //hide the deck for to avoid reflows
  deck.hidden = true;

  //shuffle
  cards = shuffle(cards);

  //re-order the cards using flex order
  let i = 0;
  cards.forEach(function(card){
    i++
    card.style.order = i;
  });

  //unhide the deck to display shuffled cards
  deck.hidden = false;

  incrementCounter('reset');

}


//refresh cards every time the page is loaded so that the order is always different
document.addEventListener("DOMContentLoaded", refreshCards);

//refresh cards when restart button is clicked
document.querySelector('.restart').addEventListener('click', refreshCards);


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
* set up the event listener for a card. If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/





//declare function to fire when card is clicked
function clickCard() {

  //flip the clicked card
  flipCard(this);

  //check for a match
  const cardCheck = checkCards();

  if(cardCheck == "match"){
    //console.log('match');
    matchCards();
  } else if(cardCheck == "noMatch") {
    //console.log('no match');
    unFlipCards();
  }

}

function flipCard(card){

  card.classList.add('open', 'show');
  openCards.push(card);

}

function unFlipCards(){

  deck.style.pointerEvents = "none";
  setTimeout(function(){
    openCards.forEach(function(openCard){
      openCard.classList.remove('open', 'show');
      openCards = [];
      deck.style.pointerEvents = "auto";
    })
  }, 1000);

}

function matchCards(){

  openCards.forEach(function(openCard){
    openCard.classList.add('match');
    openCard.classList.remove('open', 'show');
  })

  openCards = [];

}

function incrementCounter(reset){

  if (reset){
    movesCounter = 0
  } else {
    movesCounter++;
  }
  //console.log(movesCounter);
  const movesSpan = document.querySelector('.moves');
  movesSpan.innerText = movesCounter;


}


function checkCards() {

  //check if two cards are open
  if(openCards.length === 2){

    //increment the move counter
    incrementCounter();

    //check if the open cards match
    if(openCards[0].innerHTML == openCards[1].innerHTML){
      return "match";
    } else {
      return "noMatch";
    }

  }

}
