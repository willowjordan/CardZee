// utils/categoryFuncs.jsx
// functions for checking whether a group of cards fits a category and adding up scores
// each check function returns true or false
// the score function returns the total score
// each function assumes "cards" is a sorted array of 5 json card objects

export function checkFourOfAKind(cards) {
    // cards are of form A-A-A-A-B or B-A-A-A-A
    // middle 3 must be a triplet
    if (cards[1].intValue != cards[2].intValue)
        return false;
    if (cards[2].intValue != cards[3].intValue)
        return false;

    if (cards[0].intValue == cards[1].intValue)
        return true;
    if (cards[3].intValue == cards[4].intValue)
        return true;
    return false;
}

export function checkThreeOfAKind(cards) {
    for (let i = 0; i < cards.length - 2; i++)
    {
        if (cards[i].intValue == cards[i+1].intValue && 
            cards[i].intValue == cards[i+2].intValue)
        {
            return true;
        }
    }
    return false;
}

export function checkFullHouse(cards) {
    // cards are of form A-A-A-B-B or A-A-B-B-B
    // first two and and last two must be pairs
    if (cards[0].intValue != cards[1].intValue)
        return false;
    if (cards[3].intValue != cards[4].intValue)
        return false;

    if (cards[1].intValue == cards[2].intValue)
        return true; // A-A-A-B-B
    if (cards[2].intValue == cards[3].intValue)
        return true; // A-A-B-B-B
    return false;
}

export function checkTwoPair(cards) {
    let pairs = 0;
    for (let i = 0; i < cards.length - 1; i++)
    {
        console.log(i);
        if (cards[i].intValue === cards[i+1].intValue)
        {
            pairs++;
            i++; // skip next card since it's part of this pair
        }
    }
    console.log("Pairs: " + pairs)
    return pairs == 2;
}

export function checkFlush(cards) {
    let suit = cards[0].suitName;
    for (let i = 1; i < cards.length; i++)
    {
        if (cards[i].suitName !== suit)
            return false;
    }
    return true;
}

export function sumCards(cards) {
    let sum = 0;
    for (const card of cards) {
        sum += card.intValue
    }
    return sum;
}