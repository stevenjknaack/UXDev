import {
    happyResponse,
    isLoggedIn,
    ofRandom,
    sadResponse,
    sensitivePrompt
} from '../Util';

const createRegisterSubAgent = (end) => {
    let stage;
    let username;
    let password;

    const usernameStage = async (usernameInput) => {
        username = usernameInput;
        stage = 'PASSWORD';
        return sensitivePrompt(
            ofRandom([
                'Please enter a password',
                "What's a password you like?",
                'Tell me the password you want'
            ])
        );
    };

    const passwordStage = async (passwordInput) => {
        password = passwordInput;
        stage = 'CONFIRM_PASSWORD';
        return sensitivePrompt(
            ofRandom([
                'Please confirm the password',
                'Repeat the password for the confirmation',
                'To be sure, type the password one more time'
            ])
        );
    };

    const confirmPasswordStage = async (confirmPasswordInput) => {
        stage = undefined;

        if (password !== confirmPasswordInput)
            return sadResponse(
                ofRandom([
                    "Your passwords don't match!",
                    "The passwords you entered don't match; registration cancelled!",
                    "Unfortunately, the passwords don't match. Your account was not created"
                ])
            );

        const response = await fetch(
            'https://cs571.org/api/s24/hw11/register',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CS571-ID': CS571.getBadgerId(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();
        if (!response.ok)
            return sadResponse(
                ofRandom([
                    `I'm sorry! ${data.msg}`,
                    `What's that? Oh, ${data.msg.toLowerCase()}`,
                    `Is this a joke? ${data.msg}`
                ])
            );

        return happyResponse(
            ofRandom([
                `Registration successful! Welcome ${data.user.username}.`
            ])
        );
    };

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn())
            return end(
                sadResponse(
                    ofRandom([
                        'You are already logged in! Please log out if \
                    you would like to register for a different account.',
                        "Unfortunately, you can't do this with an account logged in.",
                        'Please come back when you are logged out!'
                    ])
                )
            );
        stage = 'USERNAME';
        return ofRandom([
            'Please enter a username',
            'What username do you want?',
            'Tell me a username that sounds good to you'
        ]);
    };

    const handleReceive = async (prompt) => {
        switch (stage) {
            case 'USERNAME':
                return await usernameStage(prompt);
            case 'PASSWORD':
                return await passwordStage(prompt);
            case 'CONFIRM_PASSWORD':
                return end(await confirmPasswordStage(prompt));
        }
        return end(
            sadResponse(
                ofRandom([
                    'Sorry, there was an error',
                    'I have a bad feeling about this. This registration is cancelled',
                    "This shouldn't even be possible, but there was an error!"
                ])
            )
        );
    };

    return {
        handleInitialize,
        handleReceive
    };
};

export default createRegisterSubAgent;
