import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BadgerPreferencesScreen from '../screens/preferences-screen/BadgerPreferencesScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BadgerNewsStack from './BadgerNewsStack';

function BadgerTabs(props) {
    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#000',
                tabBarStyle: { backgroundColor: '#c5050c' },
                headerStyle: { backgroundColor: '#c5050c' },
                headerTintColor: '#fff'
            }}
        >
            <Tabs.Screen
                name='News'
                component={BadgerNewsStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name='newspaper'
                            color={color}
                            size={size}
                        />
                    ),
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name='Preferences'
                component={BadgerPreferencesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name='cog'
                            color={color}
                            size={size}
                        />
                    )
                }}
            />
        </Tabs.Navigator>
    );
}

export default BadgerTabs;
