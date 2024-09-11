import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
    const navigation = useNavigation();

    const handleIconPress = () => {
        navigation.navigate('Main');
    };

    return (
        <View style={{width: '100%', height: 30}}>
            <TouchableOpacity
                style={{ flex: 1}}
                onPress={handleIconPress}
            >
                <Image
                    source={require('../Image/HomeIcon.png')}
                    style={{ flex: 1, width: 30, height: 30 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        </View>
    );
};