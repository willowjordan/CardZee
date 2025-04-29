function CardList({ cards }) {
    return (
        <div className="ui compact center aligned segment"><div role="list" className="ui large horizontal list">
            {cards.map((card, index) => (
                <div key={index} role="listitem" className="item"><div className="image">
                    <img height="150px" alt={`Card: ${card.alt}`} src={card.src} />
                </div></div>
            ))}
        </div></div>
    );
}

export default CardList;