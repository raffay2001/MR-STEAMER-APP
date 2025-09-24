import React from 'react';
import { SafeAreaView, View, Text, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const BecomeStreamer: React.FC = () => {

    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

            <ImageBackground
                // TODO: replace with your asset if different
                source={require('../../assets/images/become-steamer-hero.png')}
                resizeMode="cover"
                style={{ flex: 1 }}
            >
                {/* black overlay top->bottom */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.85)']}
                    locations={[0, 1]}
                    style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                />

                {/* Bottom-fixed content (no scroll) */}
                <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 32 }}>
                    <Text style={{ color: '#fff', fontSize: 30, fontWeight: '600', letterSpacing: 0.5 }}>
                        Become Mr. Steamer
                    </Text>

                    <Text style={{ color: '#fff', marginTop: 12, fontWeight: '600', lineHeight: 20 }}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                        has been the industry's standard dummy text ever since the 1500s, when an unknown
                        printer took a galley of type and scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into electronic typesetting,
                        remaining essentially unc
                    </Text>

                    {/* Register button */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('RegisterSteamer')}
                        style={{
                            marginTop: 20,
                            height: 56,
                            borderRadius: 10,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'flex-start',
                            paddingHorizontal: 22,
                        }}
                        activeOpacity={0.9}
                    >
                        <Text style={{ color: '#000000', fontWeight: '500', fontSize: 18 }}>Register</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView >
    );
};

export default BecomeStreamer;
