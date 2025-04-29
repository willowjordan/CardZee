import { useState, useEffect } from 'react'
import 'semantic-ui-css/semantic.min.css'
import {
    Button,
    Card,
    CardGroup,
    Grid,
    GridColumn,
    GridRow,
    Header,
    Segment,
} from "semantic-ui-react";
import LeftPanel from "./components/LeftPanel.jsx";
import RightPanel from "./components/RightPanel.jsx";
import './App.css'

function App() {
    function checkLocalStorage(key, defaultValue) {
        if (localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key));
        } 
        return defaultValue;
    }

    // State Variables.
    const [deckID, setDeckID] = useState( checkLocalStorage("cardsApiDeckID","") );
    const [cardsRemaining, setCardsRemaining] = useState( undefined );
    const [cards, setCards] = useState( checkLocalStorage("cardsApiCards",[]) );
    const [enteredDeckValue, setEnteredDeckValue] = useState("enter deck id");

    return (
        <>
            <Header as='h1'>CardZee</Header>
            <Grid>
                <GridColumn width={10}><LeftPanel /></GridColumn>
                <GridColumn width={5}><RightPanel /></GridColumn>
            </Grid>
        </>
    );
}  

export default App