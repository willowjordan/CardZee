import {
    Segment,
    Header,
} from "semantic-ui-react";
import useGameContext from "../GameContext";

function TotalScore({ value }) {
    const {totalScore} = useGameContext();
    return (
        <Segment color="blue" inverted textAlign="right">
            <Header as="h1">Total Game Score: {totalScore}</Header>
        </Segment>
    );
}

export default TotalScore;