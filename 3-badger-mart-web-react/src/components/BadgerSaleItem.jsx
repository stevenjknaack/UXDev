import { useState } from "react";
import { Card, Button } from "react-bootstrap";

export default function BadgerSaleItem(props) { // TODO look into only adding additon css with conditional

    const [numSelected, setNumSelected] = useState(0);

    return <Card style={props.featured ? {
                                            backgroundColor: "#c5050c", 
                                            color: "#F9E6E7",
                                            boxShadow: "0 .38rem .63rem 0 rgba(0, 0, 0, 0.4)", 
                                            borderTop: ".3rem solid #000",
                                            borderBottom: ".3rem solid #000",
                                            padding: "1rem",
                                            borderRadius: "1rem",
                                            height: "100%",
                                            justifyContent: "space-between"
                                        } : {
                                            padding: "1rem",
                                            borderRadius: "1rem",
                                            height: "100%",
                                            justifyContent: "space-between",
                                        }}>
        <div>                                
            <h2 style={{fontWeight: "bold", }}>{props.name}</h2>
            <p>{props.description}</p>
        </div>  
            <div> 
            <p>${props.price.toFixed(2)}</p> 
            <div>
                <Button 
                    className="inline" 
                    onClick={() => setNumSelected(prev => prev - 1)}
                    disabled={numSelected <= 0}
                    variant={props.featured ? "light" : "dark"}
                >-</Button>
                <p className="inline" style={{fontWeight: "bold"}}>{numSelected}</p>
                <Button 
                    className="inline" 
                    onClick={() => setNumSelected(prev => prev + 1)}
                    variant={props.featured ? "light" : "dark"}
                >+</Button>
            </div>
        </div> 
    </Card>
}