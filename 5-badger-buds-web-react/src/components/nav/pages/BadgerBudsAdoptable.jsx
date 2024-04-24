import { Container, Row, Col } from "react-bootstrap";
import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext"
import BadgerBudSummary from "./BadgerBudSummary";
import { useContext, useState } from "react";

export default function BadgerBudsAdoptable(props) {
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
        <h1>Available Badger Buds</h1>
        <p>The following cats are looking for a loving home! Could you help?</p>
        {
            buds.length - savedCatsIds.length - adoptedCatsIds.length === 0 ? 
                <p>No buds are available for adoption!</p> : <></>
        }
        <Container>
            <Row>
                {
                    buds
                    .filter(bud => !savedCatsIds.includes(bud.id))
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