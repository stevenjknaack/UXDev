const createChatAgent = () => {
    // Put your CLIENT access token here.
    const CS571_WITAI_ACCESS_TOKEN = 'TZO4MQTVJHE3RDNAS34ZAT2CLIWOR5N7';

    let availableItems = [];
    let cart = {};

    const initCart = async (items) => {
        cart = {};
        items.forEach(
            (item) =>
                (cart[item.name] = {
                    name: item.name,
                    price: item.price,
                    num: 0
                })
        );
    };

    const refreshAvailableItems = async () => {
        const response = await fetch('https://cs571.org/api/s24/hw10/items', {
            method: 'GET',
            headers: { 'X-CS571-ID': CS571.getBadgerId() }
        });

        availableItems = await response.json();
        initCart(availableItems);
    };

    const queryAgent = async (query) => {
        const response = await fetch(
            `https://api.wit.ai/message?v=20240420&q=\
            ${encodeURIComponent(query)}`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}` }
            }
        );

        return await response.json();
    };

    const getHelp = () => {
        return 'You may ask for the list of available items, \
                the price of an item, add or remove an item from \
                your cart, and checkout!';
    };

    const getItems = () => {
        let itemsString = '';
        availableItems.forEach((item, i) => {
            if (i === availableItems.length - 1) itemsString += ' and';

            itemsString += ` ${item.name.toLowerCase()}s,`;
        });

        return `Today, we have ${itemsString.substring(
            0,
            itemsString.length - 1
        )} available for purchase!`;
    };

    const getItemFromEntities = (entities) => {
        if (
            !entities['item_name:item_name'] ||
            entities['item_name:item_name'].length === 0
        )
            return [
                false,
                "I'm sorry, I don't think you told me \
                    which item!"
            ];

        const itemName = entities['item_name:item_name'][0].value;

        if (!itemName)
            return [
                false,
                "I'm sorry, I don't think you told me an item's name."
            ];

        const item = availableItems.find(
            (item) =>
                item.name.trim().toLowerCase() === itemName.trim().toLowerCase()
        );

        if (!item)
            return [false, `Unfortunately, ${itemName}s are not in stock.`];

        return [true, item];
    };

    const getPrice = (entities) => {
        const [itemRetrieved, response] = getItemFromEntities(entities);

        if (!itemRetrieved) return response;

        return `${response.name}s cost $${response.price.toFixed(2)} each.`;
    };

    const getNumberFromEntities = (entities) => {
        if (
            !entities['wit$number:number'] ||
            entities['wit$number:number'].length === 0
        )
            return [true, 1];

        const number = entities['wit$number:number'][0].value;

        const roundedNum = Math.floor(number);
        if (roundedNum <= 0)
            return [
                false,
                'Sorry, please specify only positive, integer quantities.'
            ];

        return [true, roundedNum];
    };

    const addItem = (entities) => {
        const [itemRetrieved, itemResponse] = getItemFromEntities(entities);
        if (!itemRetrieved) return itemResponse;

        const [numberRetrieved, numResponse] = getNumberFromEntities(entities);
        if (!numberRetrieved) return numResponse;

        cart[itemResponse.name].num += numResponse;
        console.log(cart);

        return `Of course, ${numResponse} ${itemResponse.name.toLowerCase()}${
            numResponse > 1 ? 's have' : ' has'
        } been added to your cart.`;
    };

    const removeItem = (entities) => {
        const [itemRetrieved, itemResponse] = getItemFromEntities(entities);
        if (!itemRetrieved) return itemResponse;

        const [numberRetrieved, numResponse] = getNumberFromEntities(entities);
        if (!numberRetrieved) return numResponse;

        let numRemoved = numResponse;
        if (cart[itemResponse.name].num < numResponse) {
            numRemoved = cart[itemResponse.name].num;
            cart[itemResponse.name].num = 0;
        } else {
            cart[itemResponse.name].num -= numResponse;
        }
        console.log(cart);

        return `${numRemoved || 'No'} ${itemResponse.name.toLowerCase()}${
            numResponse > 1 ? 's have' : ' has'
        } been removed from your cart.`;
    };

    const viewCart = () => {
        let cartSummary = '';
        let total = 0;
        let numItems = 0;
        const cartItems = Object.values(cart).filter((item) => item.num > 0);
        cartItems.forEach((item, index) => {
            numItems++;
            if (numItems > 1 && index === cartItems.length - 1) {
                if (numItems === 2)
                    cartSummary = cartSummary.substring(
                        0,
                        cartSummary.length - 1
                    );
                cartSummary += ' and';
            }
            cartSummary += ` ${item.num} ${item.name.toLowerCase()}${
                item.num > 1 ? 's' : ''
            },`;
            total += item.num * item.price;
        });

        if (!numItems) return 'Your cart is empty!';

        return `You have${cartSummary.substring(0, cartSummary.length - 1)} \
                in your cart, totaling $${total.toFixed(2)}.`;
    };

    const checkout = async () => {
        const checkoutBody = {};
        let numInCart = 0;
        Object.values(cart).forEach((item) => {
            checkoutBody[item.name] = item.num;
            numInCart += item.num;
        });
        console.log(checkoutBody);

        if (!numInCart)
            return 'You need to select at least 1 item before you may checkout!';

        const response = await fetch(
            'https://cs571.org/api/s24/hw10/checkout',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CS571-ID': CS571.getBadgerId()
                },
                body: JSON.stringify(checkoutBody)
            }
        );

        if (!response.ok) return 'There was a problem with the order.';

        const data = await response.json();

        initCart();

        return `Your order was successful! The confirmation ID is ${data.confirmationId}`;
    };

    const handleInitialize = async () => {
        refreshAvailableItems();
        return 'Welcome to BadgerMart Chat! Ask me a question, \
                or let me know if you need help!';
    };

    const handleReceive = async (prompt) => {
        const { intents, entities, traits } = await queryAgent(prompt);
        console.log(entities, intents, traits); // TODO

        if (intents && intents.length >= 1) {
            switch (intents[0].name) {
                case 'get_help':
                    return getHelp();
                case 'get_items':
                    return getItems();
                case 'get_price':
                    return getPrice(entities);
                case 'add_item':
                    return addItem(entities);
                case 'remove_item':
                    return removeItem(entities);
                case 'view_cart':
                    return viewCart();
                case 'checkout':
                    return await checkout();
            }
        }

        return "I'm sorry, I didn't understand that. \
                   Please type 'help' to see your options.";
    };

    return {
        handleInitialize,
        handleReceive
    };
};

export default createChatAgent;
