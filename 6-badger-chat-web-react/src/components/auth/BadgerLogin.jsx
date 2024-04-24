import { React, useRef, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';
import { useNavigate } from 'react-router';

export default function BadgerLogin() {

    // TODO Create the login component.
    const usernameRef = useRef();
    const passwordRef = useRef();

    const [loginStatus, updateLoginStatus] = useContext(BadgerLoginStatusContext);

    const navigate = useNavigate();

    function handleLogin(e) {
        e?.preventDefault();

        if (usernameRef.current.value === "" || passwordRef.current.value === "") {
            alert("You must provide both a username and password!");
            return;
        }

        fetch("https://cs571.org/api/s24/hw6/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameRef.current.value,
                password: passwordRef.current.value
            })
        })
        .then(res => {
            if (res.status === 401) alert("Incorrect username or password!");
            else if (res.status === 200) {
                alert("Login successful!");
                res.json().then((data) => {
                    updateLoginStatus(data.user);
                    navigate("/");
                })
            }
        })
    }

    return <>
        <h1>Login</h1>
        <Form onSubmit={handleLogin}>
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control id="username" ref={usernameRef}/>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control id="password" type="password" ref={passwordRef}/>
            <br/>
            <Button type="submit" onClick={handleLogin}>Login</Button>
        </Form>
    </>
}
