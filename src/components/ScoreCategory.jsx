import {
    Divider,
    Grid,
    GridColumn,
    GridRow,
    Button,
    Header,
} from "semantic-ui-react";
import useGameState from "../hooks/useGameState";
import {
    checkFourOfAKind,
    checkThreeOfAKind,
    checkFullHouse,
    checkTwoPair,
    checkFlush,
    checkChance,
} from "../utils/checkCategory";

function ScoreCategory({ title, description}) {
    const {
        deckID, setDeckID,
        drawsRemaining, setDrawsRemaining,
        cardsRemaining, setCardsRemaining,
        drawnCards, setDrawnCards,
        selectedCards, setSelectedCards,
        scoreData, updateScore, updateCards,
    } = useGameState();

    async function handleClick() {
        // make sure selected cards is the right size (just in case)
        if (selectedCards.length != 5) {
            console.error("Selected Cards is the wrong size (should be 5)");
            return;
        }

        // shallow copy and sort selected cards
        const sorted = [...selectedCards].sort((a, b) => a.intValue - b.intValue);

        // call checking functions
        let passesTest = false;
        if (title === "Four of a kind") {
            passesTest = checkFourOfAKind(sorted)
        } else if (title === "Three of a kind") {
            passesTest = checkThreeOfAKind(sorted)
        } else if (title === "Full house") {
            passesTest = checkFullHouse(sorted)
        } else if (title === "Two pair") {
            passesTest = checkTwoPair(sorted)
        } else if (title === "Flush") {
            passesTest = checkFlush(sorted)
        } else if (title === "Chance") {
            passesTest = checkChance(sorted)
        } else {
            console.warn("Unrecognized category " + title);
        }

        // call score calculation function
        // TODO: create actual functions for this
        score = sum(...sorted.intValue)
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
                        <Button inverted floated="right" size="mini" onClick={handleClick()}>Record Score</Button>
                        <Header as="h1" inverted>{score}</Header>
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