import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Title() {
    const navigation = useNavigation();

    const handleImagePress = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={handleImagePress}
                activeOpacity={0.8}
            >
                <Image
                    source={require('../Image/TitleScreen.png')}
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        </View>
    );
};

