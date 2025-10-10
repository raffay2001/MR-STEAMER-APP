import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert, Pressable, TextInput } from 'react-native';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const ForgotPassword: React.FC<any> = ({ navigation }) => {
    const { t } = useTranslation();
    const { loading, handleRequestPasswordReset } = useAuth();

    const isAr = i18n.language?.startsWith('ar');
    const [email, setEmail] = useState('');

    const submit = async () => {
        if (!email) {
            Alert.alert(t('forgot.missingTitle'), t('forgot.missingDesc'));
            return;
        }
        try {
            await handleRequestPasswordReset(email);
            navigation.navigate('ResetPassword', { email });
        } catch (e: any) {
            Alert.alert(t('forgot.errorTitle'), e?.response?.data?.message || t('forgot.errorFallback'));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
                {/* Title & subtitle */}
                <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 10, textAlign: isAr ? 'right' : 'left' }}>
                    {t('forgot.title')}
                </Text>
                <Text style={{ color: '#A4A4A4', marginBottom: 16, textAlign: isAr ? 'right' : 'left' }}>
                    {t('forgot.subtitle')}
                </Text>

                {/* Email */}
                <Text style={{ color: '#fff', marginBottom: 8, textAlign: isAr ? 'right' : 'left' }}>
                    {t('forgot.emailLabel')}
                </Text>
                <View
                    style={{
                        flexDirection: isAr ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        backgroundColor: '#1A1A1A',
                        borderColor: '#2A2A2A',
                        borderWidth: 1,
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        height: 60,
                    }}
                >
                    <Ionicons
                        name="mail-outline"
                        size={20}
                        color="#A4A4A4"
                        style={{ marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }}
                    />
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder={t('forgot.emailPlaceholder')}
                        placeholderTextColor="#8A8A8A"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{ flex: 1, color: '#FFFFFF', textAlign: isAr ? 'right' : 'left', minHeight: 48, textAlignVertical: 'center' }}
                    />
                </View>

                {/* CTA */}
                <Button
                    className="mt-5"
                    variant="primary"
                    style={{ backgroundColor: 'white', opacity: loading ? 0.7 : 1 }}
                    onPress={submit}
                    disabled={loading}
                >
                    <Text style={{ color: '#000', fontSize: 16, fontWeight: '600' }}>
                        {loading ? t('forgot.sending') : t('forgot.sendCode')}
                    </Text>
                </Button>

                {/* Back to login */}
                <View
                    style={{
                        marginTop: 16,
                        flexDirection: isAr ? 'row-reverse' : 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <Text style={{ color: '#A4A4A4', fontSize: 16 }}>{t('forgot.remembered')}</Text>
                    <Pressable onPress={() => navigation.navigate('Login')}>
                        <Text style={{ color: '#fff', fontSize: 16, textDecorationLine: 'underline' }}>{t('forgot.login')}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ForgotPassword;
