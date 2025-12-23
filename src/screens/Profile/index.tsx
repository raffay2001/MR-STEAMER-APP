// src/screens/Profile/Profile.tsx
import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    I18nManager,
} from 'react-native';
import { useUser } from '../../hooks/useUser';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUserData } from '../../hooks/useAuthStorage';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const BRAND = '#2D4795';

const Profile: React.FC = () => {
    const { t } = useTranslation();
    const isRTL = I18nManager.isRTL || i18n.language?.startsWith('ar');
    const rowDir = { flexDirection: isRTL ? ('row-reverse' as const) : ('row' as const) };
    const textAlign = { textAlign: isRTL ? ('right' as const) : ('left' as const) };

    const [user, setUser] = React.useState<any>(null);
    const [userLoading, setUserLoading] = React.useState(true);

    const { loading, handleChangePassword } = useUser();

    const [pwdOpen, setPwdOpen] = React.useState(false);
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const [showOld, setShowOld] = React.useState(false);
    const [showNew, setShowNew] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            try {
                setUserLoading(true);
                const u = await getUserData();
                setUser(u);
            } catch (e) {
                setUser(null);
            } finally {
                setUserLoading(false);
            }
        })();
    }, []);

    const email = user?.email || '—';
    const name = user?.name || t('profile.guest');

    const getInitials = (fullName?: string) => {
        const n = (fullName || '').trim();
        if (!n) return 'G';
        const parts = n.split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] || '';
        const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] || '') : (parts[0]?.[1] || '');
        return (first + second).toUpperCase();
    };

    const initials = getInitials(user?.name);

    const resetPwdState = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowOld(false);
        setShowNew(false);
        setShowConfirm(false);
    };

    const onSubmitChange = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert(t('profile.missingInfoTitle'), t('profile.missingInfoMsg'));
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert(t('profile.mismatchTitle'), t('profile.mismatchMsg'));
            return;
        }

        try {
            await handleChangePassword({ oldPassword, newPassword });
            Alert.alert(t('profile.successTitle'), t('profile.passwordUpdated'));
            resetPwdState();
            setPwdOpen(false);
        } catch (e: any) {
            Alert.alert(t('profile.errorTitle'), e?.response?.data?.message || t('profile.passwordUpdateFailed'));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BRAND }}>
            {/* Top header */}
            <View style={{ backgroundColor: BRAND, height: 180 }}>
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
                        <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800' }}>{initials}</Text>
                    </View>

                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20, marginTop: 8 }}>{name}</Text>

                    <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>{email}</Text>
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
                {/* Card */}
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
                    <View style={{ ...rowDir, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 14, fontWeight: '400', ...textAlign }}>
                            {t('profile.username')}
                        </Text>

                        {userLoading ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <Text style={{ color: '#000', opacity: 0.5, fontSize: 12, fontWeight: '400' }}>{email}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={() => setPwdOpen(true)}
                        style={{ marginTop: 18, alignItems: 'center', justifyContent: 'center', width: '100%' }}
                    >
                        <Text style={{ color: '#000', opacity: 0.7, fontSize: 14, fontWeight: '400', textDecorationLine: 'underline' }}>
                            {t('profile.changePassword')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Share App */}
                <TouchableOpacity
                    onPress={() => Alert.alert(t('profile.shareAppTitle'), t('profile.comingSoon'))}
                    style={{
                        backgroundColor: BRAND,
                        height: 52,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        marginTop: 30,
                    }}
                >
                    <Ionicons
                        name="share-social-outline"
                        size={18}
                        color="#fff"
                        style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}
                    />
                    <Text style={{ color: '#fff', fontWeight: '700' }}>{t('profile.shareApp')}</Text>
                </TouchableOpacity>
            </View>

            {/* Change Password Modal */}
            <Modal
                visible={pwdOpen}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    setPwdOpen(false);
                    resetPwdState();
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ width: '90%', maxWidth: 480, backgroundColor: '#fff', borderRadius: 14, padding: 16 }}>
                        <Text style={{ color: '#111', fontSize: 16, fontWeight: '700', marginBottom: 12, ...textAlign }}>
                            {t('profile.changePassword')}
                        </Text>

                        {/* Old */}
                        <Text style={{ color: '#555', marginBottom: 6, ...textAlign }}>{t('profile.oldPassword')}</Text>
                        <View style={{ position: 'relative', marginBottom: 10 }}>
                            <TextInput
                                placeholder={t('profile.enterOldPassword')}
                                placeholderTextColor="#9CA3AF"
                                value={oldPassword}
                                onChangeText={setOldPassword}
                                secureTextEntry={!showOld}
                                style={{
                                    height: 46,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    paddingHorizontal: 12,
                                    paddingRight: 42,
                                    color: '#111',
                                    backgroundColor: '#fff',
                                    textAlign: isRTL ? 'right' : 'left',
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowOld(p => !p)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={{
                                    position: 'absolute',
                                    right: isRTL ? undefined : 10,
                                    left: isRTL ? 10 : undefined,
                                    top: 10,
                                }}
                            >
                                <Ionicons name={showOld ? 'eye-off' : 'eye'} size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* New */}
                        <Text style={{ color: '#555', marginBottom: 6, ...textAlign }}>{t('profile.newPassword')}</Text>
                        <View style={{ position: 'relative', marginBottom: 10 }}>
                            <TextInput
                                placeholder={t('profile.enterNewPassword')}
                                placeholderTextColor="#9CA3AF"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNew}
                                style={{
                                    height: 46,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    paddingHorizontal: 12,
                                    paddingRight: 42,
                                    color: '#111',
                                    backgroundColor: '#fff',
                                    textAlign: isRTL ? 'right' : 'left',
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowNew(p => !p)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={{
                                    position: 'absolute',
                                    right: isRTL ? undefined : 10,
                                    left: isRTL ? 10 : undefined,
                                    top: 10,
                                }}
                            >
                                <Ionicons name={showNew ? 'eye-off' : 'eye'} size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm */}
                        <Text style={{ color: '#555', marginBottom: 6, ...textAlign }}>{t('profile.confirmPassword')}</Text>
                        <View style={{ position: 'relative', marginBottom: 14 }}>
                            <TextInput
                                placeholder={t('profile.reenterNewPassword')}
                                placeholderTextColor="#9CA3AF"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirm}
                                style={{
                                    height: 46,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    paddingHorizontal: 12,
                                    paddingRight: 42,
                                    color: '#111',
                                    backgroundColor: '#fff',
                                    textAlign: isRTL ? 'right' : 'left',
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirm(p => !p)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={{
                                    position: 'absolute',
                                    right: isRTL ? undefined : 10,
                                    left: isRTL ? 10 : undefined,
                                    top: 10,
                                }}
                            >
                                <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Buttons */}
                        <View style={{ ...rowDir, justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setPwdOpen(false);
                                    resetPwdState();
                                }}
                                disabled={loading}
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 14,
                                    marginRight: !isRTL ? 8 : 0,
                                    marginLeft: isRTL ? 8 : 0,
                                }}
                            >
                                <Text style={{ color: '#6B7280', fontWeight: '600' }}>{t('profile.cancel')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onSubmitChange}
                                disabled={loading}
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 18,
                                    borderRadius: 10,
                                    backgroundColor: BRAND,
                                    opacity: loading ? 0.7 : 1,
                                }}
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>{t('profile.update')}</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

export default Profile;
