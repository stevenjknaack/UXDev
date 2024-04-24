import { Button, Text, View, Alert, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import BadgerSaleItem from './BadgerSaleItem';
import CS571 from '@cs571/mobile-client';

export default function BadgerMart(props) {
    const [saleItems, setSaleItems] = useState([]);
    const [currItemIndex, setCurrItemIndex] = useState(0);

    const [cart, setCart] = useState({});
    const [cartTotal, setCartTotal] = useState(0);
    const [numItemsInCart, setNumItemsInCart] = useState(0);

    const refreshCart = () => {
        const cart = {};
        saleItems.forEach((item) => {
            cart[item.name] = {
                numInCart: 0,
                price: item.price
            };
        });

        setCart(cart);
    };

    const modifyCartItem = (itemName, func) => {
        const newCart = { ...cart };
        func(newCart[itemName]);
        setCart(newCart);
    };

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw7/items', {
            headers: {
                'X-CS571-ID': CS571.getBadgerId()
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setSaleItems(data);
            });
    }, []);

    useEffect(refreshCart, [saleItems]);

    useEffect(() => {
        const [cartTotal, numItemsInCart] = Object.keys(cart).reduce(
            (prev, curr) => {
                const item = cart[curr];
                return [
                    prev[0] + item.numInCart * item.price,
                    prev[1] + item.numInCart
                ];
            },
            [0, 0]
        );

        setCartTotal(cartTotal);
        setNumItemsInCart(numItemsInCart);
    }, [cart]);

    const handlePlaceOrder = () => {
        Alert.alert(
            'Order Confirmed!',
            `Your order contains ${numItemsInCart} item${
                numItemsInCart > 1 ? 's' : ''
            } and costs $${cartTotal.toFixed(2)}!`
        );

        refreshCart();
        setCurrItemIndex(0);
    };

    return (
        <View style={styles.centered}>
            <Text style={{ fontSize: 28, marginBottom: 10 }}>
                Welcome to Badger Mart!
            </Text>
            <View style={[styles.centered, styles.horizontal]}>
                <Button
                    title='previous'
                    disabled={currItemIndex <= 0}
                    onPress={() => setCurrItemIndex((curr) => curr - 1)}
                    accessibilityLabel='go to previous sale item'
                />
                <Button
                    title='next'
                    disabled={currItemIndex >= saleItems.length - 1}
                    onPress={() => setCurrItemIndex((curr) => curr + 1)}
                    accessibilityLabel='go to next sale item'
                />
            </View>
            <View style={{ marginBottom: 40 }}>
                {Object.keys(cart).length > 0 ? (
                    // <BadgerSaleItem
                    //     {...saleItems[currItemIndex]}
                    //     numInCart={
                    //         cart[saleItems[currItemIndex].name].numInCart
                    //     }
                    //     modifyCartItem={modifyCartItem}
                    // />
                    [saleItems[currItemIndex]].map((item) => (
                        <BadgerSaleItem
                            key={item.name}
                            {...item}
                            numInCart={cart[item.name].numInCart}
                            modifyCartItem={modifyCartItem}
                        />
                    ))
                ) : (
                    <Text>Loading...</Text>
                )}
            </View>

            <Text style={{ marginBottom: 15 }}>
                You have {numItemsInCart} item{numItemsInCart !== 1 ? 's' : ''}{' '}
                costing ${cartTotal.toFixed(2)} in your cart!
            </Text>
            <Button
                title='place order'
                disabled={numItemsInCart === 0}
                onPress={handlePlaceOrder}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    horizontal: {
        flexDirection: 'row'
    }
});
