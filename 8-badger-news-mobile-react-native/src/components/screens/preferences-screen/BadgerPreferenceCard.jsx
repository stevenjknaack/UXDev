import { useEffect, useState } from 'react';
import BadgerCard from '../../generic/BadgerCard';
import { StyleSheet, Text, Switch } from 'react-native';

export default function BadgerPreferenceCard(props) {
    const [onState, setOnState] = useState(props.onState);

    const toggleOnState = () => {
        setOnState((curr) => !curr);
    };

    useEffect(() => setOnState(props.onState), [props.onState]);

    useEffect(() => props.updatePref(onState), [onState]);

    return (
        <BadgerCard style={[styles.preferenceCard, props.style]}>
            <Text style={styles.preferenceStatusText}>
                Currently {onState ? '' : 'NOT '}showing{' '}
                <Text style={{ fontWeight: 'bold' }}>{props.tag}</Text>{' '}
                articles.
            </Text>
            <Switch
                value={onState}
                onValueChange={toggleOnState}
                trackColor={{ false: '#767577', true: '#e89b9e' }}
                thumbColor={onState ? '#c5050c' : '#f4f3f4'}
                ios_backgroundColor='#3e3e3e'
            />
        </BadgerCard>
    );
}

const styles = StyleSheet.create({
    preferenceCard: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        paddingBottom: 20
    },
    preferenceStatusText: { fontSize: 15 }
});
