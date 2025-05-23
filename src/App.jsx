import 'semantic-ui-css/semantic.min.css'
import {
    Button,
    Card,
    CardGroup,
    Grid,
    GridColumn,
    Header,
} from "semantic-ui-react";
import { GameProvider } from './GameContext';
import LeftPanel from "./components/LeftPanel.jsx";
import RightPanel from "./components/RightPanel.jsx";
import './App.css'

function App() {
    return (
        <GameProvider>
            <Header as='h1'>CardZee</Header>
            <Grid>
                <GridColumn width={10}><LeftPanel /></GridColumn>
                <GridColumn width={5}><RightPanel /></GridColumn>
            </Grid>
        </GameProvider>
    );
}  

export default App