import { Text, View, Image, Button, StyleSheet } from 'react-native';

export default function BadgerSaleItem(props) {
    const handleAddCartItem = () => {
        props.modifyCartItem(props.name, (item) => {
            item.numInCart += 1;
        });
    };

    const handleRemoveCartItem = () => {
        props.modifyCartItem(props.name, (item) => {
            item.numInCart -= 1;
        });
    };

    return (
        <View style={[{ gap: 13 }, styles.centered]}>
            <Image
                style={{ width: 250, height: 250 }}
                source={{ uri: props.imgSrc }}
                alt={`a picture of a ${props.name}`}
            />
            <Text style={{ fontSize: 30 }}>{props.name}</Text>
            <Text style={{ fontSize: 22 }}>
                ${props.price ? props.price.toFixed(2) : '0.00'} each
            </Text>
            <Text>You can order up to {props.upperLimit} units!</Text>
            <View style={[styles.centered, styles.horizontal]}>
                <Button
                    title='-'
                    disabled={props.numInCart <= 0}
                    onPress={handleRemoveCartItem}
                />
                <Text style={{ fontSize: 20, fontWeight: 300 }}>
                    {props.numInCart}
                </Text>
                <Button
                    title='+'
                    disabled={props.numInCart >= props.upperLimit}
                    onPress={handleAddCartItem}
                />
            </View>
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
