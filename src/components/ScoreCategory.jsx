import {
    Divider,
    Grid,
    GridColumn,
    GridRow,
    Button,
    Header,
} from "semantic-ui-react";

function ScoreCategory({ title, description, score, cards }) {
    return (
        <>
            <Grid padded>
                <GridRow color="blue">
                    <GridColumn width={12} textAlign="left">
                        <Header as="h2" inverted>{title}</Header>
                        <i>{description}</i>
                    </GridColumn>
                    <GridColumn width={4} textAlign="center">
                        <Button inverted floated="right" size="mini">Record Score</Button>
                        <Header as="h1" inverted>{score}</Header>
                    </GridColumn>
                </GridRow>
                <GridRow color="blue">
                    <GridColumn width={16}></GridColumn>
                </GridRow>
            </Grid>
            <Divider fitted></Divider>
        </>
    );
}

export default ScoreCategory;