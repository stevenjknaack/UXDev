import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import UserNewsPreferencesContext from '../contexts/UserNewsPreferencesContext';

import BadgerTabs from './navigation/BadgerTabs';

export default function BadgerNews(props) {
    const [prefs, setPrefs] = useState({});

    const updatePreference = (tag, onState) => {
        setPrefs((curr) => {
            const newPrefs = { ...curr };
            newPrefs[tag] = onState;
            return newPrefs;
        });
    };

    // useEffect(() => {
    //     // for testing
    //     console.log(prefs);
    // }, [prefs]);

    return (
        <NavigationContainer>
            <UserNewsPreferencesContext.Provider
                value={[prefs, updatePreference]}
            >
                <BadgerTabs />
            </UserNewsPreferencesContext.Provider>
        </NavigationContainer>
    );
}
