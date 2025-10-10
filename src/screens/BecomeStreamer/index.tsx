import React from 'react';
import { SafeAreaView, View, Text, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const BecomeStreamer: React.FC = () => {

    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');

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
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 30,
                            fontWeight: '600',
                            letterSpacing: 0.5,
                            textAlign: isAr ? 'right' : 'left',
                        }}
                    >
                        {t('become.title')}
                    </Text>

                    {/* body */}
                    <Text
                        style={{
                            color: '#fff',
                            marginTop: 12,
                            fontWeight: '600',
                            lineHeight: 20,
                            textAlign: isAr ? 'right' : 'left',   // + RTL
                        }}
                    >
                        {t('become.body')}
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
                        <Text style={{ color: '#000000', fontWeight: '500', fontSize: 18 }}>
                            {t('become.register')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView >
    );
};

export default BecomeStreamer;
