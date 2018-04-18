/*
 * Create a list that holds all of your cards
 */

//get the deck
const deck = document.querySelector('.deck');

//create an empty array to hold all cards
let cards = [];

//populate the array with cards elements
deck.querySelectorAll('.card').forEach(function(card) {
  cards.push(card);
  card.addEventListener('click', flipCard);
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

let openCards = [];

function flipCard() {
  if(this.classList.contains('open')){

  } else {
    this.classList.add('open', 'show');

    openCards.push(this);

    if(openCards.length === 2){

      checkCards(openCards);
      openCards = [];

    }
  }
}


function checkCards(openCards) {
  if(openCards[0].innerHTML == openCards[1].innerHTML){
    console.log('match');
    openCards.forEach(function(openCard){
      openCard.classList.add('match');
      openCard.classList.remove('open', 'show');
    })
    openCards = [];
  } else {
    console.log('no match');
    setTimeout(function(){
      openCards.forEach(function(openCard){
        openCard.classList.remove('open', 'show');
      })
    }, 1000);
  }

}
