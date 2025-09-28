import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert } from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword: React.FC<any> = ({ navigation }) => {
    const { loading, handleRequestPasswordReset } = useAuth();
    const [email, setEmail] = useState('');

    const submit = async () => {
        if (!email) return Alert.alert('Missing', 'Please enter your email.');
        try {
            await handleRequestPasswordReset(email);
            // go to Reset with email prefilled
            navigation.navigate('ResetPassword', { email });
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.message || 'Failed to send code.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 40 }}>
                <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 18 }}>
                    Forgot Password
                </Text>

                <Text style={{ color: '#A4A4A4', marginBottom: 12 }}>
                    Enter your account email. We’ll send a verification code.
                </Text>

                <Text style={{ color: '#fff', marginBottom: 8 }}>Email Address</Text>
                <Input
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter Email Address"
                    keyboardType="email-address"
                />

                <Button
                    className="mt-5"
                    variant="primary"
                    style={{ backgroundColor: 'white', opacity: loading ? 0.7 : 1 }}
                    onPress={submit}
                    disabled={loading}
                >
                    <Text style={{ color: '#000', fontSize: 16, fontWeight: '600' }}>
                        {loading ? 'Sending…' : 'Send Code'}
                    </Text>
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ForgotPassword;
