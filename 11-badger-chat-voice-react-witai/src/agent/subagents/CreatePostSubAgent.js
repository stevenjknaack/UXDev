import { happyResponse, isLoggedIn, ofRandom, sadResponse } from '../Util';

const createPostSubAgent = (end) => {
    const CS571_WITAI_ACCESS_TOKEN = 'SGEIULZVYZLM5HOETSDVXIQ4QCWQAB6C';
    let stage;
    let chatroom;
    let title;
    let content;

    const titleStage = async (titleInput) => {
        stage = 'CONTENT';
        title = titleInput;
        return ofRandom([
            'And what about the content?',
            'What would you like the content to be?',
            'Tell me what your message says'
        ]);
    };

    const contentStage = async (contentInput) => {
        stage = 'CONFIRMATION';
        content = contentInput;
        return ofRandom([
            `Are you sure you want to create a post titled \
                '${title}' in ${chatroom}?`,
            `Just to clear, a message with title '${title}' \
            should be added to '${chatroom}?'`,
            `Ready to post message '${title}' to '${chatroom}'?`
        ]);
    };

    const confirmationStage = async (confirmationInput) => {
        stage = undefined;

        const confirmationResp = await fetch(
            `https://api.wit.ai/message?q=${encodeURIComponent(
                confirmationInput
            )}`,
            {
                headers: {
                    Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
                }
            }
        );
        const confirmData = await confirmationResp.json();

        if (
            confirmData?.intents.length === 0 ||
            confirmData.intents[0].name !== 'wit$confirmation'
        )
            return ofRandom([
                'Okay, your post was scrapped :)',
                'Message successfuly destroyed!',
                'Post creation canceled!'
            ]);

        const response = await fetch(
            `https://cs571.org/api/s24/hw11/messages?chatroom=${chatroom}`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CS571-ID': CS571.getBadgerId(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            }
        );

        const data = await response.json();
        if (!response.ok)
            return sadResponse(
                ofRandom([
                    `Oh no! ${data.msg}`,
                    `${data.msg}. Oh well!`,
                    `Unfortunatley, ${data.msg.toLowerCase()}`
                ])
            );

        return happyResponse(
            ofRandom([
                `All set! Your post has been made in ${chatroom}!`,
                `Your message has been posted to ${chatroom}!`,
                `Success! Checkout ${chatroom} to see your new post!`
            ])
        );
    };

    const handleInitialize = async (promptData) => {
        if (!(await isLoggedIn()))
            return end(
                sadResponse(
                    ofRandom([
                        'Please log in if you want to create a post',
                        'Buddy, you need to log in for that!',
                        'Try again after you are signed in!'
                    ])
                )
            );

        const crEnt = promptData.entities['chatroom:chatroom'];
        if (!crEnt)
            return end(
                sadResponse(
                    ofRandom([
                        'You must specify a chatroom when you ask to create a post!',
                        "I can't do that without a chatroom name!",
                        'Please ask me again but with specific chatroom!'
                    ])
                )
            );
        chatroom = crEnt[0].value;

        stage = 'TITLE';
        return ofRandom([
            'What title do you want?',
            'What shall we call this message?',
            'Tell me the title of the post you want to create!'
        ]);
    };

    const handleReceive = async (prompt) => {
        switch (stage) {
            case 'TITLE':
                return await titleStage(prompt);
            case 'CONTENT':
                return await contentStage(prompt);
            case 'CONFIRMATION':
                return end(await confirmationStage(prompt));
        }
        return end(
            sadResponse(
                ofRandom([
                    'Unfortunately, an error has occured.',
                    'Something is wrong; post creation canceled!',
                    "I ran into an error somehow, let's scrap this message"
                ])
            )
        );
    };

    return {
        handleInitialize,
        handleReceive
    };
};

export default createPostSubAgent;
