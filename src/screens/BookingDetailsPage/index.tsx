import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    TextInput,
    Alert,
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

    React.useEffect(() => {
        (async () => {
            const u = await getUserData();
            const uid = u?.id || null;
            setUserId(uid);

            if (!uid) return;
            const data = await fetchBookingsByUserId(uid, { page: 1, limit: 10 });
            setItems(data?.results ?? []);
            setPage(1);
            setTotalPages(data?.totalPages ?? 1);
        })().catch(() => { });
    }, [fetchBookingsByUserId]);

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

    const statusColor = (s?: string) =>
        s?.toLowerCase() === 'successful' || s?.toLowerCase() === 'success'
            ? '#16A34A'
            : s?.toLowerCase() === 'pending'
                ? '#EF4444'
                : '#6B7280';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: '#111', textAlign: isAr ? 'right' : 'left' }}>
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
                <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0 }}>
                    {items.map((b) => {
                        const serviceName = b?.packageId?.name || 'Booking';
                        const pkgName = b?.packageId?.name || b?.package?.name || '—';
                        const price = b?.totalAmount ?? b?.packageId?.fixedPrice ?? null;
                        const timeSlot = b?.slotId?.time
                            ? `${b.slotId.time} (${b.slotId.duration} min)`
                            : '—';
                        const statusTxt = (b?.status || '—').replace(/^\w/, (c: string) => c.toUpperCase());

                        const statusRaw = (b?.status || '').toLowerCase();
                        const isCompleted = statusRaw === 'completed' || statusRaw === 'success' || statusRaw === 'successful';

                        return (
                            <TouchableOpacity
                                key={b.id}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 14,
                                    borderWidth: 1,
                                    borderColor: '#F0F0F0',
                                    padding: 18,
                                    marginTop: 14,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.07,
                                    shadowRadius: 8,
                                    shadowOffset: { width: 0, height: 3 },
                                    elevation: 3,
                                }}
                                onPress={() => navigation.navigate('Success', { bookingId: b.id })}
                            >
                                {/* Header: service name */}
                                <View
                                    style={{
                                        flexDirection: isAr ? 'row-reverse' : 'row',
                                        alignItems: 'center',
                                        marginBottom: 10,
                                    }}
                                >
                                    <Ionicons
                                        name="car-sport-outline"
                                        size={28}
                                        color="#2D5BD1"
                                        style={{ marginRight: isAr ? 0 : 10, marginLeft: isAr ? 10 : 0 }}
                                    />
                                    <Text
                                        style={{
                                            color: '#111',
                                            fontSize: 17,
                                            fontWeight: '700',
                                            flex: 1,
                                            textAlign: isAr ? 'right' : 'left',
                                        }}
                                    >
                                        {serviceName}
                                    </Text>
                                </View>

                                {/* Divider */}
                                <View style={{ height: 1, backgroundColor: '#EAEAEA', marginVertical: 10 }} />

                                {/* Row: package name (left) — price (right) */}
                                <View
                                    style={{
                                        flexDirection: isAr ? 'row-reverse' : 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#2D5BD1',
                                            fontSize: 15,
                                            fontWeight: '600',
                                            textDecorationLine: 'underline',
                                        }}
                                    >
                                        {pkgName}
                                    </Text>

                                    <Text
                                        style={{
                                            color: '#111',
                                            fontSize: 16,
                                            fontWeight: '700',
                                        }}
                                    >
                                        {price ? `${price} SAR` : '—'}
                                    </Text>
                                </View>

                                {/* Time slot */}
                                <View style={{ marginTop: 6 }}>
                                    <Text style={{ color: '#6B7280', fontSize: 12 }}>
                                        {t('bookingDetails.timeSlot')}
                                    </Text>
                                    <Text style={{ color: '#111', fontSize: 14, marginTop: 2, fontWeight: '500' }}>
                                        {timeSlot}
                                    </Text>
                                </View>

                                {/* Booking ID */}
                                <View style={{ marginTop: 6 }}>
                                    <Text style={{ color: '#6B7280', fontSize: 12 }}>
                                        {t('bookingDetails.bookingId')}
                                    </Text>
                                    <Text style={{ color: '#111', fontSize: 14, marginTop: 2, fontWeight: '500' }}>
                                        {b?.id || '—'}
                                    </Text>
                                </View>

                                {/* Status centered */}
                                <View
                                    style={{
                                        marginTop: 14,
                                        alignSelf: 'center',
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 20,
                                        backgroundColor: '#F4F4F5',
                                    }}
                                >
                                    <Text style={{ color: statusColor(b?.status), fontSize: 13, fontWeight: '700' }}>
                                        {statusTxt}
                                    </Text>
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
                                marginBottom: 24,
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
                                <Text style={{ color: '#fff', fontWeight: '700' }}>
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
