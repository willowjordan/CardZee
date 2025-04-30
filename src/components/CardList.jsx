import {
    Segment,
} from "semantic-ui-react";

function CardList({ cards }) {
    return (
        <Segment>
            <List>
                {cards.map((card, index) => (
                    <ListItem>
                        <Image height="150px" alt={`Card: ${card.alt}`} src={card.src}/>
                    </ListItem>
                ))}
            </List>
        </Segment>
    );
}

export default CardList;