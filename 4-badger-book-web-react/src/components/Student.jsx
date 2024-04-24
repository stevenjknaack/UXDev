import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

const Student = (props) => { // #5 // TODO capitalize first letters of names
    return <div>
        <h2>{props.name.first} {props.name.last}</h2>
        <p><strong>{props.major}</strong></p>
        <p>
            {props.name.first} is taking {props.numCredits} credits 
            and is {props.fromWisconsin ? '' : 'NOT'} from Wisconsin.
        </p>
        <p>They have {props.interests.length} interests including...</p>
        <ul>
            {
                props.interests.map(intr =>
                    <li key={intr}>{intr}</li>)
            }
        </ul>
    </div>
}

export default Student;