import { Alert, Pressable, StyleSheet, Text, Linking } from 'react-native';

export default function BadgerLink(props) {
    const openLink = () => {
        Linking.openURL(props.to);
    };

    return (
        <Pressable onPress={openLink}>
            <Text style={[styles.linkText, props.style]}>{props.title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    linkText: {
        color: '#007bff'
    }
});
