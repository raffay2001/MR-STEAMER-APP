import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Modal,
    Pressable,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

const RegisterSteamer: React.FC = () => {
    const { top } = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState<'Individual' | 'Company' | ''>('');
    const [typeOpen, setTypeOpen] = useState(false);

    const submittedRef = useRef(false);

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setCompanyName('');
        setTypeOpen(false);
    };

    const { handleRegisterSteamer, loading } = useAuth();

    useEffect(() => {
        const unsub = navigation.addListener('blur', () => {
            if (submittedRef.current) {
                resetForm();
                submittedRef.current = false;
            }
        });
        return unsub;
    }, [navigation]);

    const FieldLabel = ({ children }: { children: React.ReactNode }) => (
        <Text style={{ color: '#bbb', fontSize: 12, marginBottom: 6 }}>{children}</Text>
    );

    const inputStyle = {
        height: 48,
        borderRadius: 10,
        paddingHorizontal: 14 as const,
        color: '#fff',
        backgroundColor: '#0B0B0B',
        borderWidth: 1,
        borderColor: '#1F1F1F',
    };

    const onSubmit = async () => {
        if (!name || !email || !password || !phoneNumber || !companyName) {
            Alert.alert('Missing info', 'Please fill all fields.');
            return;
        }
        try {
            await handleRegisterSteamer({
                name,
                email,
                password,
                phoneNumber,
                companyName: companyName as 'Individual' | 'Company',
            });

            submittedRef.current = true;
            resetForm();

            Alert.alert('Success', 'Steamer registered successfully!');
            // navigation.navigate('Home');
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.message || 'Failed to register.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
            >
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: top + 70, paddingBottom: 24 }}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="none"
                >
                    {/* Heading */}
                    <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 18 }}>
                        Register With Us
                    </Text>

                    {/* Name */}
                    <FieldLabel>Name</FieldLabel>
                    <TextInput
                        placeholder="Enter Name"
                        placeholderTextColor="#9CA3AF"
                        value={name}
                        onChangeText={setName}
                        style={inputStyle}
                        autoCapitalize="words"
                        blurOnSubmit={false}
                        returnKeyType="next"
                    />

                    {/* Email */}
                    <View style={{ height: 12 }} />
                    <FieldLabel>Email</FieldLabel>
                    <TextInput
                        placeholder="Enter Email"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={inputStyle}
                        blurOnSubmit={false}
                        returnKeyType="next"
                    />

                    {/* Phone */}
                    <View style={{ height: 12 }} />
                    <FieldLabel>Phone Number</FieldLabel>
                    <TextInput
                        placeholder="Enter Phone Number"
                        placeholderTextColor="#9CA3AF"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        style={inputStyle}
                        blurOnSubmit={false}
                        returnKeyType="next"
                    />

                    {/* Password */}
                    <View style={{ height: 12 }} />
                    <FieldLabel>Password</FieldLabel>
                    <TextInput
                        placeholder="Enter Password"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={inputStyle}
                        blurOnSubmit={false}
                        returnKeyType="done"
                    />

                    {/* Individual / Company */}
                    <View style={{ height: 12 }} />
                    <FieldLabel>Individual/Company</FieldLabel>
                    <TouchableOpacity
                        onPress={() => setTypeOpen(true)}
                        activeOpacity={0.8}
                        style={{
                            height: 48,
                            borderRadius: 10,
                            backgroundColor: '#0B0B0B',
                            paddingHorizontal: 14,
                            borderWidth: 1,
                            borderColor: '#1F1F1F',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={{ color: companyName ? '#fff' : '#9CA3AF' }}>
                            {companyName || 'Select'}
                        </Text>
                        <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Register button */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={onSubmit}
                        disabled={loading}
                        style={{
                            marginTop: 22,
                            height: 48,
                            borderRadius: 10,
                            backgroundColor: loading ? '#bbb' : '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: '#111', fontWeight: '700' }}>
                            {loading ? 'Registering…' : 'Register'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Dropdown modal */}
            <Modal
                visible={typeOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setTypeOpen(false)}
            >
                <Pressable
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onPress={() => setTypeOpen(false)}
                >
                    <View
                        style={{
                            position: 'absolute',
                            left: 16,
                            right: 16,
                            bottom: 40,
                            backgroundColor: '#111',
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#1F1F1F',
                            paddingVertical: 6,
                        }}
                    >
                        {(['Individual', 'Company'] as const).map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => {
                                    setCompanyName(opt);
                                    setTypeOpen(false);
                                }}
                                style={{ paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Text style={{ color: '#fff', flex: 1 }}>{opt}</Text>
                                {companyName === opt && <Ionicons name="checkmark" size={18} color="#22C55E" />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
};

export default RegisterSteamer;
