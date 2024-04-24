import { React, useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';
import { useNavigate } from 'react-router';

export default function BadgerRegister() {

    // TODO Create the register component.
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loginStatus, updateLoginStatus] = useContext(BadgerLoginStatusContext);

    const navigate = useNavigate();

    function handleRegister(e) {
        e?.preventDefault();

        if (username === "" || password === "") {
            alert("You must provide both a username and password!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Your passwords do not match!");
            return;
        }

        fetch("https://cs571.org/api/s24/hw6/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => {
            if (res.status === 409) alert("That username has already been taken!");
            else if (res.status === 200) {
                alert("Registration successful!");
                res.json().then(data => {
                    //console.log(data.user);
                    updateLoginStatus(data.user);
                    navigate("/");
                })
            }
        })
    }

    return <>
        <h1>Register</h1>
        <Form onSubmit={handleRegister}>
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.currentTarget.value)}
            />
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control 
                id="password" 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
            <Form.Control 
                id="confirmPassword" 
                type="password"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            />
            <br/>
            <Button type="submit" onClick={handleRegister}>Register</Button>
        </Form>
    </>
}
