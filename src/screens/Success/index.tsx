import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBooking } from '../../hooks/useBooking';
import SuccessImg from '../../assets/svgs/SuccessImg.svg';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const Success: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    // ✅ handle all possible param shapes
    const bookingKey =
        route?.params?.bookingId ||
        route?.params?.id ||
        route?.params?.booking?._id ||
        route?.params?._id;

    const { fetchBookingById } = useBooking();
    const [booking, setBooking] = React.useState<any | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [loadError, setLoadError] = React.useState<string | null>(null);

    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');

    const rowDir = { flexDirection: isAr ? ('row-reverse' as const) : ('row' as const) };
    const textAlign = { textAlign: isAr ? ('right' as const) : ('left' as const) };

    const loadBooking = React.useCallback(async () => {
        if (!bookingKey) {
            setLoadError(t('success.missingBookingId'));
            return;
        }

        try {
            setLoading(true);
            setLoadError(null);

            // ✅ try string call first
            let data: any = null;
            try {
                data = await fetchBookingById(bookingKey);
            } catch (e) {
                // ✅ fallback if your hook expects { id }
                data = await fetchBookingById({ id: bookingKey } as any);
            }

            if (!data) {
                setBooking(null);
                setLoadError(t('success.couldNotLoadBooking'));
                return;
            }

            setBooking(data);
        } catch (e) {
            console.log('[Success] failed to load booking by id:', e);
            setBooking(null);
            setLoadError(t('success.couldNotLoadBooking'));
        } finally {
            setLoading(false);
        }
    }, [bookingKey, fetchBookingById, t]);

    React.useEffect(() => {
        loadBooking();
    }, [loadBooking]);

    const getPackageName = () => {
        const name = booking?.packageId?.name;
        if (!name) return '—';
        if (typeof name === 'string') return name;
        return isAr ? (name?.ar ?? name?.en ?? '—') : (name?.en ?? name?.ar ?? '—');
    };

    const getCarName = () => booking?.carId?.name ?? '—';

    const formatDate = (iso?: string) => {
        if (!iso) return '—';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return '—';
        return d.toLocaleDateString(isAr ? 'ar' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    const getSlotText = () => {
        const time = booking?.slotId?.time;
        const duration = booking?.slotId?.duration;
        if (!time && !duration) return '—';
        if (!time) return `${t('bookingnew.minutes', { count: duration })}`;
        if (!duration) return time;
        return `${time} • ${t('bookingnew.minutes', { count: duration })}`;
    };

    const amountText =
        typeof booking?.totalAmount === 'number'
            ? `SAR ${booking.totalAmount.toFixed(2)}`
            : booking?.totalAmount
                ? `SAR ${booking.totalAmount}`
                : '—';

    const InfoRow = ({ label, value }: { label: string; value: string }) => (
        <View style={{ ...rowDir, justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#6B7280', ...textAlign }}>{label}</Text>
            <Text
                style={{
                    color: '#111',
                    fontWeight: '600',
                    textAlign: isAr ? 'left' : 'right',
                    flexShrink: 1,
                    maxWidth: '62%',
                }}
                numberOfLines={2}
            >
                {value}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 18,
                    paddingBottom: 28,
                    alignItems: 'center',
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ width: '100%', alignItems: 'center' }}>
                    {/* Success image */}
                    <SuccessImg width="100%" height={220} />

                    {/* BookingId */}
                    <View
                        style={{
                            marginTop: 16,
                            backgroundColor: '#F5F7FA',
                            borderRadius: 12,
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            width: '100%',
                        }}
                    >
                        <Text style={{ color: '#111', fontSize: 16, fontWeight: '700', ...textAlign }}>
                            {booking?._id
                                ? `${t('success.bookingId')}: ${booking._id}`
                                : bookingKey
                                    ? `${t('success.bookingId')}: ${bookingKey}`
                                    : `${t('success.bookingId')}: —`}
                        </Text>
                    </View>

                    {/* MAIN DETAILS ONLY */}
                    <View
                        style={{
                            marginTop: 12,
                            backgroundColor: '#F5F7FA',
                            borderRadius: 12,
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            width: '100%',
                        }}
                    >
                        {loading ? (
                            <View style={{ paddingVertical: 14, alignItems: 'center' }}>
                                <ActivityIndicator />
                                <Text style={{ marginTop: 8, color: '#6B7280', fontSize: 12, ...textAlign }}>
                                    {t('success.loadingDetails')}
                                </Text>
                            </View>
                        ) : loadError ? (
                            <View style={{ paddingVertical: 8 }}>
                                <Text style={{ color: '#DC2626', fontSize: 13, ...textAlign }}>
                                    {loadError}
                                </Text>

                                <TouchableOpacity
                                    onPress={loadBooking}
                                    style={{
                                        marginTop: 10,
                                        paddingVertical: 10,
                                        borderRadius: 10,
                                        backgroundColor: '#2D4795',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '700' }}>
                                        {t('success.retry')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <InfoRow
                                    label={t('success.email')}
                                    value={(booking?.email ?? booking?.userId?.email ?? '—') as string}
                                />
                                <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />

                                <View style={{ marginTop: 8 }}>
                                    <InfoRow label={t('bookingnew.package')} value={getPackageName()} />
                                    <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 }} />

                                    <InfoRow label={t('bookingnew.car')} value={getCarName()} />
                                    <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 }} />

                                    <InfoRow label={t('bookingnew.date')} value={formatDate(booking?.bookingDate)} />
                                    <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 }} />

                                    <InfoRow label={t('bookingnew.slot')} value={getSlotText()} />
                                    <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 }} />

                                    <InfoRow label={t('bookingnew.address')} value={(booking?.address ?? '—') as string} />
                                    <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 }} />

                                    <InfoRow label={t('success.payment')} value={t('success.paymentOnSite')} />
                                    <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 }} />

                                    <InfoRow label={t('bookingnew.total')} value={amountText} />
                                </View>
                            </>
                        )}
                    </View>

                    <Text
                        style={{
                            marginTop: 10,
                            color: '#16A34A',
                            fontSize: 18,
                            fontWeight: '700',
                            textAlign: 'center',
                        }}
                    >
                        {t('success.successful')}
                    </Text>

                    <Text style={{ marginTop: 10, color: '#6B7280', fontSize: 12, textAlign: 'center' }}>
                        {t('success.tip')}
                    </Text>

                    {/* Buttons */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('BookingDetailsPage', { id: booking?._id || bookingKey })}
                        style={{
                            marginTop: 20,
                            width: '100%',
                            height: 48,
                            borderRadius: 12,
                            backgroundColor: '#2D4795',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                            {t('success.detailsBtn')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Drawer', { screen: 'Home' })}
                        style={{
                            marginTop: 12,
                            width: '100%',
                            height: 48,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#2C4694',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: '#2C4694', fontSize: 16, fontWeight: '700' }}>
                            {t('success.backHome')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Success;
