import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

const AboutUs: React.FC = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ padding: 16 }}>
                {/* <Text style={{ fontSize: 22, fontWeight: '700', color: '#111' }}>
                    About Us
                </Text> */}
                <Text className='text-black opacity-50 text-[16px] font-normal leading-[29px] tracking-[1.5px]'>
                    We value your time and therefore washing your car at our car wash will take no more than 15 minutes. Our company employs only highly qualified specialists, we use high-quality cleaning products and equipment, as well as premium materials. We value your time and therefore washing your car at our car wash will take no more than 15 minutes. Our company employs only highly qualified specialists, we use high-quality cleaning products and equipment, as well as premium materials.
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default AboutUs;
