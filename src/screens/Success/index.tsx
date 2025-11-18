import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBooking } from '../../hooks/useBooking';
import SuccessImg from "../../assets/svgs/SuccessImg.svg";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const Success: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { bookingId } = (route?.params || {}) as { bookingId: string };
    const { fetchBookingById } = useBooking();
    const [booking, setBooking] = React.useState<any | null>(null);

    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');

    React.useEffect(() => {
        if (!bookingId) return;
        (async () => {
            try {
                const data = await fetchBookingById(bookingId);
                setBooking(data);
            } catch (e) {
                console.log('[Success] failed to load booking by id:', e);
            }
        })();
    }, [bookingId, fetchBookingById]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
            <View style={{ alignItems: 'center', width: '100%' }}>
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
                    }}
                >
                    <Text style={{ color: '#111', fontSize: 16, fontWeight: '700', textAlign: isAr ? 'right' : 'left' }}>
                        {booking?._id
                            ? `${t('success.bookingId')}: ${booking._id}`
                            : `${t('success.bookingId')}: —`}
                    </Text>
                </View>

                {/* Email + Payment card */}
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
                    <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ color: '#6B7280', textAlign: isAr ? 'right' : 'left' }}>{t('success.email')}</Text>
                        <Text style={{ color: '#111', fontWeight: '600', textAlign: isAr ? 'left' : 'right' }}>{booking?.email ?? booking?.userId?.email ?? '—'}</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />
                    <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text style={{ color: '#6B7280', textAlign: isAr ? 'right' : 'left' }}>{t('success.payment')}</Text>
                        <Text style={{ color: '#111', fontWeight: '600', textAlign: isAr ? 'left' : 'right' }}>{t('success.paymentOnSite')}</Text>
                    </View>
                </View>

                <Text style={{ marginTop: 6, color: '#16A34A', fontSize: 18, fontWeight: '700', textAlign: 'center' }}>
                    {t('success.successful')}
                </Text>

                {/* Take Screenshot */}
                {/* Notice instead of screenshot button */}
                <Text style={{ marginTop: 10, color: '#6B7280', fontSize: 12, textAlign: 'center' }}>
                    {t('success.tip')}
                </Text>

                {/* Buttons */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('BookingDetailsPage', { id: booking?._id })}
                    style={{
                        marginTop: 24,
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
        </SafeAreaView>
    );
};

export default Success;