import {
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Modal,
    Alert,
    Keyboard
} from 'react-native';
import CS571 from '@cs571/mobile-client';
import { FlatList } from 'react-native-gesture-handler';
import BadgerChatMessage from '../helper/BadgerChatMessage';
import { useContext, useEffect, useState } from 'react';
import BadgerCard from '../helper/BadgerCard';
import * as SecureStore from 'expo-secure-store';
import LoggedInUserContext from '../../contexts/LoggedInUserContext';

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [titleInput, setTitleInput] = useState('');
    const [bodyInput, setBodyInput] = useState('');
    const loggedInUser = useContext(LoggedInUserContext);

    function refreshMessages() {
        setIsLoading(true);
        fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
            method: 'GET',
            headers: {
                'X-CS571-ID': CS571.getBadgerId()
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setMessages(data.messages);
                setIsLoading(false);
            });
    }

    useEffect(refreshMessages, []);

    function createPostRequest(jwtToken) {
        fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
            method: 'POST',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: titleInput,
                content: bodyInput
            })
        }).then((response) => {
            if (!response.ok) {
                Alert.alert('Error', 'Problem posting message');
            } else {
                setModalVisible(false);
                setTitleInput('');
                setBodyInput('');
                Alert.alert(
                    'Success!',
                    'Your message was successfully posted.'
                );
                refreshMessages();
            }
        });
    }

    function handleCreatePost() {
        SecureStore.getItemAsync('jwt').then((res) => {
            if (res) {
                createPostRequest(res);
            } else {
                Alert.alert('Internal Error', 'Problem posting message');
            }
        });
    }

    function deletePostRequest(jwtToken, id) {
        fetch(`https://cs571.org/api/s24/hw9/messages?id=${id}`, {
            method: 'DELETE',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
                Authorization: `Bearer ${jwtToken}`
            }
        }).then((response) => {
            if (!response.ok) {
                Alert.alert('Error', 'Problem deleting message');
            } else {
                Alert.alert(
                    'Success!',
                    'Your message was successfully deleted.'
                );
                refreshMessages();
            }
        });
    }

    function handleDeletePost(id) {
        SecureStore.getItemAsync('jwt').then((res) => {
            if (res) {
                deletePostRequest(res, id);
            } else {
                Alert.alert('Internal Error', 'Problem deleting message');
            }
        });
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <BadgerChatMessage
                        {...item}
                        handleDeletePost={handleDeletePost}
                    />
                )}
                keyExtractor={(item) => item.id}
                scrollIndicatorInsets={{ right: 1 }}
                onRefresh={refreshMessages}
                refreshing={isLoading}
            />
            {loggedInUser === 'guest' ? (
                <></>
            ) : (
                <>
                    <BadgerCard
                        style={styles.addPost}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={{ color: '#fff' }}>ADD POST</Text>
                    </BadgerCard>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text
                                    style={{ marginBottom: 15, fontSize: 20 }}
                                >
                                    Create A Post
                                </Text>
                                <Text>Title</Text>
                                <TextInput
                                    style={styles.input}
                                    value={titleInput}
                                    onChangeText={setTitleInput}
                                    maxLength={128}
                                />
                                <Text>Body</Text>
                                <TextInput
                                    style={[styles.input, { height: 125 }]}
                                    value={bodyInput}
                                    onChangeText={setBodyInput}
                                    multiline={true}
                                    textAlignVertical='top'
                                    onKeyPress={({ nativeEvent }) => {
                                        if (nativeEvent.key === 'Enter')
                                            Keyboard.dismiss();
                                    }}
                                    maxLength={1024}
                                />
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignSelf: 'center',
                                        marginTop: 10
                                    }}
                                >
                                    <Button
                                        color='darkred'
                                        title='CREATE POST'
                                        onPress={handleCreatePost}
                                        disabled={
                                            !titleInput.trim() ||
                                            !bodyInput.trim()
                                        }
                                    />
                                    <Button
                                        color='grey'
                                        title='CANCEL'
                                        onPress={() => {
                                            setModalVisible(false);
                                            setTitleInput('');
                                            setBodyInput('');
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addPost: {
        alignItems: 'center',
        backgroundColor: 'darkred',
        borderRadius: 0
    },
    input: {
        height: 40,
        width: 275,
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        marginTop: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        height: 395,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        marginBottom: 150
    }
});

export default BadgerChatroomScreen;
