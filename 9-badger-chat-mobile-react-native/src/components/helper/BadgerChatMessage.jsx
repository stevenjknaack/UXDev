import { Text, Button } from 'react-native';
import { useContext } from 'react';
import BadgerCard from './BadgerCard';
import LoggedInUserContext from '../../contexts/LoggedInUserContext';

function BadgerChatMessage(props) {
    const loggedInUser = useContext(LoggedInUserContext);
    const dt = new Date(props.created);

    return (
        <BadgerCard
            style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}
        >
            <Text style={{ fontSize: 28, fontWeight: 600 }}>{props.title}</Text>
            <Text style={{ fontSize: 12 }}>
                by {props.poster} | Posted on {dt.toLocaleDateString()} at{' '}
                {dt.toLocaleTimeString()}
            </Text>
            <Text></Text>
            <Text>{props.content}</Text>
            {loggedInUser !== 'guest' &&
            props.poster === loggedInUser.username ? (
                <Button
                    color='crimson'
                    title='DELETE POST'
                    onPress={() => props.handleDeletePost(props.id)}
                />
            ) : (
                <></>
            )}
        </BadgerCard>
    );
}

export default BadgerChatMessage;
