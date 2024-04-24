import { useEffect, useState } from "react"
import BadgerSaleItem from "./BadgerSaleItem";
import { Col, Container, Row, Image, Stack } from "react-bootstrap";

export default function BadgerMart(props) {

    const [saleItems, setSaleItems] = useState([]);
    const [featuredItem, setFeaturedItem] = useState(null);

    useEffect(() => {
        fetch("https://cs571.org/api/s24/hw3/all-sale-items", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            // set saleItems
            setSaleItems(data);

            // set featuredItem
            setFeaturedItem(data.filter(item => item.featured)[0]);
        })
    }, [])

    return <div>
        <Stack 
            direction="horizontal"
            style={{
                // backgroundColor from https://www.wisc.edu/
                backgroundColor:"#c5050c",
                // tint of background color from https://maketintsandshades.com/#c5050c
                // color contrast test from https://coolors.co/contrast-checker/f9e6e7-c5050c
                color: "#F9E6E7",
                padding: "1rem",
                borderRadius: "1rem",
                borderTop: ".7rem solid #000",
                borderBottom: ".7rem solid #000",
                marginBottom: "1.5rem",  
                justifyContent: "space-evenly"     
        }}>
            {/* bucky image from https://www.pinclipart.com/downpngs/ibRwTxo_transparent-bucky-badger-clipart-wisconsin-badger-png-download/ */}
            <Image src="../../_figures/bucky.png" height="150px" width="93px" />
            <div>
                <h1 style={{fontWeight: "bold", textShadow: "-.31rem .31rem 0 #000" }}>Badger Mart</h1>
                <p style={{marginBottom: "2rem"}}>Welcome to our small-town mini mart located in Madison, WI!</p>
                <strong>{ !featuredItem ? "Loading..." :
                            `Today's featured item is ${featuredItem.name} for $${featuredItem.price}!`}</strong>
            </div>
            <Image src="../../_figures/bucky.png" height="150px" width="93px" />
        </Stack>
        <Container>
            <Row>
            {
                saleItems.map(saleItem => {
                    return <Col key={saleItem.name} xs={12} md={6} lg={4} xl={3} style={{marginBottom: "1.5rem"}}>
                        <BadgerSaleItem
                            name={saleItem.name}
                            description={saleItem.description}
                            price={saleItem.price}
                            featured={saleItem.featured}
                        />
                    </Col>
                })
            }
            </Row>
        </Container>
    </div>
}