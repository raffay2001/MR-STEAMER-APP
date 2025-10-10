import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { usePackage } from '../../hooks/usePackage';
import { useSlots, type SlotItem } from '../../hooks/useSlots';
import { useBooking } from '../../hooks/useBooking';

import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

type RouteParams = { packageId: string };

const YourBooking: React.FC = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');
    const { packageId } = (route?.params || {}) as RouteParams;

    // Package details
    const { fetchPackageById } = usePackage();
    const [pkg, setPkg] = React.useState<any | null>(null);

    // Inputs
    const [phone, setPhone] = React.useState('');
    const [message, setMessage] = React.useState('');

    // Slots/date picker (same behavior as Home)
    const { loading: slotsLoading, fetchAvailableSlots } = useSlots();
    const [showPicker, setShowPicker] = React.useState(false);
    const [slots, setSlots] = React.useState<SlotItem[]>([]);
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = React.useState<SlotItem | null>(null);
    const [showSlotModal, setShowSlotModal] = React.useState(false);

    const { loading: creating, createBooking } = useBooking();

    const dayLabel = (d: Date) => {
        const today = new Date();
        const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const diff = (dd.getTime() - t.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        return d.toLocaleDateString(undefined, { weekday: 'long' });
    };

    const fmtDate = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
            d.getDate()
        ).padStart(2, '0')}`;

    const onPickDate = async (_: any, date?: Date) => {
        setShowPicker(false);
        if (!date) return;
        setSelectedDate(date);
        try {
            const res = await fetchAvailableSlots({ date: fmtDate(date) });
            setSlots(res?.slots ?? []);
            setShowSlotModal(true);
        } catch {
            setSlots([]);
            setShowSlotModal(false);
        }
    };

    // Fetch package details
    React.useEffect(() => {
        if (!packageId) return;
        (async () => {
            try {
                const data = await fetchPackageById(packageId);
                setPkg(data);
                console.log('[YourBooking] package details:', data);
            } catch (e) {
                console.log('[YourBooking] failed to fetch package:', e);
                setPkg(null);
            }
        })();
    }, [packageId, fetchPackageById]);

    const parseStartHM = (s: string) => {
        const m = s?.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/);
        if (!m) return { h: 0, min: 0, ok: false };
        let h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        const ap = m[3]?.toLowerCase();
        if (ap === 'pm' && h < 12) h += 12;
        if (ap === 'am' && h === 12) h = 0;
        return { h, min, ok: true };
    };

    const buildTimeIso = (date: Date, slot: SlotItem) => {
        const disp = (slot as any)?.displayTime ?? '';
        const { h, min, ok } = parseStartHM(String(disp));
        return new Date(Date.UTC(
            date.getFullYear(), date.getMonth(), date.getDate(),
            ok ? h : 0, ok ? min : 0, 0
        )).toISOString().replace('.000Z', 'Z');
    };

    const onCheckout = async () => {
        if (!pkg?.id) return Alert.alert(t('booking.errorTitle'), t('booking.errors.noPackage'));
        if (!phone.trim()) return Alert.alert(t('booking.errorTitle'), t('booking.errors.noPhone'));
        if (!selectedDate) return Alert.alert(t('booking.errorTitle'), t('booking.errors.noDate'));
        if (!selectedSlot) return Alert.alert(t('booking.errorTitle'), t('booking.errors.noSlot'));

        const timeIso = buildTimeIso(selectedDate, selectedSlot);
        const payload = {
            packageId: pkg.id,
            serviceId: pkg.service,
            details: pkg.detail ?? '',
            mobileNumber: phone.trim(),
            time: timeIso,
            message: message.trim(),
            isDiscount: false,
        };
        // console.log('[YourBooking] checkout payload:', payload);
        try {
            const result = await createBooking(payload);
            console.log('[YourBooking] booking created:', result);
            navigation.navigate('Success', { bookingId: result.id });
        } catch (e) {
            console.log('[YourBooking] booking failed:', e);
            Alert.alert(t('booking.errorTitle'), t('booking.errors.createFail'));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
                {/* Top details box */}
                <View
                    style={{
                        backgroundColor: '#E2E2E2',
                        borderRadius: 12,
                        padding: 14,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>
                        {pkg?.name ?? '—'}
                    </Text>

                    <View style={{ height: 6 }} />

                    <Text style={{ fontSize: 14, color: '#111' }}>
                        {pkg?.type ? `${pkg.type} • ` : ''}
                        {typeof pkg?.pricing === 'number' ? `${pkg.pricing} ${t('common.sar')}` : '—'}
                    </Text>

                    {!!pkg?.detail && (
                        <Text style={{ marginTop: 6, color: '#333' }}>{pkg.detail}</Text>
                    )}
                </View>

                {/* Inputs */}
                <View style={{ marginTop: 16 }}>
                    <Text style={{ color: '#111', marginBottom: 8, fontWeight: '600', textAlign: isAr ? 'right' : 'left' }}>
                        {t('booking.mobileLabel')}
                    </Text>
                    <TextInput
                        placeholder={t('booking.mobilePlaceholder')}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        style={{
                            height: 48, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB',
                            paddingHorizontal: 12, backgroundColor: '#fff', color: '#111', textAlign: isAr ? 'right' : 'left'
                        }}
                    />
                </View>

                <View style={{ marginTop: 16 }}>
                    <Text style={{ color: '#111', marginBottom: 8, fontWeight: '600', textAlign: isAr ? 'right' : 'left' }}>
                        {t('booking.messageLabel')}
                    </Text>
                    <TextInput
                        placeholder={t('booking.messagePlaceholder')}
                        placeholderTextColor="#9CA3AF"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={4}
                        style={{
                            minHeight: 100, textAlignVertical: 'top', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB',
                            paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', color: '#111',
                            textAlign: isAr ? 'right' : 'left'
                        }}
                    />
                </View>

                {/* Availability Slot (same UI/behavior as Home) */}
                <View style={{ marginTop: 16 }}>
                    <TouchableOpacity
                        style={{ elevation: 5, minWidth: 0, height: 70, borderRadius: 12, overflow: 'hidden' }}
                        onPress={() => {
                            if (selectedDate && slots.length > 0) setShowSlotModal(true);
                            else setShowPicker(true);
                        }}
                    >
                        <LinearGradient
                            colors={['#000000', '#2C4694']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                flex: 1,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 12,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' }}>
                                {t('booking.slotTitle')}
                            </Text>
                            <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>
                                {selectedDate
                                    ? `${dayLabel(selectedDate)}${selectedSlot ? `, ${selectedSlot.displayTime}` : `, ${t('booking.selectSlot')}`}`
                                    : t('booking.selectSlot')}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Check out */}
                <View style={{ marginTop: 16 }}>
                    <TouchableOpacity
                        onPress={onCheckout}
                        disabled={creating}
                        style={{
                            height: 48,
                            borderRadius: 12,
                            backgroundColor: '#2C4694',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: creating ? 0.7 : 1,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                            {creating ? t('booking.processing') : t('booking.checkout')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Date picker */}
            {showPicker && (
                <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onPickDate}
                    minimumDate={new Date()}
                />
            )}

            {/* Slots modal */}
            <ModalSlots
                visible={showSlotModal}
                onClose={() => setShowSlotModal(false)}
                slotsLoading={slotsLoading}
                slots={slots}
                selectedSlot={selectedSlot}
                onSelect={(s) => {
                    setSelectedSlot(s);
                    setShowSlotModal(false);
                }}
                title={selectedDate ? t('booking.pickTime', { day: dayLabel(selectedDate) }) : t('booking.pickTimeSimple')}
            />
        </SafeAreaView>
    );
};

export default YourBooking;

/** Small internal component for the slots modal (copied structure of Home) */
const ModalSlots = ({
    visible,
    onClose,
    slotsLoading,
    slots,
    selectedSlot,
    onSelect,
    title,
}: {
    visible: boolean;
    onClose: () => void;
    slotsLoading: boolean;
    slots: SlotItem[];
    selectedSlot: SlotItem | null;
    onSelect: (s: SlotItem) => void;
    title: string;
}) => {
    const { t } = useTranslation();
    return (
        <React.Fragment>
            {visible && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: '90%',
                            maxWidth: 480,
                            maxHeight: '70%',
                            backgroundColor: '#fff',
                            borderRadius: 14,
                            padding: 12,
                            elevation: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 6,
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111' }}>{title}</Text>
                            <TouchableOpacity onPress={onClose} style={{ padding: 6 }}>
                                <Ionicons name="close" size={20} color="#111" />
                            </TouchableOpacity>
                        </View>

                        {slotsLoading ? (
                            <ActivityIndicator />
                        ) : slots.length === 0 ? (
                            <Text style={{ color: '#555', paddingVertical: 10 }}>
                                {t('booking.noSlots')}
                            </Text>
                        ) : (
                            <ScrollView>
                                {slots.map((s, i) => {
                                    const disabled = !s.isAvailable;
                                    const active =
                                        selectedSlot?.startTime === s.startTime &&
                                        selectedSlot?.endTime === s.endTime;
                                    return (
                                        <TouchableOpacity
                                            key={`${s.startTime}-${s.endTime}-${i}`}
                                            disabled={disabled}
                                            onPress={() => onSelect(s)}
                                            style={{
                                                paddingVertical: 12,
                                                paddingHorizontal: 14,
                                                backgroundColor: active ? '#F1F5F9' : '#fff',
                                                opacity: disabled ? 0.5 : 1,
                                                borderTopWidth: i === 0 ? 0 : 1,
                                                borderColor: '#eee',
                                            }}
                                        >
                                            <Text style={{ color: '#111' }}>{s.displayTime}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </View>
                </View>
            )}
        </React.Fragment>
    );
};
