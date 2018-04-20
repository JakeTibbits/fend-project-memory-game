//DEFINING VARIABLES

//get the deck
const deck = document.querySelector('.deck');
const deckPicker = document.getElementById('deckPicker');

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

let startingTime = "";

const winModal = document.querySelector(".modal");

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

  setDeck();

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

  //if modal is open, hide it
  winModal.removeAttribute('open');

}

//refresh cards every time the page is loaded so that the starting order is always different
document.addEventListener("DOMContentLoaded", refreshCards);

//refresh cards when restart button is clicked
document.querySelector('.restart').addEventListener('click', refreshCards);
winModal.querySelector('.restart').addEventListener('click', refreshCards);
winModal.querySelector('.exit').addEventListener('click', refreshCards);





//DEFINING CARD CLICK BEHAVIOURS

//declare function to fire when card is clicked
function clickCard() {

  if(movesCounter == 0){
    startingTime = performance.now();
  }

  //flip the clicked card
  flipCard(this);

  //check for a match
  const cardCheck = checkCards();

  if(cardCheck == "match"){
    matchCards();
    //check if all cards are matched
    if(matchedCards.length == cards.length){
      const endingTime = performance.now();
      const totalTime = endingTime - startingTime;
      //do a win
      winGame(totalTime);

    }
  } else if(cardCheck == "noMatch") {
    //reset unmatched cards
    unFlipCards();
  }

}


//function to trigger win
function winGame(time){

  const open = document.createAttribute("open");
  winModal.setAttributeNode(open);

  winModal.querySelector(".timer").innerHTML = timeFormat(time);

}


//function to convert milliseconds to readable time
function timeFormat(time) {
  var ms = time % 1000;
  time = (time - ms) / 1000;
  var secs = time % 60;
  time = (time - secs) / 60;
  var mins = time % 60;

  return mins + ' mins ' + secs + ' secs';
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
  }, 1200);

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
  //define variables for outputting score to DOM
  const scorePanel = document.querySelector('.score-panel');
  const movesSpan = scorePanel.querySelector('.moves');
  const topStars = scorePanel.querySelectorAll('.stars li');
  const modalStars = winModal.querySelectorAll('.stars li');

  //hide scorePanel to avoid reflows
  scorePanel.hidden = true;

  //check if counter is to be increased or reset
  if (reset){
    //reset counter
    movesCounter = 0
    //reset stars
    topStars.forEach(function(star){
      star.classList= "";
    });
    modalStars.forEach(function(star){
      star.classList= "";
    });
  } else {
    //increment counter
    movesCounter +=2;
    console.log(movesCounter);
    if(movesCounter == 28){
      topStars[0].classList.add('hidden');
      modalStars[0].classList.add('hidden');
    } else if (movesCounter == 36){
      topStars[2].classList.add('hidden');
      modalStars[2].classList.add('hidden');
    }
  }

  //update moves total
  movesSpan.innerText = movesCounter/2;

  //unhide scorePanel to after changes made
  scorePanel.hidden = false;

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

deckPicker.addEventListener('change', setDeck);

function setDeck(){
  const chosenDeck = deckPicker.options[deckPicker.selectedIndex].value;

  document.querySelector('body').style.backgroundImage = "url('img/"+chosenDeck+"/bg.jpg')";
  deck.classList = "deck "+chosenDeck;
}
