// functions for calling the API, getting a new deck, drawing cards, etc

import { useGameState } from './useGameState';

export function useDeckAPI() {
    const {
        deckID, setDeckID,
        drawsRemaining, setDrawsRemaining,
        cardsRemaining, setCardsRemaining,
        drawnCards, setDrawnCards,
        selectedCards, setSelectedCards,
        scoreData, updateScore, updateCards,
    } = useGameState();

    // Fetches a new Deck and sets the state variables.
    // Also manages localStorage so that the app can gracefully handle a page reload.
    const newDeck = async() => {
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
    const getDeckStatus = async(deckIdToCheck) => {
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
    const deleteDeck = async() => {
        const deckResponse = await fetch('https://cards.soward.net/deck/deleteDeck/' + deckID, { method: 'DELETE' });
        if (!deckResponse.ok) {
            alert('Error deleting deck: ' + deckResponse.error);
            return;
        }
        setDeckID("");
        localStorage.removeItem("cardsApiDeckID");
        setCardsRemaining(0);
        localStorage.removeItem("cardsApiDrawnCards");
        setDrawnCards(undefined);
        setSelectedCards(undefined);
    }

    // Pull numDraw cards via the API.
    // No check to see if there are enough cards in the deck.
    // Updates State Variable 'drawnCards' to hold array of cards returned
    // Decrements State Variable 'Cards Remaining' by numDraw
    const drawCards = async(numDraw) => {
        if ( deckID === "" ) {
            alert("Please get a new deck first");
            return;
        }
        const deckResponse = await fetch('https://cards.soward.net/deck/drawFromDeck/' + deckID + "/" + numDraw);
        if (!deckResponse.ok) {
            throw new Error(deckResponse.error);
        }
        const cardsJson = await deckResponse.json();
        if ( cardsJson.success === false ) {
            alert(cardsJson.message);
            return;
        }
        setDrawnCards(cardsJson.cards);
        localStorage.setItem("cardsApiDrawnCards", JSON.stringify(cardsJson.cards));

        let newCardsRemaining = cardsRemaining - numDraw;
        setCardsRemaining(newCardsRemaining);

        setDrawsRemaining(drawsRemaining - 1);
    }

    return {
        newDeck,
        getDeckStatus,
        deleteDeck,
        drawCards,
    };
}