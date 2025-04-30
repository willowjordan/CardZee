// hooks/use_game_state.jsx
// custom hook for handling state variables for entire project

import { useState, useEffect } from 'react';
import { checkLocalStorage } from '../utils/localStorage';

const initialScores = {
    "Four of a Kind": { score: 0, cards: [] },
    "Three of a Kind": { score: 0, cards: [] },
    "Full House": { score: 0, cards: [] },
    "Two Pair": { score: 0, cards: [] },
    "Flush": { score: 0, cards: [] },
    "Chance": { score: 0, cards: [] },
};

export function useGameState() {
    // State Variables.
    const [deckID, setDeckID] = useState( checkLocalStorage("cardsApiDeckID","") );
    const [drawsRemaining, setDrawsRemaining] = useState(3);
    const [cardsRemaining, setCardsRemaining] = useState( undefined );
    const [drawnCards, setDrawnCards] = useState(undefined);
    const [selectedCards, setSelectedCards] = useState(undefined);
    const [scoreData, setScoreData] = useState(initialScores);

    // Save to localStorage when deckID changes
    useEffect(() => {
        if (deckID) {
            localStorage.setItem("cardsApiDeckID", JSON.stringify(deckID));
        }
    }, [deckID]);

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

    return {
        deckID, setDeckID,
        drawsRemaining, setDrawsRemaining,
        cardsRemaining, setCardsRemaining,
        drawnCards, setDrawnCards,
        selectedCards, setSelectedCards,
        scoreData, updateScore, updateCards
    };
}
