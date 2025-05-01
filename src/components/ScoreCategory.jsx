// components/ScoreCategory.jsx

import {
    Divider,
    Grid,
    GridColumn,
    GridRow,
    Button,
    Header,
} from "semantic-ui-react";
import useGameContext from "../GameContext";

function ScoreCategory({title, description}) {
    const {
        deckID, setDeckID,
        drawsRemaining, setDrawsRemaining,
        cardsRemaining, setCardsRemaining,
        drawnCards, setDrawnCards,
        selectedCards, setSelectedCards,
        scoreData, updateScore, updateCards,
        categoryFunctions,
        newDeck, getDeckStatus, deleteDeck, drawCards,

    } = useGameContext();

    async function recordScore() {
        // make sure selected cards is the right size (just in case)
        if (selectedCards.length != 5) {
            console.error("Selected Cards is the wrong size (should be 5)");
            return;
        }

        // shallow copy and sort selected cards
        const sorted = [...selectedCards].sort((a, b) => a.intValue - b.intValue);

        // call checking  and score functions
        let score = 0;
        let passesTest = false;
        try {
            passesTest = categoryFunctions[title].checkValidity(sorted);
            if (passesTest)
                score = categoryFunctions[title].calculateScore(sorted);
        } catch (error) {
            console.warn(error.message)
        }

        // update state variables
        updateScore(title, score);
        updateCards(title, sorted);

        console.log(`Condition evaluated to ${passesTest} for "${title}"`)
        console.log(`Updated "${title}" score to ${score}`);
        console.log(`Context variable: ${scoreData[title].score}`)

        // get a new deck and reset all necessary vars
        deleteDeck();
        newDeck();
        drawCards(7);
    }

    return (
        <>
            <Grid padded>
                <GridRow color="blue">
                    <GridColumn width={12} textAlign="left">
                        <Header as="h2" inverted>{title}</Header>
                        <i>{description}</i>
                    </GridColumn>
                    <GridColumn width={4} textAlign="center">
                        <Button inverted floated="right" size="mini" onClick={recordScore} disabled={selectedCards.length === 5 ? (false) : (true)}>Record Score</Button>
                        <Header as="h1" inverted>{scoreData[title].score}</Header>
                    </GridColumn>
                </GridRow>
                <GridRow color="blue">
                    <GridColumn width={16}></GridColumn>
                </GridRow>
            </Grid>
            <Divider fitted></Divider>
        </>
    );
}

export default ScoreCategory;