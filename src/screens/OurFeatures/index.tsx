import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ImageBackground,
    ScrollView,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

// SVG icons (add these files)
import Icon1 from '../../assets/svgs/feature-1.svg';
import Icon2 from '../../assets/svgs/feature-2.svg';
import Icon3 from '../../assets/svgs/feature-3.svg';
import Icon4 from '../../assets/svgs/feature-4.svg';
import Icon5 from '../../assets/svgs/feature-5.svg';
import Icon6 from '../../assets/svgs/feature-6.svg';

const FEATURES = [
    { id: '1', Icon: Icon1 },
    { id: '2', Icon: Icon2 },
    { id: '3', Icon: Icon3 },
    { id: '4', Icon: Icon4 },
    { id: '5', Icon: Icon5 },
    { id: '6', Icon: Icon6 },
];

const OurFeatures: React.FC = () => {

    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

            <ImageBackground
                source={require('../../assets/images/features-hero.png')}
                resizeMode="cover"
                style={{ flex: 1 }}
            >
                {/* Black overlay: light -> dark */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.50)']}
                    locations={[0, 1]}
                    style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                />

                <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                    {/* Title */}
                    <View style={{ paddingTop: 120, paddingHorizontal: 20, alignItems: 'center' }}>
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 30,
                                fontWeight: '500',
                                letterSpacing: 0.5,
                                textAlign: 'center',
                                width: '100%',
                            }}
                        >
                            {t('features.title')}
                        </Text>
                    </View>

                    {/* Features grid (no white background) */}
                    <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {FEATURES.map(({ id, Icon }) => {
                                const title = t(`features.items.${id}.title`);
                                const desc = t(`features.items.${id}.desc`);
                                return (
                                    <View
                                        key={id}
                                        style={{
                                            width: '48%',
                                            borderRadius: 14,
                                            paddingVertical: 14,
                                            paddingHorizontal: 10,
                                            marginBottom: 12,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {/* Circle + Icon */}
                                        <View
                                            style={{
                                                width: 54,
                                                height: 54,
                                                borderRadius: 27,
                                                backgroundColor: "#fff",
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Icon width={28} height={28} fill="#FFFFFF" />
                                        </View>

                                        <Text style={{ color: '#FFFFFF', fontWeight: '700', textAlign: 'center' }}>{title}</Text>
                                        <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4, fontSize: 12, textAlign: 'center' }}>
                                            {desc}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default OurFeatures;
