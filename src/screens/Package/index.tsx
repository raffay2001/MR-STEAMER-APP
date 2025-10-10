import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { usePackage } from '../../hooks/usePackage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

type RouteParams = {
    packageIds?: string[];
    name?: string;
};

const Package: React.FC = () => {
    const route = useRoute<any>();
    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');
    const navigation = useNavigation<any>();
    const { packageIds = [], name = 'Package' } = (route?.params || {}) as RouteParams;
    const { loading, fetchPackageById } = usePackage();
    const [items, setItems] = React.useState<any[]>([]);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            if (!packageIds.length) return;
            try {
                const res = await Promise.all(packageIds.map(id => fetchPackageById(id)));
                console.log('[Package] details:', res);
                if (mounted) setItems(res.filter(Boolean));
                if (mounted && packageIds.length > 0) setSelectedId(packageIds[0]);
            } catch {
                if (mounted) setItems([]);
            }
        })();
        return () => { mounted = false; };
    }, [packageIds, fetchPackageById]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
                {/* <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>{name}</Text> */}
                <Text style={{ marginTop: 8, color: '#000', fontSize: 14, fontWeight: '400', textAlign: isAr ? 'right' : 'left' }}>
                    {t('package.choose')}
                </Text>

                {loading && items.length === 0 ? (
                    <View style={{ marginTop: 20 }}>
                        <ActivityIndicator />
                    </View>
                ) : items.length === 0 ? (
                    <Text style={{ marginTop: 16, color: '#666', textAlign: isAr ? 'right' : 'left' }}>
                        {t('package.noItems')}
                    </Text>
                ) : (
                    items.map(it => {
                        const active = selectedId === it.id;
                        return (
                            <Pressable
                                key={it.id}
                                onPress={() => setSelectedId(it.id)}
                                style={{
                                    marginTop: 32,
                                    backgroundColor: '#fff',
                                    borderRadius: 25,
                                    paddingHorizontal: 14,
                                    paddingTop: 12,
                                    paddingBottom: 10,
                                    borderWidth: 1,
                                    borderColor: active ? '#2CB67D' : '#EEE',
                                    shadowColor: '#000',
                                    shadowOpacity: 0.05,
                                    shadowRadius: 6,
                                    shadowOffset: { width: 0, height: 2 },
                                    elevation: 2,
                                }}
                            >
                                {/* Header row: radio/check + type */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                    {active ? (
                                        <View
                                            style={{
                                                width: 22,
                                                height: 22,
                                                borderRadius: 6,
                                                backgroundColor: '#2CB67D',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: 10,
                                            }}
                                        >
                                            <Ionicons name="checkmark" size={14} color="#fff" />
                                        </View>
                                    ) : (
                                        <View
                                            style={{
                                                width: 22,
                                                height: 22,
                                                borderRadius: 6,
                                                borderWidth: 1.5,
                                                borderColor: '#CFCFCF',
                                                marginRight: 10,
                                            }}
                                        />
                                    )}
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#232323' }}>
                                        {it.type || it.name}
                                    </Text>
                                </View>

                                {/* Divider */}
                                <View style={{ height: 1, backgroundColor: '#EFEFEF' }} />

                                {/* Body: bullet + detail/price + link */}
                                <View style={{ paddingVertical: 12 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="checkmark-done" size={16} color={active ? "#16A34A" : "#9CA3AF"} />
                                        <Text style={{ marginLeft: 8, color: '#111', fontSize: 14 }}>
                                            {(it.detail)}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                        <Ionicons name="checkmark-done" size={16} color={active ? "#16A34A" : "#9CA3AF"} />
                                        <Text style={{ marginLeft: 8, color: '#111', fontSize: 14 }}>
                                            {' SAR ' + (it.pricing ?? 0)}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        disabled={!active}
                                        onPress={() => active && navigation.navigate('YourBooking', { packageId: it.id })}
                                        style={{
                                            marginTop: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%',
                                            opacity: active ? 1 : 0.5,
                                        }}
                                    >
                                        <Text style={{ color: active ? '#2D4795' : '#9CA3AF', fontWeight: '500', textDecorationLine: 'underline', fontSize: 16 }}>
                                            {t('package.cta')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Package;
