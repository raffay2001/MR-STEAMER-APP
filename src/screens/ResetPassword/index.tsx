import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert, Pressable, TextInput } from 'react-native';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ResetPassword: React.FC<any> = ({ navigation }) => {
    const { t } = useTranslation();
    const route = useRoute<any>();
    const initialEmail = route?.params?.email || '';
    const { loading, handleResetPasswordWithCode } = useAuth();

    const isAr = i18n.language?.startsWith('ar');
    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const submit = async () => {
        if (!email || !code || !password) {
            return Alert.alert(t('reset.missingTitle'), t('reset.missingDesc'));
        }
        try {
            await handleResetPasswordWithCode({ email, code, password });
            Alert.alert(t('reset.successTitle'), t('reset.successDesc'), [
                { text: t('reset.ok'), onPress: () => navigation.replace('Login') },
            ]);
        } catch (e: any) {
            Alert.alert(t('reset.errorTitle'), e?.response?.data?.message || t('reset.errorFallback'));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
                {/* Title */}
                <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 10, textAlign: isAr ? 'right' : 'left' }}>
                    {t('reset.title')}
                </Text>

                {/* Email */}
                <Text style={{ color: '#fff', marginBottom: 8, textAlign: isAr ? 'right' : 'left' }}>
                    {t('reset.emailLabel')}
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
                        placeholder={t('reset.emailPlaceholder')}
                        placeholderTextColor="#8A8A8A"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{ flex: 1, color: '#FFFFFF', textAlign: isAr ? 'right' : 'left', minHeight: 48, textAlignVertical: 'center' }}
                    />
                </View>

                {/* Code */}
                <View style={{ height: 12 }} />
                <Text style={{ color: '#fff', marginBottom: 8, textAlign: isAr ? 'right' : 'left' }}>
                    {t('reset.codeLabel')}
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
                        name="keypad-outline"
                        size={20}
                        color="#A4A4A4"
                        style={{ marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }}
                    />
                    <TextInput
                        value={code}
                        onChangeText={setCode}
                        placeholder={t('reset.codePlaceholder')}
                        placeholderTextColor="#8A8A8A"
                        keyboardType="number-pad"
                        autoCapitalize="none"
                        style={{ flex: 1, color: '#FFFFFF', textAlign: isAr ? 'right' : 'left', minHeight: 48, textAlignVertical: 'center' }}
                    />
                </View>

                {/* New password */}
                <View style={{ height: 12 }} />
                <Text style={{ color: '#fff', marginBottom: 8, textAlign: isAr ? 'right' : 'left' }}>
                    {t('reset.passwordLabel')}
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
                        name="key-outline"
                        size={20}
                        color="#A4A4A4"
                        style={{ marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }}
                    />
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder={t('reset.passwordPlaceholder')}
                        placeholderTextColor="#8A8A8A"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        style={{ flex: 1, color: '#FFFFFF', textAlign: isAr ? 'right' : 'left', minHeight: 48, textAlignVertical: 'center' }}
                    />
                    <Pressable onPress={() => setShowPassword(p => !p)} hitSlop={10}>
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#A4A4A4"
                            style={{ marginLeft: isAr ? 0 : 8, marginRight: isAr ? 8 : 0 }}
                        />
                    </Pressable>
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
                        {loading ? t('reset.resetting') : t('reset.cta')}
                    </Text>
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ResetPassword;
