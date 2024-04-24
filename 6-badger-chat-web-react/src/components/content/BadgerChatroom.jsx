import React, { useContext, useEffect, useRef, useState } from "react"
import BadgerMessage from "./BadgerMessage";
import { Container, Row, Col, Pagination, Form, Button} from "react-bootstrap";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const postTitleRef = useRef();
    const postContentRef = useRef();

    const numPages = 4;

    const [loginStatus, updateLoginStatus] = useContext(BadgerLoginStatusContext);


    const loadMessages = () => {
        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}&page=${currPage}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            console.log(json)
            setMessages(json.messages)
        })
    };

    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(() => {
        setCurrPage(1);
        if (currPage === 1) loadMessages();
    }, [props]);

    useEffect(loadMessages, [currPage]);

    function handleCreatePost(e) {
        e?.preventDefault();

        if (postTitleRef.current.value === "" || postContentRef.current.value === "") {
            alert("You must provide both a title and content!");
            return;
        }

        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: postTitleRef.current.value,
                content: postContentRef.current.value
            })
        })
        .then(res => {
            if (res.status === 200) {
                alert("Successfully posted!");
                loadMessages();
            } else {
                alert("Error occured while posting :(")
            }
        })
    }

    function buildPagination() {
        const pageItems = [];
        for (let i = 1; i <= numPages; i++) {
            pageItems.push(<Pagination.Item 
                    key={i}
                    active={currPage === i} 
                    onClick={() => { setCurrPage(i) }}
                    >{i}</Pagination.Item>);
        }
        return pageItems;
    }

    return <>
        <h1>{props.name} Chatroom</h1>
        <hr/>
        <Container fluid>
            <Row>
                <Col xs={12} md={4}>
                    {
                        loginStatus ?
                            <Form onSubmit={handleCreatePost}>
                                <Form.Label htmlFor="postTitle">Post Title</Form.Label>
                                <Form.Control id="postTitle" ref={postTitleRef}/>
                                <Form.Label htmlFor="postContent">Post Content</Form.Label>
                                <Form.Control id="postContent" ref={postContentRef}/>
                                <br/>
                                <Button type="submit" onClick={handleCreatePost}>Create Post</Button>
                            </Form>
                        :
                            <p>You must be logged in to post!</p>
                    }
                    <br/>
                </Col>
                <Col xs={12} md={8}>
                    {
                        messages.length > 0 ?
                            <>
                                {
                                    <Container fluid>
                                        <Row>
                                            {/* /* TODO: Complete displaying of messages. */ }
                                            {
                                                messages.map(msg => 
                                                    <Col 
                                                        key={msg.id} 
                                                        xs={12}
                                                        lg={6}
                                                        xxl={4}
                                                    >
                                                        <BadgerMessage {...msg} reloadMessages={loadMessages}/>
                                                    </Col>)
                                            }
                                        </Row>
                                    </Container>
                                }
                            </>
                            :
                            <>
                                <p>There are no messages on this page yet!</p>
                            </>
                    }
                    <br/>
                    <Pagination>
                      { buildPagination() }
                    </Pagination>
                </Col>
            </Row>
        </Container>
        
    </>
}
