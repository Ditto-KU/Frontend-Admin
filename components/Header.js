import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
    const navigation = useNavigation();

    const handleHomePress = () => {
        navigation.navigate('Main');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={{ width: '100%', height: 30, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

            {/* Home Button */}
            <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={handleHomePress}
            >
                <Image
                    source={require('../Image/HomeIcon.png')}
                    style={{ width: 30, height: 30 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity
                onPress={handleBackPress}
            >
                <Image
                    source={require('../Image/BackIcon.png')} 
                    style={{ width: 30, height: 30 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        </View>
    );
};
