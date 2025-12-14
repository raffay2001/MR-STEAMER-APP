import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useUser } from '../../hooks/useUser';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUserData } from '../../hooks/useAuthStorage';
import ProfileImage from '../../assets/images/profile.png';

const Profile: React.FC = () => {
    const [user, setUser] = React.useState<any>(null);
    React.useEffect(() => { (async () => setUser(await getUserData()))(); }, []);

    const { loading, handleChangePassword } = useUser();

    const [pwdOpen, setPwdOpen] = React.useState(false);
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const [showOld, setShowOld] = React.useState(false);
    const [showNew, setShowNew] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);

    const pts = Number(user?.pts ?? 0);
    const balance = Number(user?.balance ?? 0);
    const email = user?.email || '—';
    const name = user?.name || 'Guest';

    const getInitials = (fullName?: string) => {
        const n = (fullName || '').trim();
        if (!n) return 'G';
        const parts = n.split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] || '';
        const second =
            parts.length > 1 ? (parts[parts.length - 1]?.[0] || '') : (parts[0]?.[1] || '');
        return (first + second).toUpperCase();
    };

    const initials = getInitials(user?.name);

    const onSubmitChange = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Missing info', 'Please fill all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Mismatch', 'New password and confirm password do not match.');
            return;
        }
        try {
            await handleChangePassword({ oldPassword, newPassword });
            Alert.alert('Success', 'Password updated successfully.');
            // reset & close
            setOldPassword(''); setNewPassword(''); setConfirmPassword('');
            setPwdOpen(false);
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.message || 'Failed to update password.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#2D4795' }}>
            <View style={{ backgroundColor: '#2D4795', height: 180 }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 16, marginTop: 20 }}>
                    <View
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: 'rgba(255,255,255,0.18)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 2,
                            borderColor: 'rgba(255,255,255,0.35)',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800' }}>
                            {initials}
                        </Text>
                    </View>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20 }}>
                        {name}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>
                        {email}
                    </Text>
                </View>
            </View>

            {/* White section */}
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: 36,
                    borderTopRightRadius: 36,
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    marginTop: -20,
                    overflow: 'hidden',
                }}
            >
                {/* Card 1: Wallet / Username / Change Password */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#ECECEC',
                        padding: 16,
                        shadowColor: '#000',
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 2,
                        marginTop: 12,
                    }}
                >
                    {/* Wallet row */}
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 16, fontWeight: '500' }}>Wallet</Text>
                        <Text style={{ color: '#000', fontSize: 14, fontWeight: '400' }}>{pts}pts</Text>
                    </View>

                    <View style={{ height: 1, backgroundColor: '#E7E7E7', marginVertical: 12 }} /> */}

                    {/* Username row */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 14, fontWeight: '400' }}>Username</Text>
                        <Text className='text-black opacity-50 text-[12px] font-normal'>{email}</Text>
                    </View>

                    {/* Change password */}
                    <TouchableOpacity
                        onPress={() => setPwdOpen(true)}
                        className='mt-5 flex justify-center items-center w-full'
                    >
                        <Text className='text-black opacity-70 text-[14px] font-normal underline'>Change Password</Text>
                    </TouchableOpacity>
                </View>

                {/* Card 2: Remaining Balance */}
                {/* <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#ECECEC',
                        padding: 16,
                        marginTop: 14,
                        shadowColor: '#000',
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 2,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 14, fontWeight: '500' }}>Remaining Balance</Text>
                        <Text style={{ color: '#000', fontSize: 14, fontWeight: '500' }}>${balance.toFixed(0)}</Text>
                    </View>

                    <View style={{ height: 1, backgroundColor: '#EAEAEA', marginVertical: 12 }} />

                    <TouchableOpacity
                        onPress={() => Alert.alert('Send gifts', 'Coming soon')}
                        style={{
                            alignSelf: 'center',
                            backgroundColor: '#16A34A',
                            paddingHorizontal: 18,
                            height: 34,
                            borderRadius: 17,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '700' }}>Send gifts</Text>
                    </TouchableOpacity>
                </View> */}

                <TouchableOpacity
                    onPress={() => Alert.alert('Share App', 'Coming soon')}
                    style={{
                        backgroundColor: '#2D4795',
                        height: 52,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        marginTop: 30,
                    }}
                >
                    <Ionicons name="share-social-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Share App</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={pwdOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setPwdOpen(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
                >
                    <View style={{ width: '90%', maxWidth: 480, backgroundColor: '#fff', borderRadius: 14, padding: 16 }}>
                        <Text style={{ color: '#111', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Change Password</Text>

                        <Text style={{ color: '#555', marginBottom: 6 }}>Old Password</Text>
                        <View style={{ position: 'relative', marginBottom: 10 }}>
                            <TextInput
                                placeholder="Enter old password"
                                placeholderTextColor="#9CA3AF"
                                value={oldPassword}
                                onChangeText={setOldPassword}
                                secureTextEntry={!showOld}
                                style={{
                                    height: 46, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB',
                                    paddingHorizontal: 12, paddingRight: 42, color: '#111', backgroundColor: '#fff'
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowOld(p => !p)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={{ position: 'absolute', right: 10, top: 10 }}
                            >
                                <Ionicons name={showOld ? 'eye-off' : 'eye'} size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ color: '#555', marginBottom: 6 }}>New Password</Text>
                        <View style={{ position: 'relative', marginBottom: 10 }}>
                            <TextInput
                                placeholder="Enter new password"
                                placeholderTextColor="#9CA3AF"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNew}
                                style={{
                                    height: 46, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB',
                                    paddingHorizontal: 12, paddingRight: 42, color: '#111', backgroundColor: '#fff'
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowNew(p => !p)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={{ position: 'absolute', right: 10, top: 10 }}
                            >
                                <Ionicons name={showNew ? 'eye-off' : 'eye'} size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ color: '#555', marginBottom: 6 }}>Confirm Password</Text>
                        <View style={{ position: 'relative', marginBottom: 14 }}>
                            <TextInput
                                placeholder="Re-enter new password"
                                placeholderTextColor="#9CA3AF"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirm}
                                style={{
                                    height: 46, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB',
                                    paddingHorizontal: 12, paddingRight: 42, color: '#111', backgroundColor: '#fff'
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirm(p => !p)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={{ position: 'absolute', right: 10, top: 10 }}
                            >
                                <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => { setPwdOpen(false); }}
                                disabled={loading}
                                style={{ paddingVertical: 10, paddingHorizontal: 14, marginRight: 8 }}
                            >
                                <Text style={{ color: '#6B7280', fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onSubmitChange}
                                disabled={loading}
                                style={{
                                    paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10,
                                    backgroundColor: '#2D4795', opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={{ color: '#fff', fontWeight: '700' }}>Update</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

export default Profile;
