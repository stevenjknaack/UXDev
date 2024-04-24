import { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Animated
} from 'react-native';
import BadgerLink from '../../generic/BadgerLink';
import CS571 from '@cs571/mobile-client';

export default function BadgerNewsArticle(props) {
    const [article, setArticle] = useState({});
    const [articleLoaded, setArticleLoaded] = useState(false);

    const preloadedContentOpacity = useRef(new Animated.Value(0));
    const loadingTextOpacity = useRef(new Animated.Value(0.25));
    const loadedContentOpacity = useRef(new Animated.Value(0));

    useEffect(() => {
        fetch(
            `https://cs571.org/api/s24/hw8/article?id=${props.route.params.id}`,
            {
                method: 'GET',
                headers: {
                    'X-CS571-ID': CS571.getBadgerId()
                }
            }
        )
            .then((response) => response.json())
            .then((data) => setArticle(data));
    }, []);

    useEffect(() => {
        Animated.timing(preloadedContentOpacity.current, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true
        }).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(loadingTextOpacity.current, {
                    toValue: 0.55,
                    duration: 650,
                    useNativeDriver: true
                }),
                Animated.timing(loadingTextOpacity.current, {
                    toValue: 0.25,
                    duration: 650,
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    useEffect(() => {
        if (Object.keys(article).length) setArticleLoaded(true);
    }, [article]);

    useEffect(() => {
        if (articleLoaded) {
            loadingTextOpacity.current.stopAnimation();

            Animated.timing(loadedContentOpacity.current, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }).start();
        }
    }, [articleLoaded]);

    const buildArticleBody = () => {
        const articleBody = [];

        for (let i = 0; i < article.body?.length; i++) {
            articleBody.push(
                <Text key={i} style={styles.articleBodyText}>
                    {article.body[i]}
                </Text>
            );
        }

        return articleBody;
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <Animated.Image
                    style={[
                        styles.articleImage,
                        { opacity: preloadedContentOpacity.current }
                    ]}
                    source={{
                        uri: `https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/${props.route.params.img}`
                    }}
                />
                <View style={styles.articleContentView}>
                    <Animated.Text
                        style={[
                            styles.articleTitle,
                            { opacity: preloadedContentOpacity.current }
                        ]}
                    >
                        {props.route.params.title}
                    </Animated.Text>
                    {articleLoaded ? (
                        <Animated.View
                            style={{ opacity: loadedContentOpacity.current }}
                        >
                            <Text style={styles.articleSubHeader}>
                                By {article.author} on {article.posted}
                            </Text>
                            <BadgerLink
                                style={styles.articleLink}
                                title='Read full article here.'
                                to={article.url}
                            />
                            <View style={styles.articleBodyView}>
                                {buildArticleBody()}
                            </View>
                        </Animated.View>
                    ) : (
                        <Animated.Text
                            style={[
                                styles.loadingText,
                                { opacity: loadingTextOpacity.current }
                            ]}
                        >
                            The content is loading!
                        </Animated.Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    articleImage: {
        height: 250,
        width: 'auto'
    },
    articleContentView: { marginHorizontal: 12, marginVertical: 20 },
    articleTitle: {
        fontSize: 26,
        fontWeight: '300',
        marginBottom: 20
    },
    articleSubHeader: { fontSize: 18, fontWeight: '300' },
    articleLink: { fontSize: 16, fontWeight: '300', marginBottom: 20 },
    articleBodyView: { gap: 10 },
    articleBodyText: { fontSize: 16, fontWeight: '300' },
    loadingText: { alignSelf: 'center', marginTop: 20 }
});
