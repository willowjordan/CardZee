import { useState, useEffect } from 'react'
import 'semantic-ui-css/semantic.min.css'
import {
    Button,
    Card,
    CardGroup,
    Grid,
    GridColumn,
    GridRow,
    Header,
    Segment,
} from "semantic-ui-react";
import LeftPanel from "./components/LeftPanel.jsx";
import RightPanel from "./components/RightPanel.jsx";
import './App.css'

function App() {
    function checkLocalStorage(key, defaultValue) {
        if (localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key));
        } 
        return defaultValue;
    }

    const initialScores = {
        "Four of a Kind": { score: 0, cards: [] },
        "Three of a Kind": { score: 0, cards: [] },
        "Full House": { score: 0, cards: [] },
        "Two Pair": { score: 0, cards: [] },
        "Flush": { score: 0, cards: [] },
        "Chance": { score: 0, cards: [] },
    };

    // State Variables.
    const [deckID, setDeckID] = useState( checkLocalStorage("cardsApiDeckID","") );
    const [cardsRemaining, setCardsRemaining] = useState( undefined );
    const [drawnCards, setDrawnCards] = useState(undefined);
    const [selectedCards, setSelectedCards] = useState(undefined);
    const [scoreData, setScoreData] = useState(initialScores);

    // Functions for modifying score data
    function updateScore(categoryName, newScore) {
        setScoreData(prev => ({
            ...prev,
            [categoryName]: {
                ...prev[categoryName],
                score: newScore,
            },
        }));
    }
    function updateCards(categoryName, newCards) {
        setScoreData(prev => ({
            ...prev,
            [categoryName]: {
                ...prev[categoryName],
                cards: newCards,
            },
        }));
    }

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
    }

    // For a given deckID, we can make sure it still exists and get the number of cards remaing.
    // Needed since another instace of the app could have modified any given deck.
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
    
    return (
        <>
            <Header as='h1'>CardZee</Header>
            <Grid>
                <GridColumn width={10}><LeftPanel /></GridColumn>
                <GridColumn width={5}><RightPanel /></GridColumn>
            </Grid>
        </>
    );
}  

export default App