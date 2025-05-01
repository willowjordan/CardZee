// GameContent.jsx
// Context provider for entire app handling game values and methods

import { useState, useEffect,
    createContext, useContext,
} from 'react';
import { checkLocalStorage } from './utils/localStorage';
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
    const [categoryFunctions, setCategoryFunctions] = useState(categoryFunctionsDict);

    // Save to localStorage when deckID changes
    useEffect(() => {
        if (deckID) {
            localStorage.setItem("cardsApiDeckID", JSON.stringify(deckID));
        }
    }, [deckID]);

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
  
    return (
        <GameContext.Provider value={{
            deckID, setDeckID,
            drawsRemaining, setDrawsRemaining,
            cardsRemaining, setCardsRemaining,
            drawnCards, setDrawnCards,
            selectedCards, setSelectedCards,
            scoreData, updateScore, updateCards,
            categoryFunctions}}>
            {children}
        </GameContext.Provider>
    );
};

// custom hook
export const useGameContext = () => useContext(GameContext);
export default useGameContext;