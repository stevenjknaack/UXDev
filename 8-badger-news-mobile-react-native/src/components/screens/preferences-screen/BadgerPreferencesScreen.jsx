import { ScrollView, Text, View, StyleSheet } from 'react-native';
import BadgerPreferenceCard from './BadgerPreferenceCard';
import UserNewsPreferencesContext from '../../../contexts/UserNewsPreferencesContext';
import { useContext } from 'react';

function BadgerPreferencesScreen(props) {
    const [prefs, updatePreference] = useContext(UserNewsPreferencesContext);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.preferencesScrollView}>
                {Object.keys(prefs).map((tag) => (
                    <BadgerPreferenceCard
                        key={tag}
                        tag={tag}
                        onState={prefs[tag]}
                        updatePref={(state) => updatePreference(tag, state)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

export default BadgerPreferencesScreen;

const styles = StyleSheet.create({
    preferencesScrollView: {
        paddingVertical: 20,
        marginHorizontal: 10,
        gap: 15
    }
});
