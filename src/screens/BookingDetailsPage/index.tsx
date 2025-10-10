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
import { useRating } from '../../hooks/useRating';
import { useNavigation } from '@react-navigation/native';
import { useBooking } from '../../hooks/useBooking';
import { getUserData } from '../../hooks/useAuthStorage';
import { getRatedPackages, markPackageRated } from '../../hooks/useRatingStorage';
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

    const { creating, submitRating } = useRating();
    const [starsByBooking, setStarsByBooking] = React.useState<Record<string, number>>({});
    const [descByBooking, setDescByBooking] = React.useState<Record<string, string>>({});
    const [submittingFor, setSubmittingFor] = React.useState<string | null>(null);
    const [userId, setUserId] = React.useState<string | null>(null);
    const [ratedSet, setRatedSet] = React.useState<Set<string>>(new Set());

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

            // load rated package names for this user
            const rated = await getRatedPackages(uid);
            setRatedSet(rated);
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
        return `${to12h(start)} ${t('bookingDetails.to')} ${to12h(end)}`;
    };

    const statusColor = (s?: string) =>
        s?.toLowerCase() === 'successful' || s?.toLowerCase() === 'success'
            ? '#16A34A'
            : s?.toLowerCase() === 'pending'
                ? '#EF4444'
                : '#6B7280';

    const setStar = (bid: string, val: number) =>
        setStarsByBooking(s => ({ ...s, [bid]: val }));

    const setDesc = (bid: string, val: string) =>
        setDescByBooking(s => ({ ...s, [bid]: val }));

    const submitFor = async (b: any) => {
        const pkgId = b?.packageId?.id || b?.package?.id;
        const pkgKey = b?.packageId?.name || b?.package?.name || '';
        if (!pkgId) return Alert.alert(t('bookingDetails.errTitle'), t('bookingDetails.errMissingPkg'));

        // block if already rated this package name
        if (pkgKey && ratedSet.has(pkgKey)) {
            return;
        }

        const star = starsByBooking[b.id] || 0;
        if (star < 1) return Alert.alert(t('bookingDetails.ratingTitle'), t('bookingDetails.errMinStar'));

        try {
            setSubmittingFor(b.id);
            await submitRating({
                packageId: pkgId,
                star,
                description: (descByBooking[b.id] || '').trim() || undefined,
            });
            if (userId && pkgKey) {
                await markPackageRated(userId, pkgKey);
                setRatedSet(prev => new Set(prev).add(pkgKey));
            }
            Alert.alert(t('bookingDetails.thanksTitle'), t('bookingDetails.thanksMsg'));
            setStarsByBooking(p => ({ ...p, [b.id]: 0 }));
            setDescByBooking(p => ({ ...p, [b.id]: '' }));
        } catch (e: any) {
            Alert.alert(t('bookingDetails.errTitle'), e?.response?.data?.message || t('bookingDetails.errSubmit'));
        } finally {
            setSubmittingFor(null);
        }
    };

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
                        const serviceName = b?.serviceId?.name || 'Service';
                        const pkgName = b?.packageId?.name || b?.package?.name || '—';
                        const pkgKey = pkgName; // used for "already rated" check
                        const price =
                            b?.pricing ??
                            b?.packageId?.pricing ??
                            b?.package?.pricing ??
                            null;
                        const timeSlot = fmtTimeSlot(b?.slotId?.time, b?.slotId?.duration);
                        const statusTxt = (b?.status || '—').replace(/^\w/, (c: string) => c.toUpperCase());

                        const statusRaw = (b?.status || '').toLowerCase();
                        const isCompleted = statusRaw === 'completed' || statusRaw === 'success' || statusRaw === 'successful';
                        const alreadyRated = pkgKey ? ratedSet.has(pkgKey) : false;
                        const canRate = isCompleted && !alreadyRated;

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
                                <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                    <View
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 8,
                                            backgroundColor: '#0F172A',
                                            marginRight: isAr ? 0 : 10,
                                            marginLeft: isAr ? 10 : 0,
                                        }}
                                    />
                                    <Text style={{ color: '#111', fontSize: 16, fontWeight: '700', flex: 1, textAlign: isAr ? 'right' : 'left' }}>
                                        {serviceName}
                                    </Text>
                                </View>

                                {/* Divider */}
                                <View style={{ height: 1, backgroundColor: '#EAEAEA', marginVertical: 10 }} />

                                {/* Row: package name (left) — price (right) */}
                                <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={{ color: '#2D5BD1', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline', textAlign: isAr ? 'right' : 'left' }}>
                                            {pkgName}
                                        </Text>
                                    </View>
                                    <Text style={{ color: '#111', fontSize: 14, fontWeight: '600', textAlign: isAr ? 'left' : 'right' }}>
                                        {price != null ? `${price} SAR` : '—'}
                                    </Text>
                                </View>

                                {/* Time slot */}
                                <Text style={{ color: '#9CA3AF', fontSize: 12, textAlign: isAr ? 'right' : 'left' }}>
                                    {t('bookingDetails.timeSlot')}
                                </Text>
                                <Text style={{ color: '#111', fontSize: 13, marginTop: 2, textAlign: isAr ? 'right' : 'left' }}>
                                    {timeSlot}
                                </Text>

                                {/* Booking ID */}
                                <Text style={{ color: '#9CA3AF', fontSize: 12, textAlign: isAr ? 'right' : 'left' }}>
                                    {t('bookingDetails.bookingId')}
                                </Text>
                                <Text style={{ color: '#111', fontSize: 13, marginTop: 2, textAlign: isAr ? 'right' : 'left' }}>
                                    {b?.bookingId || '—'}
                                </Text>

                                {/* Status centered */}
                                <View style={{ marginTop: 10, alignItems: 'center' }}>
                                    <Text style={{ color: statusColor(b?.status), fontSize: 13, fontWeight: '600' }}>
                                        {statusTxt}
                                    </Text>
                                </View>

                                {/* Rating section */}
                                {isCompleted ? (
                                    alreadyRated ? (
                                        // show only the "Rated" button (no stars / input)
                                        <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: '#EEE' }}>
                                            <TouchableOpacity
                                                disabled
                                                style={{
                                                    marginTop: 4,
                                                    height: 44,
                                                    borderRadius: 10,
                                                    backgroundColor: '#9CA3AF',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text style={{ color: '#fff', fontWeight: '700' }}>{t('bookingDetails.rated')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        // user can rate (completed & not yet rated)
                                        <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: '#EEE' }}>
                                            <Text style={{ color: '#111', fontWeight: '600', marginBottom: 8, textAlign: isAr ? 'right' : 'left' }}>
                                                {t('bookingDetails.ratePrompt')}
                                            </Text>

                                            {/* Stars */}
                                            <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 8 }}>
                                                {Array.from({ length: 5 }).map((_, i) => {
                                                    const idx = i + 1;
                                                    const filled = idx <= (starsByBooking[b.id] || 0);
                                                    return (
                                                        <TouchableOpacity
                                                            key={idx}
                                                            onPress={() => setStar(b.id, idx)}
                                                            style={{ marginRight: isAr ? 0 : 6, marginLeft: isAr ? 6 : 0 }}
                                                        >
                                                            <Ionicons name={filled ? 'star' : 'star-outline'} size={22} color={filled ? '#FACC15' : '#9CA3AF'} />
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>

                                            {/* Optional review */}
                                            <TextInput
                                                placeholder={t('bookingDetails.reviewPlaceholder')}
                                                placeholderTextColor="#9CA3AF"
                                                value={descByBooking[b.id] || ''}
                                                onChangeText={(v) => setDesc(b.id, v)}
                                                multiline
                                                style={{
                                                    minHeight: 70,
                                                    borderWidth: 1,
                                                    borderColor: '#E5E7EB',
                                                    borderRadius: 10,
                                                    padding: 10,
                                                    color: '#111',
                                                    textAlignVertical: 'top',
                                                }}
                                            />

                                            {/* Submit */}
                                            <TouchableOpacity
                                                onPress={() => submitFor(b)}
                                                disabled={creating || submittingFor === b.id || !canRate}
                                                style={{
                                                    marginTop: 10,
                                                    height: 44,
                                                    borderRadius: 10,
                                                    backgroundColor: (submittingFor === b.id || !canRate) ? '#9CA3AF' : '#2D5BD1',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {submittingFor === b.id ? (
                                                    <ActivityIndicator color="#fff" />
                                                ) : (
                                                    <Text style={{ color: '#fff', fontWeight: '700' }}>
                                                        {submittingFor === b.id ? t('bookingDetails.processing') : t('bookingDetails.submit')}
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )
                                ) : null}
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
