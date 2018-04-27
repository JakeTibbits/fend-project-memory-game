/*jshint esversion: 6 */


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

let timer = null;
let time;
let counter = 0;
const timerDisplay = document.querySelector(".time");

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
    i++;
    card.style.order = i;
    //reset all cards to initial state
    card.classList = "card";
  });

  //unhide the deck to display shuffled cards
  deck.hidden = false;

  //reset the moveCounter
  incrementCounter('reset');

  //close any open cards
  openCards = [];


  counter = 0;
  endGame(0, false);



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

  if(movesCounter === 0){
    //startingTime = performance.now();
    startTimer();
  }

  //flip the clicked card
  flipCard(this);

  //check for a match
  const cardCheck = checkCards();

  if(cardCheck == "match"){
    matchCards();
    //check if all cards are matched
    if(matchedCards.length == cards.length){
      //do a win
      endGame(time, true);
    }
  } else if(cardCheck == "noMatch") {
    //reset unmatched cards
    unFlipCards();
  }

}


//function to trigger win
function endGame(time, win){

  if(win){
    const open = document.createAttribute("open");
    winModal.setAttributeNode(open);
    clearInterval(timer);
    time = timeFormat(counter * 1000);
  } else {
    clearInterval(timer);
    time = timeFormat(counter * 1000);
  }

  timerDisplay.innerText = time;

  winModal.querySelector(".timer").innerText = time;

}




function startTimer() {
  timer = setInterval(function(){
    incrementTime();
  },1000);
}

function incrementTime(){
  counter++;
  time = timeFormat(counter * 1000);
  timerDisplay.innerText = time;
}


//function to convert milliseconds to readable time - found at https://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
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
    });
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
  });
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
    movesCounter = 0;
    //reset stars
    topStars.forEach(function(star){
      star.classList= "";
    });
    modalStars.forEach(function(star){
      star.classList= "";
    });
    movesSpan.innerText = movesCounter;
  } else {
    //increment counter
    movesCounter +=0.5;
    //console.log(movesCounter);
    if(movesCounter == 14){
      topStars[0].classList.add('hidden');
      modalStars[0].classList.add('hidden');
    } else if (movesCounter == 20){
      topStars[2].classList.add('hidden');
      modalStars[2].classList.add('hidden');
    }
  }

  if(openCards.length === 2){
    //update moves total
    movesSpan.innerText = movesCounter;
  }

  //unhide scorePanel to after changes made
  scorePanel.hidden = false;

}


function checkCards() {
  //increment the move counter
  incrementCounter();

  //check if two cards are open
  if(openCards.length === 2){


    //check if the open cards match
    if(openCards[0].getAttribute("pair") == openCards[1].getAttribute("pair")){
      return "match";
    } else {
      return "noMatch";
    }

  }

}

//add listener to trigger event when a different deck is chosen
deckPicker.addEventListener('change', refreshCards);

function setDeck(){
  //find out which deck was chosen
  const chosenDeck = deckPicker.options[deckPicker.selectedIndex].value;
  //change the background image to match the new deck
  document.querySelector('body').style.backgroundImage = "url('img/"+chosenDeck+"/bg.jpg')";
  //give the deck a class to contain any styles for the chosen deck
  deck.classList = "deck "+chosenDeck;

  //loop through cards
  cards.forEach(function(card){
    //find out which pair the card belongs to
    const letter = card.getAttribute("pair");
    //give the card the appropriate styling for the deck and pair
    card.querySelector(".back").style.backgroundImage = "url(img/"+chosenDeck+"/reverse.svg)";
    card.querySelector(".front").classList = "front "+chosenDeck;
    card.querySelector(".front").style.backgroundImage = "url(img/"+chosenDeck+"/"+letter+".svg)";

  });


}
