import { Container, Row, Col } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext";
import BadgerBudSummary from "./BadgerBudSummary";

export default function BadgerBudsBasket(props) {
    const buds = useContext(BadgerBudsDataContext);

    const savedCatsIdsStr = sessionStorage.getItem("savedCatIds") ?? "[]";
    const [savedCatsIds, setSavedCatsIds] = useState(JSON.parse(savedCatsIdsStr));

    const adoptedCatsIdsStr = sessionStorage.getItem("adoptedCatsIds") ?? "[]";
    const [adoptedCatsIds, setAdoptedCatsIds] = useState(JSON.parse(adoptedCatsIdsStr));
    
    const applySavedCatsIds = () => {
        setSavedCatsIds(JSON.parse(sessionStorage.getItem("savedCatIds") ?? "[]"));
    }

    const applyAdoptedCatsIds = () => {
        setAdoptedCatsIds(JSON.parse(sessionStorage.getItem("adoptedCatsIds") ?? "[]"))
    }

    return <div>
        <h1>Badger Buds Basket</h1>
        <p>These cute cats could be all yours!</p>
        { savedCatsIds.length === 0 ? <p>You have no buds in your basket!</p> : <></> }
        <Container>
            <Row>
                {
                    buds
                    .filter(bud => savedCatsIds.includes(bud.id))
                    .filter(bud => !adoptedCatsIds.includes(bud.id))
                    .map(bud => 
                        <Col 
                            key={bud.id}
                            xs={12}
                            md={6}
                            lg={3}
                            style={{marginBottom:"1rem"}}
                        >
                            <BadgerBudSummary 
                                {...bud} 
                                applySaved={applySavedCatsIds} 
                                applyAdopted={applyAdoptedCatsIds}
                            />
                        </Col>)
                }
            </Row>
        </Container>
    </div>
}