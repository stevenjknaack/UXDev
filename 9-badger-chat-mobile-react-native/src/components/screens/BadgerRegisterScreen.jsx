import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View, TextInput } from 'react-native';

function BadgerRegisterScreen(props) {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleSignupClick() {
        if (!usernameInput.trim() || !passwordInput.trim()) {
            setErrorMessage('You must provide a username and password');
            return;
        }

        if (passwordInput !== confirmPasswordInput) {
            setErrorMessage('Your passwords do not match');
            return;
        }

        props.handleSignup(usernameInput, passwordInput).then((msg) => {
            if (msg === 'ok')
                Alert.alert('Success', 'You successfully logged in.');
            else setErrorMessage(msg);
        });
    }

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 36, marginBottom: 30 }}>
                Join BadgerChat!
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
                autoComplete='new-password'
                secureTextEntry={true}
            />
            <Text>Confirm Password</Text>
            <TextInput
                style={styles.input}
                value={confirmPasswordInput}
                onChangeText={setConfirmPasswordInput}
                autoCapitalize='none'
                autoComplete='new-password'
                secureTextEntry={true}
            />
            {errorMessage ? (
                <Text style={{ color: 'crimson' }}>{errorMessage}</Text>
            ) : (
                <></>
            )}
            <Button
                color='darkred'
                title='Signup'
                onPress={handleSignupClick}
            />
            <Text style={{ marginTop: 20 }}>Already have an account?</Text>
            <Button
                color='grey'
                title='Login'
                onPress={() => props.setIsRegistering(false)}
            />
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

export default BadgerRegisterScreen;
