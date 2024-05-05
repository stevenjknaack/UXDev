import createChatDelegator from './ChatDelegator';
import {
    getLoggedInUsername,
    happyResponse,
    isLoggedIn,
    logout,
    ofRandom,
    sadResponse
} from './Util';

const createChatAgent = () => {
    const CS571_WITAI_ACCESS_TOKEN = 'SGEIULZVYZLM5HOETSDVXIQ4QCWQAB6C';

    const delegator = createChatDelegator();

    let chatrooms = [];

    const handleInitialize = async () => {
        const resp = await fetch('https://cs571.org/api/s24/hw11/chatrooms', {
            headers: {
                'X-CS571-ID': CS571.getBadgerId()
            }
        });
        chatrooms = await resp.json();

        return ofRandom([
            'Hello, this is BadgerChat, Please let me know how I can help you today!',
            'Welcome to BadgerChat! My name is Bucki, how can I help you?',
            'BadgerChat here, how may I assist you?'
        ]);
    };

    const handleReceive = async (prompt) => {
        if (delegator.hasDelegate()) {
            return delegator.handleDelegation(prompt);
        }
        const resp = await fetch(
            `https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`,
            {
                headers: {
                    Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
                }
            }
        );
        const data = await resp.json();
        if (data.intents.length > 0) {
            switch (data.intents[0].name) {
                case 'get_help':
                    return handleGetHelp();
                case 'get_chatrooms':
                    return handleGetChatrooms();
                case 'get_messages':
                    return handleGetMessages(data);
                case 'login':
                    return handleLogin();
                case 'register':
                    return handleRegister();
                case 'create_message':
                    return handleCreateMessage(data);
                case 'logout':
                    return handleLogout();
                case 'whoami':
                    return handleWhoAmI();
            }
        }
        return ofRandom([
            "Sorry, I didn't get that. Type 'help' to see what you can do!",
            "I'm not sure I understand! Ask for 'help' to see your options.",
            "Unfortunately, I don't know how to do that. Just say the word 'help'\
            and I can assist you in finding what you need!"
        ]);
    };

    const handleTranscription = async (rawSound, contentType) => {
        const resp = await fetch(`https://api.wit.ai/dictation`, {
            method: 'POST',
            headers: {
                'Content-Type': contentType,
                Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            },
            body: rawSound
        });
        const data = await resp.text();
        const transcription = data
            .split(/\r?\n{/g)
            .map((t, i) => (i === 0 ? t : `{${t}`)) // Turn the response text into nice JS objects
            .map((s) => JSON.parse(s))
            .filter((chunk) => chunk.is_final) // Only keep the final transcriptions
            .map((chunk) => chunk.text)
            .join(' '); // And conjoin them!
        return transcription;
    };

    const handleSynthesis = async (txt) => {
        if (txt.length > 280) {
            return undefined;
        } else {
            const resp = await fetch(`https://api.wit.ai/synthesize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'audio/wav',
                    Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    q: txt,
                    voice: 'Rebecca',
                    style: 'soft'
                })
            });
            const audioBlob = await resp.blob();
            return URL.createObjectURL(audioBlob);
        }
    };

    const handleGetHelp = async () => {
        return ofRandom([
            "Try asking 'give me a list of chatrooms', or ask for more help!",
            "Try asking 'register for an account', or ask for more help!",
            'You may ask to login, register, logout, see messages from a \
            particular chatroom, add a message to a chatroom, or see who is logged in!',
            "Maybe you could say something like 'show me the latest message', or seek more help."
        ]);
    };

    const handleGetChatrooms = async () => {
        let str = '';
        chatrooms.forEach(
            (cr, i) => (str += cr + (i === chatrooms.length - 1 ? '' : ', '))
        );
        return ofRandom([
            `Of course, there are ${chatrooms.length} chatrooms:\n${str}`,
            `With ${chatrooms.length} chatrooms in total, their names are:\n${str}`,
            `Here are the ${chatrooms.length} chatrooms:\n${str}`
        ]);
    };

    const handleGetMessages = async (data) => {
        const crEnt = data.entities['chatroom:chatroom'];

        let numEnt = data.entities['wit$number:number'];
        if (!numEnt) numEnt = 1;
        else {
            numEnt = Math.floor(numEnt[0].value);
            if (numEnt < 1) numEnt = 1;
        }

        const res = await fetch(
            `https://cs571.org/api/s24/hw11//messages?${
                crEnt ? `chatroom=${crEnt[0].value}` : ''
            }&num=${numEnt}`,
            {
                headers: {
                    'X-CS571-ID': CS571.getBadgerId()
                }
            }
        );

        if (!res.ok)
            return ofRandom([
                'There was a problem getting the messages :(',
                'The messages managed to evade my grasp! Please try again later.',
                "Sad to say, but I couldn't get the messages!"
            ]);

        const dt = await res.json();

        return dt.messages.map((m) =>
            ofRandom([
                `In ${m.chatroom}, ${m.poster} said '${m.content}' with title '${m.title}'`,
                `${m.poster} has a post titled '${m.title}' that says '${m.content}' in ${m.chatroom}`,
                `Titled '${m.title}', this post by ${m.poster} in ${m.chatroom} says '${m.content}'`
            ])
        );
    };

    const handleLogin = async () => {
        return await delegator.beginDelegation('LOGIN');
    };

    const handleRegister = async () => {
        return await delegator.beginDelegation('REGISTER');
    };

    const handleCreateMessage = async (data) => {
        return await delegator.beginDelegation('CREATE', data);
    };

    const handleLogout = async () => {
        if (!(await isLoggedIn()))
            return sadResponse(
                ofRandom([
                    'You are not logged in!',
                    'You have to be logged in to log out!',
                    "Nice try, but you're not even logged in!"
                ])
            );
        await logout();
        return happyResponse(
            ofRandom([
                'You have been successfully logged out!',
                'Your account has been logged out!',
                'Logout successful! See you next time!'
            ])
        );
    };

    const handleWhoAmI = async () => {
        const currUser = await getLoggedInUsername();
        if (!currUser)
            return sadResponse(
                ofRandom([
                    'You are not logged in!',
                    'You have to be logged in to to do that!',
                    "Nice try, but you're not even logged in!",
                    "You're nobody"
                ])
            );
        return ofRandom([
            `You are currently logged in as ${currUser}`,
            `You're name is ${currUser}, and you're great!`,
            `Haha funny joke, ${currUser}. You're so funny!`
        ]);
    };

    return {
        handleInitialize,
        handleReceive,
        handleTranscription,
        handleSynthesis
    };
};

export default createChatAgent;
