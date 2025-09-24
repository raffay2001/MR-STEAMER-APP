import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Modal,
    Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RegisterSteamer: React.FC = () => {
    const { top } = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState<'Individual' | 'Company' | ''>('');
    const [typeOpen, setTypeOpen] = useState(false);

    const FieldLabel = ({ children }: { children: React.ReactNode }) => (
        <Text style={{ color: '#bbb', fontSize: 12, marginBottom: 6 }}>{children}</Text>
    );

    const Input = (p: any) => (
        <LinearGradient
            colors={['#141414', '#0B0B0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#1F1F1F',
            }}
        >
            <TextInput
                {...p}
                placeholderTextColor="#9CA3AF"
                style={{
                    height: 48,
                    paddingHorizontal: 14,
                    color: '#fff',
                    backgroundColor: 'transparent',
                }}
            />
        </LinearGradient>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: top + 70 }}>
                {/* Heading */}
                <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 18 }}>
                    Register With Us
                </Text>

                {/* Name */}
                <FieldLabel>Name</FieldLabel>
                <Input placeholder="Enter Name" value={name} onChangeText={setName} />

                {/* Email */}
                <View style={{ height: 12 }} />
                <FieldLabel>Email</FieldLabel>
                <Input placeholder="Enter Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

                {/* Mobile */}
                <View style={{ height: 12 }} />
                <FieldLabel>Mobile Number</FieldLabel>
                <Input placeholder="Enter Mobile Number" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

                {/* Password */}
                <View style={{ height: 12 }} />
                <FieldLabel>Password</FieldLabel>
                <Input placeholder="Enter Password" value={password} onChangeText={setPassword} secureTextEntry />

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
                    <Text style={{ color: type ? '#fff' : '#9CA3AF' }}>{type || 'Select'}</Text>
                    <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {/* Register button */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => { }}
                    style={{
                        marginTop: 22,
                        height: 48,
                        borderRadius: 10,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ color: '#111', fontWeight: '700' }}>Register</Text>
                </TouchableOpacity>
            </View>

            {/* Simple dropdown modal */}
            <Modal visible={typeOpen} transparent animationType="fade" onRequestClose={() => setTypeOpen(false)}>
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setTypeOpen(false)}>
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
                                    setType(opt);
                                    setTypeOpen(false);
                                }}
                                style={{ paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Text style={{ color: '#fff', flex: 1 }}>{opt}</Text>
                                {type === opt && <Ionicons name="checkmark" size={18} color="#22C55E" />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
};

export default RegisterSteamer;
