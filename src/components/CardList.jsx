import {
    Segment,
    List,
    ListItem,
    Image,
} from "semantic-ui-react";
import useGameContext from "../GameContext";

function CardList({cards, clickFunction=undefined, componentSize="large"}) {
    const {
        deckID, setDeckID,
        drawsRemaining, setDrawsRemaining,
        cardsRemaining, setCardsRemaining,
        drawnCards, setDrawnCards,
        selectedCards, setSelectedCards,
        scoreData, updateScore, updateCards,
        newDeck, getDeckStatus, deleteDeck, drawCards,
    } = useGameContext();
    
    return (
        <Segment compact style={{ display: 'flex', justifyContent: 'center' }}>
            <List horizontal size={componentSize}>
                {cards.map((card, index) => (
                    <ListItem key={index}>
                        <Image height="150px"
                               alt={`Card: ${card.value} of ${card.suitName}`}
                               src={card.svgImage}
                               onClick={() => clickFunction(index)}/>
                    </ListItem>
                ))}
            </List>
        </Segment>
    );
}

export default CardList;