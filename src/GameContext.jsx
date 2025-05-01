// GameContent.jsx
// Context provider for entire app handling game values and methods

import { useState, useEffect,
    createContext, useContext,
} from 'react';
import {
    checkFourOfAKind,
    checkThreeOfAKind,
    checkFullHouse,
    checkTwoPair,
    checkFlush,
    sumCards,
} from "./utils/categoryFuncs";

const GameContext = createContext();

const initialScores = {
    "Four of a Kind": { score: 0, cards: [] },
    "Three of a Kind": { score: 0, cards: [] },
    "Full House": { score: 0, cards: [] },
    "Two Pair": { score: 0, cards: [] },
    "Flush": { score: 0, cards: [] },
    "Chance": { score: 0, cards: [] },
};
const categoryFunctionsDict = {
    "Four of a Kind": { checkValidity: checkFourOfAKind, calculateScore: sumCards },
    "Three of a Kind": { checkValidity: checkThreeOfAKind, calculateScore: sumCards },
    "Full House": { checkValidity: checkFullHouse, calculateScore: (cards) => 50 },
    "Two Pair": { checkValidity: (cards) => checkTwoPair(cards), calculateScore: sumCards },
    "Flush": { checkValidity: checkFlush, calculateScore: sumCards },
    "Chance": { checkValidity: (cards) => true, calculateScore: sumCards },
};

export const GameProvider = ({ children }) => {
    // state variables
    const [deckID, setDeckID] = useState("");
    const [drawsRemaining, setDrawsRemaining] = useState(3);
    const [cardsRemaining, setCardsRemaining] = useState(52);
    const [drawnCards, setDrawnCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [scoreData, setScoreData] = useState(initialScores);
    const [totalScore, setTotalScore] = useState(0);
    const [categoryFunctions, setCategoryFunctions] = useState(categoryFunctionsDict);

    // Functions for modifying score data
    const updateScore = (categoryName, newScore) => {
        setScoreData(prev => ({
            ...prev,
            [categoryName]: {
                ...prev[categoryName],
                score: newScore,
            },
        }));
    }
    const updateCards = (categoryName, newCards) => {
        setScoreData(prev => ({
            ...prev,
            [categoryName]: {
                ...prev[categoryName],
                cards: newCards,
            },
        }));
    }
    const resetScoreData = () => {
        setScoreData(initialScores);
    }

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
        // We could rely on useEffect here, but we can save an API call by setting it directly.
        setCardsRemaining(deckJson.cardsRemaining);

        // Clear cards
        setDrawnCards([]);
        setSelectedCards([]);
        setDrawsRemaining(3);

        return deckJson.deckID;
    }

    // Pull numDraw cards via the API.
    // No check to see if there are enough cards in the deck.
    // Updates State Variable 'drawnCards' to hold array of cards returned
    // Decrements State Variable 'Cards Remaining' by numDraw
    const drawCards = async(numDraw, createNewDeck=false) => {
        let deckIDtoUse = deckID;
        if ( deckIDtoUse === "" || createNewDeck ) {
            deckIDtoUse = await newDeck();
            console.log(deckID);
        }
        console.log('https://cards.soward.net/deck/drawFromDeck/' + deckIDtoUse + "/" + numDraw)
        const deckResponse = await fetch('https://cards.soward.net/deck/drawFromDeck/' + deckIDtoUse + "/" + numDraw);
        if (!deckResponse.ok) {
            throw new Error("API Error while fetching cards: " + deckResponse.error);
        }
        const cardsJson = await deckResponse.json();
        if ( cardsJson.success === false ) {
            alert(cardsJson.message);
            return;
        }
        setDrawnCards(cardsJson.cards);

        let newCardsRemaining = cardsRemaining - numDraw;
        setCardsRemaining(newCardsRemaining);

        if (createNewDeck)
            setDrawsRemaining(2);
        else
            setDrawsRemaining(drawsRemaining - 1);
    }
  
    return (
        <GameContext.Provider value={{
            deckID, setDeckID,
            drawsRemaining, setDrawsRemaining,
            cardsRemaining, setCardsRemaining,
            drawnCards, setDrawnCards,
            selectedCards, setSelectedCards,
            scoreData, updateScore, updateCards, resetScoreData,
            totalScore, setTotalScore,
            newDeck, drawCards,
            categoryFunctions}}>
            {children}
        </GameContext.Provider>
    );
};

// custom hook
export const useGameContext = () => useContext(GameContext);
export default useGameContext;