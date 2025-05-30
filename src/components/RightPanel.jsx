import {
    Segment,
    Checkbox,
} from "semantic-ui-react";

import ScoreCategory from "./ScoreCategory";
import TotalScore from "./TotalScore";

function RightPanel() {
    let categories = [
        {
            "title": "Four of a Kind",
            "description": "Sum of card values for which there are 4 or more of any one value."
        },
        {
            "title": "Three of a Kind",
            "description": "Sum of card values for which there are 3 or more of any one value."
        },
        {
            "title": "Full House",
            "description": "Score 50 for 3 of one kind + a pair of another."
        },
        {
            "title": "Two Pair",
            "description": "Score the sum of all cards if hand contains 2 pair."
        },
        {
            "title": "Flush",
            "description": "Score the sum of all cards if they are all the same suit."
        },
        {
            "title": "Chance",
            "description": "Score the sum of all cards, regardless of their matches."
        },
    ]

    return (
        <Segment>
            {/*<Segment><Checkbox label="Show scored hands" defaultChecked></Checkbox></Segment>*/}
            {categories.map((category, index) => (
                <ScoreCategory
                key={index}
                title={category.title}
                description={category.description}
                />
            ))}
            <TotalScore></TotalScore>
        </Segment>
    );
}

export default RightPanel;