import BadgerCard from '../../generic/BadgerCard';
import { Image, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BadgerNewsItemCard(props) {
    const navigation = useNavigation();

    const navToArticle = () => {
        navigation.push('Article', {
            id: props.fullArticleId,
            img: props.img,
            title: props.title
        });
    };

    return (
        <BadgerCard
            style={[styles.itemCard, props.style]}
            onPress={navToArticle}
        >
            <Image
                style={styles.articlePreviewImage}
                source={{
                    uri: `https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/${props.img}`
                }}
            />
            <Text style={styles.articlePreviewTitle}>{props.title}</Text>
        </BadgerCard>
    );
}

const styles = StyleSheet.create({
    itemCard: {
        flex: 1,
        flexDirection: 'column',
        rowGap: 20
    },
    articlePreviewImage: {
        height: 225,
        width: 'auto',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    articlePreviewTitle: {
        fontSize: 26,
        fontWeight: '300',
        paddingRight: 10
    }
});
