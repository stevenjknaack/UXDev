import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CS571 from '@cs571/mobile-client';
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import { Alert } from 'react-native';
import LoggedInUserContext from '../contexts/LoggedInUserContext';
import BadgerLogoutScreen from '../components/screens/BadgerLogoutScreen';
import BadgerGuestSignupScreen from '../components/screens/BadgerGuestSignupScreen';

const ChatDrawer = createDrawerNavigator();

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [chatrooms, setChatrooms] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);

    function refreshChatrooms() {
        fetch('https://cs571.org/api/s24/hw9/chatrooms', {
            method: 'GET',
            headers: {
                'X-CS571-ID': CS571.getBadgerId()
            }
        })
            .then((response) => response.json())
            .then((data) => setChatrooms(data));
    }

    useEffect(refreshChatrooms, []);

    async function makeAuthCall(url, username, password) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CS571-ID': CS571.getBadgerId()
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return data.msg;
        }

        SecureStore.setItemAsync('jwt', data.token);
        setIsLoggedIn(true);
        setLoggedInUser(data.user);
        return 'ok';
    }

    async function handleLogin(username, password) {
        return await makeAuthCall(
            'https://cs571.org/api/s24/hw9/login',
            username,
            password
        );
    }

    async function handleSignup(username, password) {
        return await makeAuthCall(
            'https://cs571.org/api/s24/hw9/register',
            username,
            password
        );
    }

    function handleLogout() {
        SecureStore.deleteItemAsync('jwt');
        setLoggedInUser(null);
        setIsRegistering(false);
        setIsLoggedIn(false);
        Alert.alert('Success', 'You successfully logged out.');
    }

    function handleGuestIn() {
        setLoggedInUser('guest');
        Alert.alert('Success', 'You continued as a guest.');
    }

    function handleGuestOut() {
        setIsRegistering(true);
        setLoggedInUser(null);
    }

    if (isLoggedIn || loggedInUser === 'guest') {
        return (
            <LoggedInUserContext.Provider value={loggedInUser}>
                <NavigationContainer>
                    <ChatDrawer.Navigator
                        screenOptions={{
                            drawerActiveTintColor: 'darkred',
                            headerTintColor: 'darkred'
                        }}
                    >
                        <ChatDrawer.Screen
                            name='Landing'
                            component={BadgerLandingScreen}
                        />
                        {chatrooms.map((chatroom) => {
                            return (
                                <ChatDrawer.Screen
                                    key={chatroom}
                                    name={chatroom}
                                >
                                    {(props) => (
                                        <BadgerChatroomScreen name={chatroom} />
                                    )}
                                </ChatDrawer.Screen>
                            );
                        })}
                        {loggedInUser === 'guest' ? (
                            <ChatDrawer.Screen name='Signup'>
                                {(props) => (
                                    <BadgerGuestSignupScreen
                                        handleGuestOut={handleGuestOut}
                                    />
                                )}
                            </ChatDrawer.Screen>
                        ) : (
                            <ChatDrawer.Screen name='Logout'>
                                {(props) => (
                                    <BadgerLogoutScreen
                                        handleLogout={handleLogout}
                                    />
                                )}
                            </ChatDrawer.Screen>
                        )}
                    </ChatDrawer.Navigator>
                </NavigationContainer>
            </LoggedInUserContext.Provider>
        );
    } else if (isRegistering) {
        return (
            <BadgerRegisterScreen
                handleSignup={handleSignup}
                setIsRegistering={setIsRegistering}
            />
        );
    } else {
        return (
            <BadgerLoginScreen
                handleLogin={handleLogin}
                setIsRegistering={setIsRegistering}
                handleGuestIn={handleGuestIn}
            />
        );
    }
}
