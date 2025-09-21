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
import { useBooking } from '../../hooks/useBooking';
import { getUserData } from '../../hooks/useAuthStorage';

const BookingDetailsPage: React.FC = () => {
    const { loading, fetchBookingsByUserId } = useBooking();
    const navigation = useNavigation<any>();
    const [items, setItems] = React.useState<any[]>([]);

    React.useEffect(() => {
        (async () => {
            try {
                const u = await getUserData();
                const userId = u?.id;
                if (!userId) return;
                const data = await fetchBookingsByUserId(userId, { page: 1, limit: 10 });
                // console.log('[BookingDetailsPage] bookings by user:', data);
                setItems(data?.results ?? []);
            } catch (e) {
                console.log('[BookingDetailsPage] failed to fetch:', e);
                setItems([]);
            }
        })();
    }, [fetchBookingsByUserId]);

    const to12h = (d: Date) => {
        let h = d.getHours();
        const m = d.getMinutes();
        const ap = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        const mm = String(m).padStart(2, '0');
        return `${h}${m ? `:${mm}` : ''}${ap}`;
    };

    const fmtTimeSlot = (iso?: string, durationMin?: number) => {
        if (!iso) return '—';
        const start = new Date(iso);
        const end = new Date(start.getTime() + (durationMin ?? 60) * 60000);
        return `${to12h(start)} to ${to12h(end)}`;
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
                {/* <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>
                    Booking Details
                </Text> */}
                <Text style={{ fontSize: 18, fontWeight: '500', color: '#111' }}>
                    Your recent bookings
                </Text>
            </View>

            {loading ? (
                <View style={{ padding: 16 }}>
                    <ActivityIndicator />
                </View>
            ) : items.length === 0 ? (
                <View style={{ padding: 16 }}>
                    <Text style={{ color: '#777' }}>No bookings found.</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0 }}>
                    {items.map((b) => {
                        const serviceName = b?.serviceId?.name || 'Service';
                        const pkgName = b?.packageId?.name || '—';
                        const price =
                            b?.pricing ??
                            b?.packageId?.pricing ??
                            b?.package?.pricing ??
                            null;
                        const timeSlot = fmtTimeSlot(b?.slotId?.time, b?.slotId?.duration);
                        const statusTxt = (b?.status || '—').replace(/^\w/, (c: string) => c.toUpperCase());

                        return (
                            <TouchableOpacity
                                key={b.id}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#E6E6E6',
                                    padding: 16,
                                    marginTop: 12,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.05,
                                    shadowRadius: 6,
                                    shadowOffset: { width: 0, height: 2 },
                                    elevation: 2,
                                }}
                                onPress={() => navigation.navigate('Success', { bookingId: b.id })}
                            >
                                {/* Header: service name */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/* (Optional) left thumbnail spot — keep empty box for now */}
                                    <View
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 8,
                                            backgroundColor: '#0F172A',
                                            marginRight: 10,
                                        }}
                                    />
                                    <Text style={{ color: '#111', fontSize: 16, fontWeight: '700', flex: 1 }}>
                                        {serviceName}
                                    </Text>
                                </View>

                                {/* Divider */}
                                <View style={{ height: 1, backgroundColor: '#EAEAEA', marginVertical: 10 }} />

                                {/* Row: package name (left) — price (right) */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={{ color: '#2D5BD1', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' }}>
                                            {pkgName}
                                        </Text>
                                    </View>
                                    <Text style={{ color: '#111', fontSize: 14, fontWeight: '600' }}>
                                        {price != null ? `${price} SAR` : '—'}
                                    </Text>
                                </View>

                                {/* Time slot */}
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Time Slot</Text>
                                    <Text style={{ color: '#111', fontSize: 13, marginTop: 2 }}>{timeSlot}</Text>
                                </View>

                                {/* Booking ID */}
                                <View style={{ marginTop: 8 }}>
                                    <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Booking ID</Text>
                                    <Text style={{ color: '#111', fontSize: 13, marginTop: 2 }}>{b?.bookingId || '—'}</Text>
                                </View>

                                {/* Status centered */}
                                <View style={{ marginTop: 10, alignItems: 'center' }}>
                                    <Text style={{ color: statusColor(b?.status), fontSize: 13, fontWeight: '600' }}>
                                        {statusTxt}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default BookingDetailsPage;
