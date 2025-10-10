import React, { useState, useRef, useEffect, memo } from 'react';
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
    StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const COLORS = {
    darkBg: '#131313',
    darkBorder: '#1F1F1F',
    textMain: '#FFFFFF',
    textMuted: '#9CA3AF',
    pageBg: '#000000',
    modalBg: 'rgba(0,0,0,0.5)',
    white: '#FFFFFF',
    primary: '#ffffff',
    disabled: '#bbbbbb',
};

const RegisterSteamer: React.FC = () => {
    const { top } = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const [companyName, setCompanyName] = useState<'Individual' | 'Company' | ''>('');
    const [typeOpen, setTypeOpen] = useState(false);

    const submittedRef = useRef(false);
    const { handleRegisterSteamer, loading } = useAuth();

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setShowPass(false);
        setCompanyName('');
        setTypeOpen(false);
    };

    useEffect(() => {
        const unsub = navigation.addListener('blur', () => {
            if (submittedRef.current) {
                resetForm();
                submittedRef.current = false;
            }
        });
        return unsub;
    }, [navigation]);

    const onSubmit = async () => {
        if (!name || !email || !password || !phoneNumber || !companyName) {
            Alert.alert(t('registerSteamer.missing.title'), t('registerSteamer.missing.body'));
            return;
        }
        try {
            await handleRegisterSteamer({ name, email, password, phoneNumber, companyName });
            submittedRef.current = true;
            resetForm();
            Alert.alert(t('registerSteamer.success.title'), t('registerSteamer.success.body'));
        } catch (e: any) {
            Alert.alert(t('registerSteamer.error.title'), e?.response?.data?.message || t('registerSteamer.error.body'));
        }
    };

    return (
        <SafeAreaView style={styles.page}>
            <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    contentContainerStyle={[styles.scrollPad, { paddingTop: top + 70 }]}
                    keyboardShouldPersistTaps="handled"
                    // keep subviews mounted so TextInput doesn’t remount
                    removeClippedSubviews={false}
                >
                    {/* Heading */}
                    <Text style={[styles.title, { textAlign: isAr ? 'right' : 'left' }]}>
                        {t('registerSteamer.title')}
                    </Text>

                    {/* Name */}
                    <FieldLabel isAr={isAr}>{t('registerSteamer.fields.name')}</FieldLabel>
                    <InputRow
                        isAr={isAr}
                        icon="person-outline"
                        placeholder={t('registerSteamer.placeholders.name')}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        returnKeyType="next"
                    />

                    {/* Email */}
                    <Spacer />
                    <FieldLabel isAr={isAr}>{t('registerSteamer.fields.email')}</FieldLabel>
                    <InputRow
                        isAr={isAr}
                        icon="mail-outline"
                        placeholder={t('registerSteamer.placeholders.email')}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                    />

                    {/* Phone */}
                    <Spacer />
                    <FieldLabel isAr={isAr}>{t('registerSteamer.fields.phone')}</FieldLabel>
                    <InputRow
                        isAr={isAr}
                        icon="call-outline"
                        placeholder={t('registerSteamer.placeholders.phone')}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        returnKeyType="next"
                    />

                    {/* Password */}
                    <Spacer />
                    <FieldLabel isAr={isAr}>{t('registerSteamer.fields.password')}</FieldLabel>
                    <InputRow
                        isAr={isAr}
                        icon="lock-closed-outline"
                        placeholder={t('registerSteamer.placeholders.password')}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPass}
                        rightIcon={showPass ? 'eye-off-outline' : 'eye-outline'}
                        onRightIconPress={() => setShowPass(s => !s)}
                        returnKeyType="done"
                    />

                    {/* Individual / Company */}
                    <Spacer />
                    <FieldLabel isAr={isAr}>{t('registerSteamer.fields.type')}</FieldLabel>
                    <TouchableOpacity
                        onPress={() => setTypeOpen(true)}
                        activeOpacity={0.8}
                        style={[styles.inputContainer, styles.rowBetween, { flexDirection: isAr ? 'row-reverse' : 'row' }]}
                    >
                        <Text style={{ color: companyName ? COLORS.textMain : COLORS.textMuted }}>
                            {companyName
                                ? companyName === 'Individual'
                                    ? t('registerSteamer.companyType.individual')
                                    : t('registerSteamer.companyType.company')
                                : t('registerSteamer.select')}
                        </Text>
                        <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    {/* Register button */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={onSubmit}
                        disabled={loading}
                        style={[styles.submitBtn, { backgroundColor: loading ? COLORS.disabled : COLORS.white }]}
                    >
                        <Text style={styles.submitText}>
                            {loading ? t('registerSteamer.btn.registering') : t('registerSteamer.btn.register')}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Dropdown modal */}
            <Modal visible={typeOpen} transparent animationType="fade" onRequestClose={() => setTypeOpen(false)}>
                <Pressable style={styles.modalShade} onPress={() => setTypeOpen(false)}>
                    <View style={styles.modalCard}>
                        {(['Individual', 'Company'] as const).map(opt => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => {
                                    setCompanyName(opt);
                                    setTypeOpen(false);
                                }}
                                style={[
                                    styles.modalItem,
                                    { flexDirection: isAr ? 'row-reverse' : 'row' },
                                ]}
                            >
                                <Text style={[styles.modalItemText, { textAlign: isAr ? 'right' : 'left' }]}>
                                    {opt === 'Individual'
                                        ? t('registerSteamer.companyType.individual')
                                        : t('registerSteamer.companyType.company')}
                                </Text>
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

/* ---------- tiny building blocks ---------- */

const Spacer = () => <View style={{ height: 12 }} />;

const FieldLabel = ({ children, isAr }: { children: React.ReactNode; isAr: boolean }) => (
    <Text style={[styles.label, { textAlign: isAr ? 'right' : 'left' }]}>{children}</Text>
);

/** Stable, memoized input row to avoid remounts on every keystroke */
const InputRow = memo(function InputRow(props: {
    isAr: boolean;
    icon: string;
    placeholder: string;
    value: string;
    onChangeText: (v: string) => void;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    returnKeyType?: 'next' | 'done' | 'go' | 'send' | 'search' | 'default';
    secureTextEntry?: boolean;
    rightIcon?: string;
    onRightIconPress?: () => void;
}) {
    const {
        isAr,
        icon,
        placeholder,
        value,
        onChangeText,
        keyboardType,
        autoCapitalize = keyboardType === 'email-address' ? 'none' : 'sentences',
        autoCorrect = keyboardType !== 'email-address',
        returnKeyType = 'default',
        secureTextEntry,
        rightIcon,
        onRightIconPress,
    } = props;

    return (
        <View style={styles.inputContainer}>
            <View style={[styles.inputRow, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
                <Ionicons name={icon as any} size={18} color={COLORS.textMuted} />
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    returnKeyType={returnKeyType}
                    secureTextEntry={!!secureTextEntry}
                    style={[styles.textInput, { textAlign: isAr ? 'right' : 'left' }]}
                    // keep focus stable
                    blurOnSubmit={false}
                    selectionColor="#6B7280"
                />
                {rightIcon ? (
                    <TouchableOpacity onPress={onRightIconPress} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                        <Ionicons name={rightIcon as any} size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
});

/* ---------- styles (stable objects) ---------- */

const styles = StyleSheet.create({
    flex: { flex: 1 },
    page: { flex: 1, backgroundColor: COLORS.pageBg },
    scrollPad: { paddingHorizontal: 16, paddingBottom: 24 },
    title: { color: COLORS.textMain, fontSize: 28, fontWeight: '700', marginBottom: 18 },
    label: { color: '#bbbbbb', fontSize: 12, marginBottom: 6 },

    inputContainer: {
        height: 52,
        borderRadius: 12,
        backgroundColor: COLORS.darkBg,
        borderWidth: 1,
        borderColor: COLORS.darkBorder,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    inputRow: {
        flex: 1,
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        paddingVertical: 12,
        color: COLORS.textMain,
        marginHorizontal: 10, // instead of 'gap'
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    submitBtn: {
        marginTop: 22,
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: { color: '#111', fontWeight: '700' },

    modalShade: { flex: 1, backgroundColor: COLORS.modalBg },
    modalCard: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 40,
        backgroundColor: '#111',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.darkBorder,
        paddingVertical: 6,
    },
    modalItem: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalItemText: { color: COLORS.textMain, flex: 1 },
});
