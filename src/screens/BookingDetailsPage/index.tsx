// src/screens/BookingDetailsPage/index.tsx (adjust path if needed)
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useBooking } from '../../hooks/useBooking';
import { getUserData } from '../../hooks/useAuthStorage';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const BookingDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');
    const { loading, fetchBookingsByUserId } = useBooking();
    const navigation = useNavigation<any>();

    const [items, setItems] = React.useState<any[]>([]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [userId, setUserId] = React.useState<string | null>(null);

    const pickLang = React.useCallback(
        (v: any) => {
            if (typeof v === 'string') return v;
            if (v && typeof v === 'object') {
                return (isAr ? v.ar ?? v.en : v.en ?? v.ar) ?? '';
            }
            return '';
        },
        [isAr]
    );

    const cap = (s?: string) => {
        const str = String(s || '');
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : '—';
    };

    const statusColor = (s?: string) => {
        const v = String(s || '').toLowerCase();
        if (v === 'completed' || v === 'successful' || v === 'success') return '#16A34A';
        if (v === 'pending') return '#EF4444';
        if (v === 'confirmed') return '#F59E0B';
        return '#6B7280';
    };

    const formatDate = (iso?: string) => {
        if (!iso) return '—';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '—';
        return d.toLocaleDateString();
    };

    const formatSlot = (slot?: any) => {
        if (!slot) return '—';
        const time = slot?.time ? String(slot.time) : '';
        const dur = slot?.duration ? ` (${slot.duration} min)` : '';
        return time ? `${time}${dur}` : '—';
    };

    const loadFirst = React.useCallback(async () => {
        const u = await getUserData();
        const uid = u?.id || null;
        setUserId(uid);

        if (!uid) return;
        const data = await fetchBookingsByUserId(uid, { page: 1, limit: 10 });
        setItems(data?.results ?? []);
        setPage(1);
        setTotalPages(data?.totalPages ?? 1);
    }, [fetchBookingsByUserId]);

    React.useEffect(() => {
        loadFirst().catch(() => { });
    }, [loadFirst]);

    const loadMore = async () => {
        if (loadingMore || page >= totalPages || !userId) return;
        try {
            setLoadingMore(true);
            const next = page + 1;
            const data = await fetchBookingsByUserId(userId, { page: next, limit: 10 });
            setItems(prev => [...prev, ...(data?.results ?? [])]);
            setPage(next);
            setTotalPages(data?.totalPages ?? totalPages);
        } finally {
            setLoadingMore(false);
        }
    };

    // normalize additionalAddOns from API:
    // additionalAddOns: [{ quantity, addOnId: { name{en,ar}, price, ... }, price }]
    const buildAddOnChips = (b: any) => {
        const list = Array.isArray(b?.additionalAddOns) ? b.additionalAddOns : [];
        const chips = list
            .map((x: any) => {
                const q = Number(x?.quantity || 1) || 1;
                const addOn = x?.addOnId || {};
                const name = pickLang(addOn?.name) || pickLang(x?.name) || '';
                const price = Number(x?.price ?? addOn?.price);
                const priceTxt = Number.isFinite(price) ? `${price} SAR` : '';
                if (!name) return null;
                return {
                    key: addOn?.id || `${name}-${q}-${priceTxt}`,
                    text: `${q}× ${name}${priceTxt ? ` • ${priceTxt}` : ''}`,
                };
            })
            .filter(Boolean);

        return chips as { key: string; text: string }[];
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ padding: 16 }}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#111',
                        textAlign: isAr ? 'right' : 'left',
                    }}
                >
                    {t('bookingDetails.title')}
                </Text>
            </View>

            {loading ? (
                <View style={{ padding: 16 }}>
                    <ActivityIndicator />
                </View>
            ) : items.length === 0 ? (
                <View style={{ padding: 16 }}>
                    <Text style={{ color: '#777', textAlign: isAr ? 'right' : 'left' }}>
                        {t('bookingDetails.empty')}
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 24 }}>
                    {items.map((b) => {
                        const pkgName = pickLang(b?.packageId?.name) || 'Booking';
                        const total = b?.totalAmount != null ? `${b.totalAmount} SAR` : '—';

                        const address = b?.address ? String(b.address) : '—';

                        const carName = b?.carId?.name ? String(b.carId.name) : '—';
                        const carNumber = b?.carId?.number ? String(b.carId.number) : '';

                        const dateTxt = b?.bookingDate ? formatDate(b.bookingDate) : null;
                        const slotTxt = formatSlot(b?.slotId);
                        const hasSlot = slotTxt !== '—';

                        const chips = buildAddOnChips(b);

                        return (
                            <TouchableOpacity
                                key={b.id}
                                activeOpacity={0.85}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    borderColor: '#F0F0F0',
                                    padding: 16,
                                    marginTop: 14,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.06,
                                    shadowRadius: 10,
                                    shadowOffset: { width: 0, height: 4 },
                                    elevation: 3,
                                }}
                                onPress={() => navigation.navigate('Success', { bookingId: b.id })}
                            >
                                {/* Title + status */}
                                <View
                                    style={{
                                        flexDirection: isAr ? 'row-reverse' : 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: isAr ? 'row-reverse' : 'row',
                                            alignItems: 'center',
                                            flex: 1,
                                        }}
                                    >
                                        <Ionicons
                                            name="pricetag-outline"
                                            size={22}
                                            color="#2D5BD1"
                                            style={{ marginRight: isAr ? 0 : 10, marginLeft: isAr ? 10 : 0 }}
                                        />
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: '#111',
                                                fontSize: 16,
                                                fontWeight: '800',
                                                flex: 1,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {pkgName}
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 6,
                                            borderRadius: 999,
                                            backgroundColor: '#F4F4F5',
                                        }}
                                    >
                                        <Text style={{ color: statusColor(b?.status), fontSize: 12, fontWeight: '800' }}>
                                            {cap(b?.status)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Total + date/slot */}
                                <View
                                    style={{
                                        marginTop: 12,
                                        flexDirection: isAr ? 'row-reverse' : 'row',
                                        gap: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: '#F9FAFB',
                                            borderRadius: 12,
                                            padding: 12,
                                            borderWidth: 1,
                                            borderColor: '#EEF2F7',
                                        }}
                                    >
                                        <Text style={{ color: '#6B7280', fontSize: 11, textAlign: isAr ? 'right' : 'left' }}>
                                            {isAr ? 'الإجمالي' : 'Total'}
                                        </Text>
                                        <Text
                                            style={{
                                                color: '#111',
                                                fontSize: 15,
                                                fontWeight: '800',
                                                marginTop: 4,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {total}
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: '#F9FAFB',
                                            borderRadius: 12,
                                            padding: 12,
                                            borderWidth: 1,
                                            borderColor: '#EEF2F7',
                                        }}
                                    >
                                        <Text style={{ color: '#6B7280', fontSize: 11, textAlign: isAr ? 'right' : 'left' }}>
                                            {isAr ? 'الموعد' : 'Schedule'}
                                        </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                color: '#111',
                                                fontSize: 14,
                                                fontWeight: '800',
                                                marginTop: 4,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {dateTxt
                                                ? `${dateTxt}${hasSlot ? `\n${slotTxt}` : ''}`
                                                : hasSlot
                                                    ? slotTxt
                                                    : '-'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Address */}
                                <View style={{ marginTop: 12 }}>
                                    <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                        <Ionicons
                                            name="location-outline"
                                            size={16}
                                            color="#6B7280"
                                            style={{ marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }}
                                        />
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                color: '#111',
                                                fontSize: 13,
                                                fontWeight: '500',
                                                flex: 1,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {address}
                                        </Text>
                                    </View>
                                </View>

                                {/* Car */}
                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                        <Ionicons
                                            name="car-outline"
                                            size={16}
                                            color="#6B7280"
                                            style={{ marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }}
                                        />
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: '#111',
                                                fontSize: 13,
                                                fontWeight: '700',
                                                flex: 1,
                                                textAlign: isAr ? 'right' : 'left',
                                            }}
                                        >
                                            {carName}{carNumber ? ` • ${carNumber}` : ''}
                                        </Text>
                                    </View>
                                </View>

                                {/* Add-ons selected (only if exists) */}
                                {chips.length > 0 && (
                                    <View style={{ marginTop: 12 }}>
                                        <Text style={{ color: '#6B7280', fontSize: 11, textAlign: isAr ? 'right' : 'left' }}>
                                            {isAr ? 'الإضافات المختارة' : 'Selected add-ons'}
                                        </Text>

                                        <View
                                            style={{
                                                flexDirection: isAr ? 'row-reverse' : 'row',
                                                flexWrap: 'wrap',
                                                marginTop: 8,
                                            }}
                                        >
                                            {chips.slice(0, 6).map((c) => (
                                                <View
                                                    key={c.key}
                                                    style={{
                                                        backgroundColor: '#22367110',
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 6,
                                                        borderRadius: 999,
                                                        marginRight: isAr ? 0 : 6,
                                                        marginLeft: isAr ? 6 : 0,
                                                        marginBottom: 6,
                                                        maxWidth: '100%',
                                                    }}
                                                >
                                                    <Text style={{ fontSize: 11, color: '#223671', fontWeight: '800' }} numberOfLines={1}>
                                                        {c.text}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>

                                        {chips.length > 6 && (
                                            <Text style={{ marginTop: 4, fontSize: 11, color: '#6B7280', textAlign: isAr ? 'right' : 'left' }}>
                                                {isAr ? `+${chips.length - 6} إضافات أخرى` : `+${chips.length - 6} more`}
                                            </Text>
                                        )}
                                    </View>
                                )}

                                {/* Booking ID footer */}
                                <View
                                    style={{
                                        marginTop: 12,
                                        paddingTop: 12,
                                        borderTopWidth: 1,
                                        borderTopColor: '#EEF2F7',
                                        flexDirection: isAr ? 'row-reverse' : 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 10,
                                    }}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: '#6B7280',
                                            fontSize: 11,
                                            fontWeight: '700',
                                            flex: 1,
                                            textAlign: isAr ? 'right' : 'left',
                                        }}
                                    >
                                        {t('bookingDetails.bookingId')}: {b?.id || '—'}
                                    </Text>

                                    <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={16}
                                            color="#9CA3AF"
                                            style={{ transform: [{ rotate: isAr ? '180deg' : '0deg' }] }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    {page < totalPages ? (
                        <TouchableOpacity
                            onPress={loadMore}
                            disabled={loadingMore}
                            style={{
                                marginTop: 12,
                                height: 44,
                                borderRadius: 10,
                                backgroundColor: loadingMore ? '#9CA3AF' : '#2D5BD1',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {loadingMore ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={{ color: '#fff', fontWeight: '800' }}>
                                    {t('bookingDetails.loadMore')}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ) : null}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default BookingDetailsPage;
