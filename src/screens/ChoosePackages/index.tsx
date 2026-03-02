import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePackage } from '../../hooks/usePackage';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const ChoosePackages: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');
    const { loading, fetchMyUserPackages } = usePackage();
    const [items, setItems] = React.useState<any[]>([]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: t('choosePackages.title'),
            headerTitleAlign: 'center',
        });
    }, [navigation, t]);

    React.useEffect(() => {
        (async () => {
            try {
                const data = await fetchMyUserPackages('active');
                const list = data?.results ?? [];
                setItems(list);
            } catch {
                setItems([]);
            }
        })();
    }, [fetchMyUserPackages]);

    const pickLang = (val: any) => {
        if (!val) return '';
        if (typeof val === 'string' || typeof val === 'number') return String(val);
        if (typeof val === 'object') {
            const ar = val?.ar;
            const en = val?.en;
            return isAr ? (ar ?? en ?? '') : (en ?? ar ?? '');
        }
        return '';
    };

    const formatDate = (iso?: string | null) => {
        if (!iso) return '—';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return '—';
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const statusColor = (b: any) => {
        if (b.isExpired) return '#EF4444';
        if ((b.status || '').toLowerCase() === 'active') return '#16A34A';
        return '#6B7280';
    };

    const goToBooking = (it: any) => {
        const id = it?.packageId?._id || it?.packageId?.id || it?.packageId;
        if (!id) return;
        navigation.navigate('YourBooking', { packageId: id });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
                <Text
                    style={{
                        marginTop: 8,
                        color: '#111827',
                        fontSize: 14,
                        fontWeight: '400',
                        textAlign: isAr ? 'right' : 'left',
                    }}
                >
                    {t('choosePackages.helper')}
                </Text>

                {loading && items.length === 0 ? (
                    <View style={{ marginTop: 20 }}>
                        <ActivityIndicator />
                    </View>
                ) : items.length === 0 ? (
                    <Text
                        style={{
                            marginTop: 16,
                            color: '#6B7280',
                            textAlign: isAr ? 'right' : 'left',
                        }}
                    >
                        {t('choosePackages.noItems')}
                    </Text>
                ) : (
                    items.map((it) => {
                        const pkg = it.packageId || {};
                        const title = pickLang(pkg.name) || '—';
                        const desc = pickLang(pkg.description) || '';
                        const remaining = it.remainingUsage ?? 0;
                        const limit = pkg.usageLimit ?? null;
                        const pricePaid = it.pricePaid ?? pkg.fixedPrice ?? 0;

                        return (
                            <TouchableOpacity
                                key={it.id || it._id}
                                activeOpacity={0.85}
                                onPress={() => goToBooking(it)}
                                style={{
                                    marginTop: 16,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 18,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    shadowColor: '#000',
                                    shadowOpacity: 0.05,
                                    shadowRadius: 8,
                                    shadowOffset: { width: 0, height: 3 },
                                    elevation: 2,
                                }}
                            >
                                {/* Top row: name + status */}
                                <View
                                    style={{
                                        flexDirection: isAr ? 'row-reverse' : 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 6,
                                    }}
                                >
                                    <Text
                                        style={{
                                            flex: 1,
                                            color: '#111827',
                                            fontSize: 16,
                                            fontWeight: '700',
                                            textAlign: isAr ? 'right' : 'left',
                                        }}
                                        numberOfLines={2}
                                    >
                                        {title}
                                    </Text>

                                    <View
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            borderRadius: 999,
                                            backgroundColor: '#F3F4F6',
                                            marginLeft: isAr ? 0 : 10,
                                            marginRight: isAr ? 10 : 0,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: '600',
                                                color: statusColor(it),
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {it.status || '—'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Description */}
                                {!!desc && (
                                    <Text
                                        style={{
                                            color: '#6B7280',
                                            fontSize: 12,
                                            lineHeight: 18,
                                            marginBottom: 10,
                                            textAlign: isAr ? 'right' : 'left',
                                        }}
                                        numberOfLines={3}
                                    >
                                        {desc}
                                    </Text>
                                )}

                                {/* Divider */}
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: '#E5E7EB',
                                        marginVertical: 8,
                                        opacity: 0.6,
                                    }}
                                />

                                {/* Price + usage */}
                                <View
                                    style={{
                                        flexDirection: isAr ? 'row-reverse' : 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 6,
                                    }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                color: '#9CA3AF',
                                                fontSize: 11,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {t('choosePackages.pricePaid', 'Price paid')}
                                        </Text>
                                        <Text
                                            style={{
                                                color: '#111827',
                                                fontSize: 14,
                                                fontWeight: '600',
                                                marginTop: 2,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {`SAR ${Number(pricePaid).toFixed(2)}`}
                                        </Text>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                color: '#9CA3AF',
                                                fontSize: 11,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {t('choosePackages.remainingUsage', 'Remaining usage')}
                                        </Text>
                                        <Text
                                            style={{
                                                color: '#111827',
                                                fontSize: 14,
                                                fontWeight: '600',
                                                marginTop: 2,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {limit != null ? `${remaining} / ${limit}` : `${remaining}`}
                                        </Text>
                                    </View>
                                </View>

                                {/* Dates */}
                                <View
                                    style={{
                                        flexDirection: isAr ? 'row-reverse' : 'row',
                                        justifyContent: 'space-between',
                                        marginTop: 4,
                                    }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                color: '#9CA3AF',
                                                fontSize: 11,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {t('choosePackages.purchaseDate', 'Purchase date')}
                                        </Text>
                                        <Text
                                            style={{
                                                color: '#111827',
                                                fontSize: 13,
                                                marginTop: 2,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {formatDate(it.purchaseDate)}
                                        </Text>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                color: '#9CA3AF',
                                                fontSize: 11,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {t('choosePackages.expiresOn', 'Expires on')}
                                        </Text>
                                        <Text
                                            style={{
                                                color: '#111827',
                                                fontSize: 13,
                                                marginTop: 2,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {pkg.hasExpiry ? formatDate(it.expiryDate) : t('choosePackages.noExpiry', 'No expiry')}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChoosePackages;
