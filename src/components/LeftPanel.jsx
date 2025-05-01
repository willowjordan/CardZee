import {
    Segment,
    SegmentGroup,
    Header,
    Button,
    Label,
} from "semantic-ui-react";
import useGameContext from "../GameContext";
import CardList from "./CardList";

function LeftPanel() {
    const {
        deckID, setDeckID,
        drawsRemaining, setDrawsRemaining,
        cardsRemaining, setCardsRemaining,
        drawnCards, setDrawnCards,
        selectedCards, setSelectedCards,
        scoreData, updateScore, updateCards, resetScoreData,
        newDeck, drawCards,
    } = useGameContext();

    async function newGame() {
        newDeck();

        // reset values
        resetScoreData();
    }

    async function selectCard(index) {
        if (selectedCards.length >= 5) return; // Don't allow user to select more than 5 cards
        const cardToMove = drawnCards[index]; // Get card
        const updatedDrawn = [
            ...drawnCards.slice(0, index),
            ...drawnCards.slice(index + 1)
        ]; // Remove from drawnCards
        const updatedSelected = [...selectedCards, cardToMove]; // Add to selectedCards
        // Update both states
        setDrawnCards(updatedDrawn);
        setSelectedCards(updatedSelected);
    }

    async function deselectCard(index) {
        const cardToMove = selectedCards[index]; // Get card
        const updatedSelected = [
            ...selectedCards.slice(0, index),
            ...selectedCards.slice(index + 1)
        ]; // Remove from selectedCards
        const updatedDrawn = [...drawnCards, cardToMove]; // Add to drawnCards

        // Update both states
        setDrawnCards(updatedDrawn);
        setSelectedCards(updatedSelected);
    }

    return (
        <Segment>
            <Label attached="top" size="big">
                <Header as='h2' floated="left">Rules of Play</Header>
                <Button floated="right" secondary onClick={newGame}>New Game</Button>
            </Label>
            <Header as='h1'></Header>
            <Segment basic>
            Goal is to get the highest total score, by matching hands of 5 cards to the scoring categories on the right.<br/>
            Start play by drawing a hand of 7 cards. Then select which cards to keep by clicking on them.<br/>
            You can then re-draw the remaining cards twice again, then you must select 5 from what remains.<br/>
            Finally, choose which category to score them.
            </Segment>
            {/* Drawn cards panel */}
            <SegmentGroup horizontal>
                <Segment color="blue" inverted>
                    <Header as='h3' floated="left">Drawn Cards</Header>
                </Segment>
                <Segment color="blue" inverted>
                    <Header as='h3' textAlign="center">Draws left: {drawsRemaining}</Header>
                </Segment>
                <Segment color="blue" inverted>
                    <Button secondary floated="right" onClick={() => drawCards((selectedCards.length === 0) ? (7) : (drawnCards.length))} disabled={drawsRemaining > 0 ? (false) : (true)}>Draw Cards</Button>
                </Segment>
            </SegmentGroup>
            { drawnCards.length > 0 ? (<CardList cards={drawnCards} clickFunction={selectCard}/>) : (<></>)}
            {/* Selected cards panel */}
            <SegmentGroup horizontal>
                <Segment color="blue" inverted>
                    <Header as='h3' floated="left">Selected Cards</Header>
                </Segment>
            </SegmentGroup>
            { selectedCards.length > 0 ? (<CardList cards={selectedCards} clickFunction={deselectCard}/>) : (<></>)}
        </Segment>
    );
}

export default LeftPanel;