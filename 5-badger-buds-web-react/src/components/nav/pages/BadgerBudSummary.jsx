import { Card, Button, Stack, Collapse, Carousel } from "react-bootstrap";
import { useState } from "react";

export default function BadgerBudSummary(props) {
    const [collapsed, setCollapsed] = useState(true);

    const savedCatsIdsStr = sessionStorage.getItem("savedCatIds") ?? "[]";
    const savedCatsIds = JSON.parse(savedCatsIdsStr);
    const saved = savedCatsIds.includes(props.id);

    function saveCat() {
        alert(`${props.name} has been added to your basket!`)

        const savedCatsIdsStr = sessionStorage.getItem("savedCatIds") ?? "[]";
        const savedCatsIds = JSON.parse(savedCatsIdsStr);

        savedCatsIds.push(props.id);
        sessionStorage.setItem("savedCatIds", JSON.stringify(savedCatsIds));

        props.applySaved()

        //console.log(savedCatsIds);
    }

    function removeCat() {
        alert(`${props.name} has been removed from your basket!`)

        const savedCatsIdsStr = sessionStorage.getItem("savedCatIds") ?? "[]";
        const savedCatsIds = JSON.parse(savedCatsIdsStr);
        
        const newSavedCatsIds = savedCatsIds.filter(budId => budId !== props.id);
        sessionStorage.setItem("savedCatIds", JSON.stringify(newSavedCatsIds));

        props.applySaved()

        //console.log(newSavedCatsIds);
    }

    function adoptCat() {
        alert(`${props.name} has been adopted!`)

        const adoptedCatsIdsStr = sessionStorage.getItem("adoptedCatsIds") ?? "[]";
        const adoptedCatsIds = JSON.parse(adoptedCatsIdsStr);

        adoptedCatsIds.push(props.id);
        sessionStorage.setItem("adoptedCatsIds", JSON.stringify(adoptedCatsIds));

        props.applyAdopted();

        const savedCatsIdsStr = sessionStorage.getItem("savedCatIds") ?? "[]";
        const savedCatsIds = JSON.parse(savedCatsIdsStr);
        
        const newSavedCatsIds = savedCatsIds.filter(budId => budId !== props.id);
        sessionStorage.setItem("savedCatIds", JSON.stringify(newSavedCatsIds));

        props.applySaved()
    }

    function buildCarousel() {
        const carouselItems = props.imgIds.map(id => 
            <Carousel.Item key={id}>
                <Card.Img 
                    variant="top"
                    src={`https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${id}`}
                    alt={`A picture of ${props.name}`} 
                    style={{aspectRatio:"1/1"}}
                />
            </Carousel.Item>
        );

        return carouselItems;
    }

    return <Card>
        { 
            collapsed ?
            <Card.Img 
                variant="top"
                src={`https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${props.imgIds[0]}`}
                alt={`A picture of ${props.name}`} 
                style={{aspectRatio:"1/1"}}
            /> :
            <Carousel>
                { buildCarousel() }
            </Carousel>
        }
        <Card.Body>
            <Card.Title style={{fontSize:"1.7rem", fontWeight:"600"}}>{props.name}</Card.Title>
            { 
                saved ? <></> :
                <Collapse in={!collapsed}>
                    <div>
                        <Card.Subtitle style={{marginBottom:"1rem"}}>{props.gender}</Card.Subtitle>
                        <Card.Text style={{marginBottom:"1rem"}}>{props.breed}</Card.Text>
                        <Card.Text style={{marginBottom:"1rem"}}>{props.age}</Card.Text>
                        { props.description ?? <Card.Text>{props.description}</Card.Text>}
                    </div>
                </Collapse>
            }
        </Card.Body>
        <Card.Footer>
            <Stack 
                gap="2"
                direction="horizontal"  
            >
                { 
                    saved ?
                    <>
                        <Button variant="secondary" onClick={removeCat}>Unselect</Button>
                        <Button 
                            variant="success" 
                            onClick={adoptCat}
                        >💞 Adopt</Button>
                    </> :
                    <>
                        <Button 
                            variant="primary" 
                            onClick={() => {setCollapsed(curr => !curr)}}
                        >Show {collapsed ? "More" : "Less"}</Button>
                        <Button variant="secondary" onClick={saveCat}>❤️ Save</Button>
                    </>
                }      
            </Stack>
        </Card.Footer>  
    </Card>
}