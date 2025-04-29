import {
    Segment,
    SegmentGroup,
    Header,
    Button,
    Label,
} from "semantic-ui-react";

function LeftPanel() {
    return (
        <Segment>
            <Label attached="top" size="big">
                <Header as='h2' floated="left">Rules of Play</Header>
                <Button floated="right" secondary>New Game</Button>
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
                    <Header as='h3' textAlign="center">Draws left: {3}</Header>
                </Segment>
                <Segment color="blue" inverted>
                    <Button secondary floated="right">Draw Cards</Button>
                </Segment>
            </SegmentGroup>
            {/* CardList here */}
            {/* Selected cards here */}
            <SegmentGroup horizontal>
                <Segment color="blue" inverted>
                    <Header as='h3' floated="left">Selected Cards</Header>
                </Segment>
            </SegmentGroup>
            {/* CardList here */}
        </Segment>
    );
}

export default LeftPanel;