import {
    createNativeStackNavigator,
    Text,
    View
} from '@react-navigation/native-stack';
import BadgerNewsScreen from '../screens/news-screen/BadgerNewsScreen';
import BadgerNewsArticle from '../screens/news-screen/BadgerNewsArticle';

export default function BadgerNewsStack(props) {
    const BadgerStack = createNativeStackNavigator();

    return (
        <BadgerStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#c5050c' },
                headerTintColor: '#fff'
            }}
        >
            <BadgerStack.Screen name='Articles' component={BadgerNewsScreen} />
            <BadgerStack.Screen name='Article' component={BadgerNewsArticle} />
        </BadgerStack.Navigator>
    );
}
