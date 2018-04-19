//DEFINING VARIABLES

//get the deck
const deck = document.querySelector('.deck');

//create an empty array to hold all cards
let cards = [];

//populate the array with cards elements and give each card a click eventListener
deck.querySelectorAll('.card').forEach(function(card) {
  cards.push(card);
  card.addEventListener('click', clickCard);
});

// declare counter to keep track of number of moves
let movesCounter = 0;

//declare array to keep track of open cards
let openCards = [];

//declare array to keep track of matched cards
let matchedCards = [];




//SHUFFLING AND DEALING

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

//define function to shuffle and deal the cards
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
    //reset all cards to initial state
    card.classList = "card";
  });

  //unhide the deck to display shuffled cards
  deck.hidden = false;

  //reset the moveCounter
  incrementCounter('reset');

}

//refresh cards every time the page is loaded so that the starting order is always different
document.addEventListener("DOMContentLoaded", refreshCards);

//refresh cards when restart button is clicked
document.querySelector('.restart').addEventListener('click', refreshCards);





//DEFINING CARD CLICK BEHAVIOURS

//declare function to fire when card is clicked
function clickCard() {

  //flip the clicked card
  flipCard(this);

  //check for a match
  const cardCheck = checkCards();

  if(cardCheck == "match"){
    matchCards();
    //check if all cards are matched
    if(matchedCards.length == cards.length){
      //do a win
      console.log("you win");
    }
  } else if(cardCheck == "noMatch") {
    //reset unmatched cards
    unFlipCards();
  }

}


//function to flip a card on click
function flipCard(card){

  //add open card styles
  card.classList.add('open', 'show');
  //add card to openCards array
  openCards.push(card);

}


//function to reset cards if no match found
function unFlipCards(){

  //make other cards unclickable during delay
  deck.style.pointerEvents = "none";

  //add a delay to give people time to memorize the cards
  setTimeout(function(){
    openCards.forEach(function(openCard){
      //remove open card styles
      openCard.classList.remove('open', 'show');
      //reset openCards array
      openCards = [];
      //re-endable clicking
      deck.style.pointerEvents = "auto";
    })
  }, 1500);

}

//function to set cards to matched state
function matchCards(){

  openCards.forEach(function(openCard){
    //set matched card class and remove open card classes
    openCard.classList.add('match');
    openCard.classList.remove('open', 'show');

    //add cards to matchedCards array
    matchedCards.push(openCard);
  })
  //reset openCards array
  openCards = [];

}

//function to increment or reset the movesCounter
function incrementCounter(reset){

  //check if counter is to be increased or reset
  if (reset){
    //reset counter
    movesCounter = 0
  } else {
    //increment counter
    movesCounter++;
  }
  //output new counter value to DOM
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
