import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const AboutUs: React.FC = () => {
    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ padding: 16 }}>
                <Text
                    className="text-black opacity-50 text-[16px] font-normal leading-[29px] tracking-[1.5px]"
                    style={{ textAlign: isAr ? 'right' : 'left' }}
                >
                    {t('about.body')}
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default AboutUs;
