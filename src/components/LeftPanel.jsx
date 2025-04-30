import {
    Segment,
    SegmentGroup,
    Header,
    Button,
    Label,
} from "semantic-ui-react";
import useGameState from "../hooks/useGameState";
import useDeckAPI from "../hooks/useDeckAPI";
import CardList from "./CardList";

function LeftPanel() {
    const {
        deckID, setDeckID,
        drawsRemaining, setDrawsRemaining,
        cardsRemaining, setCardsRemaining,
        drawnCards, setDrawnCards,
        selectedCards, setSelectedCards,
        scoreData, updateScore, updateCards,
    } = useGameState();
    const {
        newDeck,
        getDeckStatus,
        deleteDeck,
        drawCards,
    } = useDeckAPI();

    async function newGame() {
        // TODO: delete all scores
        

        newDeck();
    }

    return (
        <Segment>
            <Label attached="top" size="big">
                <Header as='h2' floated="left">Rules of Play</Header>
                <Button floated="right" secondary onClick={newGame()} disabled={deckID ? (false) : (true)}>New Game</Button>
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
                    <Button secondary floated="right" onClick={drawCards(drawnCards.length)} disabled={drawsRemaining > 0 ? (false) : (true)}>Draw Cards</Button>
                </Segment>
            </SegmentGroup>
            { drawnCards ? (<></>) : (
                <Segment>
                    <CardList cards={drawnCards}/>
                </Segment>
            )}
            {/* Selected cards panel */}
            <SegmentGroup horizontal>
                <Segment color="blue" inverted>
                    <Header as='h3' floated="left">Selected Cards</Header>
                </Segment>
            </SegmentGroup>
            { selectedCards ? (<></>) : (
                <Segment>
                    <CardList cards={selectedCards}/>
                </Segment>
            )}
        </Segment>
    );
}

export default LeftPanel;