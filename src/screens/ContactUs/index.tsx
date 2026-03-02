// src/screens/Legal/ContactUs.tsx
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { useContact } from '../../hooks/useContact';

const BRAND = '#223671';

export default function ContactUs() {
    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');

    const { submitContact, loading } = useContact();

    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [query, setQuery] = React.useState('');
    const [queryWarn, setQueryWarn] = React.useState<string | null>(null);

    const onSubmit = async () => {
        const payload = {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            query: query.trim(),
        };

        if (payload.query.length < 10) {
            const msg = isAr
                ? 'الرجاء كتابة رسالة لا تقل عن 10 أحرف.'
                : 'Please write at least 10 characters.';
            setQueryWarn(msg);
            return;
        }

        if (!payload.name || !payload.phone || !payload.email || !payload.query) {
            Alert.alert(t('legal.contact.missingTitle'), t('legal.contact.missingBody'));
            return;
        }

        console.log('🟦 ContactUs submit payload:', payload);

        try {
            const res = await submitContact(payload);

            Alert.alert(t('legal.contact.successTitle'), t('legal.contact.successBody'));
            setName('');
            setPhone('');
            setEmail('');
            setQuery('');
        } catch (e: any) {
            const status = e?.response?.status;
            const data = e?.response?.data;
            const message = e?.message;

            Alert.alert(
                t('legal.contact.errorTitle'),
                data?.message || message || t('legal.contact.errorBody'),
            );
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <Text style={[styles.title, { textAlign: isAr ? 'right' : 'left' }]}>
                        {t('legal.contact.title')}
                    </Text>

                    <Text style={[styles.subtitle, { textAlign: isAr ? 'right' : 'left' }]}>
                        {t('legal.contact.subtitle')}
                    </Text>

                    <Text style={[styles.label, { textAlign: isAr ? 'right' : 'left' }]}>
                        {t('legal.contact.fields.name')}
                    </Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder={t('legal.contact.placeholders.name')}
                        placeholderTextColor="#9CA3AF"
                        style={[styles.input, { textAlign: isAr ? 'right' : 'left' }]}
                    />

                    <Text style={[styles.label, { textAlign: isAr ? 'right' : 'left' }]}>
                        {t('legal.contact.fields.phone')}
                    </Text>
                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        placeholder={t('legal.contact.placeholders.phone')}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        style={[styles.input, { textAlign: isAr ? 'right' : 'left' }]}
                    />

                    <Text style={[styles.label, { textAlign: isAr ? 'right' : 'left' }]}>
                        {t('legal.contact.fields.email')}
                    </Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder={t('legal.contact.placeholders.email')}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[styles.input, { textAlign: isAr ? 'right' : 'left' }]}
                    />

                    <Text style={[styles.label, { textAlign: isAr ? 'right' : 'left' }]}>
                        {t('legal.contact.fields.query')}
                    </Text>
                    <TextInput
                        value={query}
                        onChangeText={(v) => {
                            setQuery(v);
                            if (queryWarn) setQueryWarn(null);
                        }}
                        placeholder={t('legal.contact.placeholders.query')}
                        placeholderTextColor="#9CA3AF"
                        multiline
                        style={[
                            styles.input,
                            styles.textArea,
                            { textAlign: isAr ? 'right' : 'left' },
                        ]}
                    />

                    <TouchableOpacity
                        activeOpacity={0.9}
                        disabled={loading}
                        onPress={onSubmit}
                        style={[styles.btn, { backgroundColor: loading ? '#94A3B8' : BRAND }]}
                    >
                        <Text style={styles.btnText}>
                            {loading ? t('legal.contact.sending') : t('legal.contact.send')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F3F4F6' },
    container: { padding: 16, paddingBottom: 32 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    title: { fontSize: 18, fontWeight: '700', color: BRAND },
    subtitle: { marginTop: 10, fontSize: 14, lineHeight: 20, color: '#374151' },
    label: { marginTop: 12, fontSize: 13, fontWeight: '700', color: '#111827' },
    input: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#fff',
    },
    textArea: { minHeight: 120, textAlignVertical: 'top' },
    btn: {
        marginTop: 16,
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    warn: { marginTop: 6, fontSize: 12, color: '#DC2626' },
});
