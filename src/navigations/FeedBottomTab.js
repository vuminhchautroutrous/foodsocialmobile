import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useLayoutEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProfile, deleteToken } from '../actions';
import { removeProfile, removeToken } from '../commons/Storage'

import Notification from '../screens/Notification';
import Profile from '../screens/Profile';
import Search from '../screens/Search';
import CreatePostStack from '../navigations/CreatePostStack';
import NewFeed from '../screens/NewFeed';
import HeaderNewFeed from '../components/HeaderNewFeed';
import HeaderProfile from '../components/HeaderProfile';

const Tab = createBottomTabNavigator();

const FeedBottomTab = ({ navigation, route }) => {
    const profileRedux = useSelector(state => state.profile);
    const dispatch = useDispatch();
    const handlerSignout = async () => {
        try {
            await Promise.all([removeProfile(), removeToken(), dispatch(deleteProfile()), dispatch(deleteToken())]);
            navigation.navigate('SignIn');
        } catch (error) {
            console.log(error);
        }
    }
    useLayoutEffect(() => {
        if (getFocusedRouteNameFromRoute(route) == "Profile") {
            navigation.setOptions({ headerShown: true, headerTitle: () => <HeaderProfile name={profileRedux.profileFirstname + ' ' + profileRedux.profileLastname} handlerSignout={handlerSignout} /> });
        } else if (getFocusedRouteNameFromRoute(route) == "CreatePostStack") {
            navigation.setOptions({ headerShown: false });
        } else {
            navigation.setOptions({ headerShown: true, headerTitle: () => <HeaderNewFeed /> });
        }
    });
    useLayoutEffect(() => {
        navigation.setOptions({ headerTitle: () => <HeaderNewFeed /> });
    }, [])
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "NewFeed") {
                        iconName = focused ? 'card-text' : 'card-text-outline';
                    } else if (route.name === "Profile") {
                        iconName = focused ? 'account' : 'account-outline';
                    } else if (route.name === "Search") {
                        iconName = focused ? 'feature-search' : 'feature-search-outline';
                    } else if (route.name === "CreatePostStack") {
                        iconName = focused ? 'looks' : 'looks';
                    } else if (route.name === "Notification") {
                        iconName = focused ? 'star' : 'staro';
                        return <AntDesign name={iconName} size={size - 2} color={color} />;
                    }
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                headerTitle: () => <HeaderNewFeed />
            })}

            tabBarOptions={{
                activeTintColor: '#107dac',
                inactiveTintColor: '#000',
                showLabel: false,
                keyboardHidesTabBar: true,
            }}
        >
            <Tab.Screen name="NewFeed" component={NewFeed} />
            <Tab.Screen name="Search" component={Search} />
            <Tab.Screen name="CreatePostStack" children={CreatePostStack} options={CreatePostStack.navigationOptions} />
            <Tab.Screen name="Notification" component={Notification} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}
FeedBottomTab.navigationOptions = {
    headerLeft: null
}
export default FeedBottomTab;