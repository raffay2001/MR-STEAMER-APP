// src/screens/Legal/HireUs.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { useServices } from '../../hooks/useServices';

const BRAND = '#223671';

export default function HireUs() {
  const { t } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const { fetchServices, services, loading } = useServices();

  React.useEffect(() => {
    fetchServices({ page: 1, limit: 50 }).catch(() => { });
  }, [fetchServices]);

  const align = { textAlign: isAr ? 'right' : 'left' } as const;

  const Bullet = ({ text }: { text: string }) => (
    <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', marginTop: 6 }}>
      <Text style={{ color: BRAND, marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }}>•</Text>
      <Text style={[styles.body, { flex: 1 }, align]}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.imageWrap}>
            <Image
              source={require('../../assets/images/HireUs.png')}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <Text style={[styles.title, align]}>{t('hireUs.title')}</Text>
          <Text style={[styles.body, align]}>{t('hireUs.body')}</Text>

          <Text style={[styles.sectionTitle, align]}>
            {t('hireUs.servicesTitle', { defaultValue: isAr ? 'الخدمات المتاحة' : 'Available Services' })}
          </Text>

          {loading ? (
            <View style={{ marginTop: 12 }}>
              <ActivityIndicator />
            </View>
          ) : services.length === 0 ? (
            <Text style={[styles.body, { marginTop: 8 }, align]}>
              {t('hireUs.noServices', { defaultValue: isAr ? 'لا توجد خدمات حالياً.' : 'No services found.' })}
            </Text>
          ) : (
            services.map((s) => (
              <View key={s.id} style={styles.serviceCard}>
                <Text style={[styles.serviceName, align]}>{s.name}</Text>
                {!!s.description && <Text style={[styles.body, align]}>{s.description}</Text>}

                {(s.offerings || []).length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={[styles.offeringsTitle, align]}>
                      {t('hireUs.offeringsTitle', { defaultValue: isAr ? 'يشمل' : 'Includes' })}
                    </Text>
                    {(s.offerings || [])
                      .filter((o) => o?.name)
                      .slice()
                      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                      .map((o) => (
                        <Bullet key={o.id} text={o.name} />
                      ))}
                  </View>
                )}
              </View>
            ))
          )}
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
  imageWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  image: { width: '100%', height: '100%' },

  title: { fontSize: 18, fontWeight: '700', color: BRAND },
  sectionTitle: { marginTop: 14, fontSize: 15, fontWeight: '700', color: '#111827' },
  body: { marginTop: 8, fontSize: 14, lineHeight: 20, color: '#374151' },

  serviceCard: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#fff',
  },
  serviceName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  offeringsTitle: { marginTop: 8, fontSize: 13, fontWeight: '700', color: '#111827' },
});
