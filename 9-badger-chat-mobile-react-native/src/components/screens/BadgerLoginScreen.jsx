import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View, TextInput } from 'react-native';

function BadgerLoginScreen(props) {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleLoginClick() {
        if (!usernameInput.trim() || !passwordInput.trim()) {
            setErrorMessage('You must provide a username and password');
            return;
        }

        props.handleLogin(usernameInput, passwordInput).then((msg) => {
            if (msg === 'ok')
                Alert.alert('Success', 'You successfully logged in.');
            else setErrorMessage(msg);
        });
    }

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 36, marginBottom: 30 }}>
                BadgerChat Login
            </Text>
            <Text>Username</Text>
            <TextInput
                style={styles.input}
                value={usernameInput}
                onChangeText={setUsernameInput}
                autoCapitalize='none'
                autoComplete='username'
            />
            <Text>Password</Text>
            <TextInput
                style={styles.input}
                value={passwordInput}
                onChangeText={setPasswordInput}
                autoCapitalize='none'
                autoComplete='current-password'
                secureTextEntry={true}
            />
            {errorMessage ? (
                <Text style={{ color: 'crimson' }}>{errorMessage}</Text>
            ) : (
                <></>
            )}
            <Button color='darkred' title='Login' onPress={handleLoginClick} />
            <Text style={{ marginTop: 20 }}>New to BadgerChat?</Text>
            <View style={{ flexDirection: 'row' }}>
                <Button
                    color='grey'
                    title='Signup'
                    onPress={() => props.setIsRegistering(true)}
                />
                <Button
                    color='darkgrey'
                    title='Continue As Guest'
                    onPress={() => props.handleGuestIn()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        height: 40,
        width: 225,
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        marginTop: 5
    }
});

export default BadgerLoginScreen;
