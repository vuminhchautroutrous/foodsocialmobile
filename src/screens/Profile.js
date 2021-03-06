import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Keyboard, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import HeaderProfile from '../components/HeaderProfile'
import StyleProfile from '../themes/StyleProfile';

import PostProfileItem from '../components/PostProfileItem';
import CardProfile from '../components/CardProfile';
import BioProfile from '../components/BioProfile';
import { setProfile } from '../commons/Storage';

import {
    addProfile
} from '../actions';

import { getPostByUser } from '../api/Post';
import { getProfileByID } from '../api/Profile';

const Profile = (props) => {
    const { navigation } = props;
    const { route } = props;
    const profileRedux = useSelector(state => state.profile);
    const dispatch = useDispatch();
    const [profileS, setProfileS] = useState([]);
    const [postsProfile, setPostsProfile] = useState([]);


    useEffect(() => {
        setProfileS(profileRedux);
    }, [profileRedux]);
    

    const handlerGetPost = async () => {
        const dataResponse = await getPostByUser({
            start: 0,
            limit: 5,
            userID: profileRedux.profileID
        });
        if (dataResponse && dataResponse.successGet == true) {
            setPostsProfile(dataResponse.posts);
        } else {
            console.log("Lỗi hệ thống");
        }
    }

    const handlerGetProfile = async () => {
        const dataResponse = await getProfileByID({
            userID: profileRedux.profileID,
        })
        if (dataResponse && dataResponse.successGet == true) {
            dispatch(addProfile(dataResponse));
            setProfile(dataResponse);
        } else {
            console.log("Lỗi hệ thống");
        }
    }
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handlerGetProfile();
        handlerGetPost().then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        handlerGetPost();

        return;
    }, []);

    const handleGotoPost = (post) => {
        if (post) {
            navigation.navigate('PostItem', { post: post });
        }
    }
    return (
        <View style={StyleProfile.containerPostList}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['red', 'green', 'blue', 'orange']} />
                }
            >
                <CardProfile profile={profileS} />
                <BioProfile profile={profileS} />
                <View style={StyleProfile.viewWrapPostProfileItem}>
                    {
                        postsProfile.map(postProfile => {
                            if (postProfile.image.length != 0) {
                                return <PostProfileItem key={postProfile.postID} post={postProfile} handleGotoPost={handleGotoPost} />;
                            }
                        })
                    }
                </View>
            </ScrollView>
        </View>
    )
}
// Profile.navigationOptions = {
//     headerTitle: () => <HeaderProfile />
// };

export default Profile;