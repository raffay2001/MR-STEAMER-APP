import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const BRAND = '#223671';

export default function TermsAndConditions() {
    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');
    const align = { textAlign: isAr ? 'right' : 'left' } as const;

    const responsibilitiesItems = t('legal.terms.sections.responsibilitiesItems', {
        returnObjects: true,
    }) as string[];

    const Bullet = ({ text }: { text: string }) => (
        <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', marginTop: 8 }}>
            <Text style={{ color: BRAND, marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }}>•</Text>
            <Text style={{ flex: 1, fontSize: 14, lineHeight: 20, color: '#374151', ...align }}>
                {text}
            </Text>
        </View>
    );

    const SectionTitle = ({ children }: { children: string }) => (
        <Text style={{ marginTop: 14, fontSize: 15, fontWeight: '700', color: '#111827', ...align }}>
            {children}
        </Text>
    );

    const Para = ({ children }: { children: string }) => (
        <Text style={{ marginTop: 8, fontSize: 14, lineHeight: 20, color: '#374151', ...align }}>
            {children}
        </Text>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: '700', color: BRAND, ...align }}>
                        {t('legal.terms.title')}
                    </Text>

                    <SectionTitle>{t('legal.terms.sections.acceptanceTitle')}</SectionTitle>
                    <Para>{t('legal.terms.sections.acceptanceBody')}</Para>

                    <SectionTitle>{t('legal.terms.sections.servicesTitle')}</SectionTitle>
                    <Para>{t('legal.terms.sections.servicesBody')}</Para>

                    <SectionTitle>{t('legal.terms.sections.responsibilitiesTitle')}</SectionTitle>
                    {responsibilitiesItems.map((it, idx) => (
                        <Bullet key={`r-${idx}`} text={it} />
                    ))}

                    <SectionTitle>{t('legal.terms.sections.paymentTitle')}</SectionTitle>
                    <Para>{t('legal.terms.sections.paymentBody')}</Para>

                    <SectionTitle>{t('legal.terms.sections.cancelTitle')}</SectionTitle>
                    <Para>{t('legal.terms.sections.cancelBody')}</Para>

                    <SectionTitle>{t('legal.terms.sections.liabilityTitle')}</SectionTitle>
                    <Para>{t('legal.terms.sections.liabilityBody')}</Para>

                    <SectionTitle>{t('legal.terms.sections.changesTitle')}</SectionTitle>
                    <Para>{t('legal.terms.sections.changesBody')}</Para>

                    <SectionTitle>{t('legal.terms.sections.contactTitle')}</SectionTitle>
                    <Para>{t('legal.terms.sections.contactBody')}</Para>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
