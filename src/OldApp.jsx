import { useState, useEffect } from 'react'
import 'semantic-ui-css/semantic.min.css'
import {
  Label,
  Card,
  CardGroup,
  Segment,
  Input,
  Button,
} from "semantic-ui-react";
import './App.css'

function App() {
  function checkLocalStorage(key, defaultValue) {
    if (localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key));
    } 
    return defaultValue;
  }

  // State Variables.
  const [deckID, setDeckID] = useState( checkLocalStorage("cardsApiDeckID","") );
  const [cardsRemaining, setCardsRemaining] = useState( undefined );
  const [cards, setCards] = useState( checkLocalStorage("cardsApiCards",[]) );
  const [enteredDeckValue, setEnteredDeckValue] = useState("enter deck id");

  // Whever the deckID is set, if cardsRemaining is undefined, query the API to get the current number of cards remaining.
  useEffect(() => { 
    if ( deckID!== "" && deckID!== undefined ) {
      // Note that this can cause multiple error messages when a bad deckID is entered.
      getDeckStatus(deckID);
    }
  }, [deckID,cardsRemaining]);
  
  
  // Utility functions, mostly network and clickTriggers.....
  
  // Fetches a new Deck and sets the state variables.
  // Also manages localStorage so that the app can gracefully handle a page reload.
  async function newDeck() {
    const deckResponse = await fetch('https://cards.soward.net/deck/newDeck');
    // Trap an error at the HTTP level.
    if (!deckResponse.ok) {
      alert('Error fetching new deck: ' + deckResponse.error);
      return;
    }
    let deckJson = "";
    // Use 'try' to catch errors in the decoded or from the API itself.
    try {
      deckJson = await deckResponse.json();
    } catch (error) {
      alert(`Error fetching Deck: ${error}<br>${deckResponse.body}`);
      return;
    }
    if (deckJson.success != true) {
      alert(`Error fetching Deck. Status: ${deckJson.status} Message: ${deckJson.message}`);
      return;
    }
    setDeckID(deckJson.deckID);
    localStorage.setItem("cardsApiDeckID", JSON.stringify(deckJson.deckID));
    // We could rely on useEffect here, but we can save an API call by setting it directly.
    setCardsRemaining(deckJson.cardsRemaining);
    // Once we fetch a new deck, then we cannot show any cards previously drawn ( from another deck )
    setCards(undefined);
    localStorage.removeItem("cardsApiCards")
  }

  // For a given deckID, we can make sure it still exists and get the number of cards remaing.
  // Needed since anotehr instace of the app could have modified any given deck.
  async function getDeckStatus(deckIDToCheck) {
    let deckToCheck = deckIDToCheck;
    if ( deckToCheck === undefined ) {
      deckToCheck = deckID;
    }
    console.log("Checking deck status for: " + deckToCheck);
    const deckResponse = await fetch('https://cards.soward.net/deck/deckStatus/' + deckToCheck);
    if (!deckResponse.ok) {
      alert('Error getting deck status: ' + deckResponse.error);
      setCardsRemaining(0);
      return;
    }

    const deckInfo = await deckResponse.json();
    if (deckInfo.status !== undefined && deckInfo.status!= 200) {
      alert(`Error getting Deck status: ${deckInfo.status} Message: ${deckInfo.message}`);
      setCardsRemaining(0);
      return;
    }
    // Uncomment to see all of what is returned...
    console.log(deckInfo);
    setCardsRemaining(deckInfo.cardsRemaining);
  }

  // Uses API to remove a deck, assumes deckID is set.
  // Updates state variable accordingly.
  // Also removes items from localStorage as needed.
  async function deleteDeck() {
    const deckResponse = await fetch('https://cards.soward.net/deck/deleteDeck/' + deckID, { method: 'DELETE' });
    if (!deckResponse.ok) {
      alert('Error deleting deck: ' + deckResponse.error);
      return;
    }
    setDeckID("");
    localStorage.removeItem("cardsApiDeckID");
    setCardsRemaining(0);
    localStorage.removeItem("cardsApiCards");
    setCards(undefined);
  }

  // Pull some cards via the API.
  // Hard coded to 4.
  // No check to see if there are enough cards in the deck.
  // Updates State Variable 'Cards' to hold array of cards returned
  // Decrements State Variable 'Cards Remaining' by 4
  async function drawCards() {
    if ( deckID === "" ) {
      alert("Please get a new deck first");
      return;
    }
    const deckResponse = await fetch('https://cards.soward.net/deck/drawFromDeck/' + deckID +"/4");
    if (!deckResponse.ok) {
      throw new Error(deckResponse.error);
    }
    const cardsJson = await deckResponse.json();
    if ( cardsJson.success === false ) {
      alert(cardsJson.message);
      return;
    }
    setCards(cardsJson.cards);
    localStorage.setItem("cardsApiCards", JSON.stringify(cardsJson.cards));

    // Really should ask the API for status here and set from that.
    let newCardsRemaining = cardsRemaining - 4;
    setCardsRemaining(newCardsRemaining);
    }  

  // User is requesting a specific deckID to be loaded.
  async function useDeck() {
    if ( enteredDeckValue !== ""  && enteredDeckValue!== "enter deck id" ) {
      //console.log(`do we have a usable deck id? ${enteredDeckValue}`);
      setDeckID(enteredDeckValue);
      localStorage.removeItem("cardsApiDeckID");
      localStorage.removeItem("cardsApiCards");
      localStorage.removeItem("cards");
      setCards(undefined);
      // Pass this in here, since setDeckID is async, it may not be set yet...
      getDeckStatus(enteredDeckValue);
      
    } else {
      alert("Please enter a valid deck id");
      return;
    }
  }

  // This just keeps an accessible version of what the user has entered available as they enter it.
  // it is called every time the field changes.
  function updateEnteredDeckValue(event) {
    // Uncomment below and explore the event object in the console to understand what is available.
    // console.log(event);
    setEnteredDeckValue(event.target.value);
  }

  async function removeCards() {
    localStorage.removeItem("cardsApiCards");
    localStorage.removeItem("cards");
    setCards(undefined);
  }

  // Output from "Main Component", App 
  return (
    <>
      <Segment>
        { /* enable/disable buttons based on state variables */ }
        { /* Specifically, can't get a newDeck until you delete the old */ }
        { /* Can't delete Deck w/o one, Can't fetch cards w/o an active Deck */ }
        <Button onClick={newDeck} disabled={deckID === "" ? (false) : (true)}>Fetch New Deck</Button>
        <Button onClick={drawCards} disabled={cardsRemaining ? (false) : (true)}>Fetch Cards From Deck</Button>
        <Button onClick={deleteDeck} disabled={deckID !== "" ? (false) : (true)}>Remove Deck</Button>
        <Button onClick={removeCards} disabled={cards ? (false) : (true)}>Remove Cards</Button>
        <Input name="enteredDeckID" 
               label={{ basic: true, content: 'DeckID'}}  
               labelPosition='left' 
               value={enteredDeckValue}
               onChange={updateEnteredDeckValue}
        ></Input>
        <Button onClick={useDeck} >Use entered Deck</Button>
      </Segment>

      { /*  Use the JavaScript map() function to iterate the cards array and stamp out one Player component for each item in the array */}
      { /* You will want to change the names and values here to be appropriate for Assignment #4. Note that as-is, 'state' is not useful...*/ }
      <CardGroup centered>
        {/* console.log(cards) */ }
          { cards !== undefined && cards.length > 0 ? cards.map(({svgImage,intVal,suitName,value,color}) => (
            <Player card={svgImage} name={value + " of " + suitName} winState={intVal} suitColor={color} />
           )) : (
            <Segment>Nothing to see here.</Segment>
            )}
      </CardGroup>
      <Segment>
        <Label>Deck ID: {deckID}</Label>
        <Label>Cards Remaining: {cardsRemaining}</Label>
      </Segment>
    </>
  )
}

export default App

// Components.
  // Display a Player, their name, card and score.
  // You will want to update this to be appropriate for your game.
  function Player({ name, card, winState, suitColor }) {
    // Determine the background color based on win/Loose/state
    // Not used in this demo, but might be useful for HiCard...
    let color = "";
    switch (winState) {
      case "Won": color = "green";
             break;
      case "Tied": color = "yellow";
            break;
      case "Lost": 
      default:
             color = "lightgrey";
             break;
    }
    // Build something to use as a 'key' so that groups of cards can be uniquely identified.
    const key = name + suitColor;
    
    // Don't be confused with <Card> is is a Semantic-UI component not just for Playing Cards.
    //   Instead it's just a display 'style' for displaying a group of text and graphical elements.
    return (
      <Card style={{ backgroundColor: color }} key={key}>
            <Card.Content>
              { /* You can put comments in here too... */ }
              { /* You will want to tweak these a bit for Assignment #4 */ }
              <div className="ui center aligned header" > {name} </div>
            </Card.Content>
            <img src={card} alt="Card" />
            <Card.Content>
              <div className="header">
                <div className="center aligned"> color: {suitColor} </div>
              </div>
            </Card.Content>
      </Card>
    );
  }
