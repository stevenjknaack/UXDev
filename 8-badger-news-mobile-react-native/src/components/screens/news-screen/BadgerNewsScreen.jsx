import { ScrollView, Text, View, StyleSheet, Alert } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import BadgerNewsItemCard from './BadgerNewsItemCard';
import UserNewsPreferencesContext from '../../../contexts/UserNewsPreferencesContext';

import CS571 from '@cs571/mobile-client';

export default function BadgerNewsScreen(props) {
    const [prefs, updatePreference] = useContext(UserNewsPreferencesContext);
    const [newsItems, setNewsItems] = useState([]);
    const [newsItemsLoaded, setNewsItemsLoaded] = useState(false);
    const [shownNewsItems, setShownNewsItems] = useState([]);

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw8/articles', {
            method: 'GET',
            headers: {
                'X-CS571-ID': CS571.getBadgerId()
            }
        })
            .then((response) => response.json())
            .then((data) => setNewsItems(data));
    }, []);

    useEffect(() => {
        if (newsItems.length > 0) setNewsItemsLoaded(true);
    }, [newsItems]);

    useEffect(() => {
        if (!newsItemsLoaded) return;

        newsItems.forEach((item) => {
            item.tags.forEach((tag) => updatePreference(tag, true));
        });
    }, [newsItemsLoaded]);

    useEffect(() => {
        setShownNewsItems(
            newsItems.filter((item) => item.tags.every((tag) => prefs[tag]))
        );
    }, [prefs]);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.newsScreenScroll}>
                {!shownNewsItems.length && newsItemsLoaded ? (
                    <Text style={styles.noMatchText}>
                        No articles match your preferences.
                    </Text>
                ) : (
                    shownNewsItems.map((item) => (
                        <BadgerNewsItemCard key={item.id} {...item} />
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    newsScreenScroll: {
        marginHorizontal: 10,
        rowGap: 20,
        paddingVertical: 20
    },
    noMatchText: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: '300'
    }
});
