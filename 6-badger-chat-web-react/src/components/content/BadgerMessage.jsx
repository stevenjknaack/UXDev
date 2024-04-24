import React, { useContext } from "react"
import { Card, Button } from "react-bootstrap";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerMessage(props) {

    const dt = new Date(props.created);

    const [loginStatus, updateLoginStatus] = useContext(BadgerLoginStatusContext);

    function handleDelete() {
        fetch(`https://cs571.org/api/s24/hw6/messages?id=${props.id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => {
            if (res.status === 200) {
                alert("Successfully deleted the post!");
                props.reloadMessages();

            } else {
                alert("Error deleting post!")
            }
        })
    }

    return <Card style={{margin: "0.5rem", padding: "0.5rem"}}>
        <h2>{props.title}</h2>
        <sub style={{marginBottom:"1rem"}}>Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</sub>
        <br/>
        <i>{props.poster}</i>
        <p>{props.content}</p>
        {
            loginStatus?.username === props.poster ?
                <Button variant="danger" onClick={handleDelete}>Delete Post</Button>
            :
                <></>
        }
    </Card>
}

export default BadgerMessage;