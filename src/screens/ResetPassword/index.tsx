import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert } from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';
import { useRoute } from '@react-navigation/native';

const ResetPassword: React.FC<any> = ({ navigation }) => {
    const route = useRoute<any>();
    const initialEmail = route?.params?.email || '';
    const { loading, handleResetPasswordWithCode } = useAuth();

    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');

    const submit = async () => {
        if (!email || !code || !password) {
            return Alert.alert('Missing', 'Please fill all fields.');
        }
        try {
            await handleResetPasswordWithCode({ email, code, password });
            Alert.alert('Success', 'Password has been reset.', [
                { text: 'OK', onPress: () => navigation.replace('Login') },
            ]);
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.message || 'Failed to reset password.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 40 }}>
                <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 18 }}>
                    Reset Password
                </Text>

                <Text style={{ color: '#fff', marginBottom: 8 }}>Email Address</Text>
                <Input value={email} onChangeText={setEmail} placeholder="Enter Email Address" keyboardType="email-address" />

                <View style={{ height: 12 }} />
                <Text style={{ color: '#fff', marginBottom: 8 }}>Verification Code</Text>
                <Input value={code} onChangeText={setCode} placeholder="6-digit code" keyboardType="number-pad" />

                <View style={{ height: 12 }} />
                <Text style={{ color: '#fff', marginBottom: 8 }}>New Password</Text>
                <Input value={password} onChangeText={setPassword} placeholder="Enter new password" passwordInput />

                <Button
                    className="mt-5"
                    variant="primary"
                    style={{ backgroundColor: 'white', opacity: loading ? 0.7 : 1 }}
                    onPress={submit}
                    disabled={loading}
                >
                    <Text style={{ color: '#000', fontSize: 16, fontWeight: '600' }}>
                        {loading ? 'Resetting…' : 'Reset Password'}
                    </Text>
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ResetPassword;
