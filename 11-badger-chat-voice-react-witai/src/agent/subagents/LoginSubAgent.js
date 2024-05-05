import {
    happyResponse,
    isLoggedIn,
    ofRandom,
    sadResponse,
    sensitivePrompt
} from '../Util';

const createLoginSubAgent = (end) => {
    let stage;
    let username;

    const usernameStage = async (usernameInput) => {
        username = usernameInput;
        stage = 'PASSWORD';
        return sensitivePrompt(
            ofRandom([
                'Please enter your password',
                "What's your password?",
                `Okay ${username}, can you tell me your password?`
            ])
        );
    };

    const passwordStage = async (passwordInput) => {
        stage = undefined;
        const response = await fetch('https://cs571.org/api/s24/hw11/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: passwordInput
            })
        });
        const data = await response.json();
        if (!response.ok)
            return sadResponse(
                ofRandom([
                    `I'm sorry! ${data.msg}.`,
                    `${data.msg}. Login canceled!`,
                    `Something weird happened! ${data.msg}`
                ])
            );
        return happyResponse(
            ofRandom([
                `Login successful! Welcome, ${data.user.username}.`,
                `Success! Great to see you again, ${data.user.username}`,
                `You are now logged in, ${data.user.username}!`
            ])
        );
    };

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn())
            return end(
                sadResponse(
                    ofRandom([
                        'You are already logged in! Please log out if \
                        you would like to log in with a different account.',
                        'Sorry, but your account is already signed in!',
                        'Well my job is easy, because you are already signed in!'
                    ])
                )
            );
        stage = 'USERNAME';
        return ofRandom([
            'Please enter your username',
            'Can you tell me your username?',
            "What's your username?"
        ]);
    };

    const handleReceive = async (prompt) => {
        switch (stage) {
            case 'USERNAME':
                return await usernameStage(prompt);
            case 'PASSWORD':
                return end(await passwordStage(prompt));
        }
        return end(
            sadResponse(
                ofRandom([
                    'Sorry, there was an error',
                    'I was unable to log you in!',
                    'Something is wrong, login canceled!'
                ])
            )
        );
    };

    return {
        handleInitialize,
        handleReceive
    };
};

export default createLoginSubAgent;
