import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Alert,
    PermissionsAndroid,
    Platform,
    I18nManager,
    Modal,
    Pressable
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePackage } from '../../hooks/usePackage';
import { getCarProfile } from '../../hooks/useCarStorage';
import { getUserData } from '../../hooks/useAuthStorage';
import { checkIfUserOwnsPackage } from '../../api/package/package.api';
import { useSlots } from '../../hooks/useSlots';
import type { SlotItem } from '../../api/slot/slot.api';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useAddons } from '../../hooks/useAddons';
import type { AddonItem } from '../../api/addon/addon.api';
import { useBooking } from '../../hooks/useBooking';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Calendar } from "react-native-calendars";
import i18n from '../../i18n';

const GOOGLE_API_KEY = 'AIzaSyApI2bRWLV7R3ID776FLL1N51MtN9f34Uw';

const BRAND = '#223671';

type RouteParams = { packageId: string };

type AddonQtyMap = Record<string, number>;

const YourBooking: React.FC = () => {
    const isRTL = I18nManager.isRTL || i18n.language?.startsWith('ar');

    const rowDir = { flexDirection: isRTL ? ('row-reverse' as const) : ('row' as const) };
    const textAlign = { textAlign: isRTL ? ('right' as const) : ('left' as const) };

    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { packageId } = (route?.params || {}) as RouteParams;

    const addressSheetRef = React.useRef<any>(null);
    const slotSheetRef = React.useRef<any>(null);
    const addonSheetRef = React.useRef<any>(null);

    const { fetchPackageById } = usePackage();
    const [pkg, setPkg] = React.useState<any | null>(null);
    const [loading, setLoading] = React.useState(true);

    const [car, setCar] = React.useState<any | null>(null);
    const [userPackageId, setUserPackageId] = React.useState<string | null>(null);

    const { loading: slotsLoading, fetchSlotsByDay } = useSlots();
    const [selectedDay, setSelectedDay] = React.useState<string>('');
    const [slots, setSlots] = React.useState<SlotItem[]>([]);
    const [selectedSlot, setSelectedSlot] = React.useState<SlotItem | null>(null);
    const [bookingDate, setBookingDate] = React.useState<Date>(new Date());
    const [calendarOpen, setCalendarOpen] = React.useState(false);

    const { loading: addonsLoading, addons, fetchAddons } = useAddons();
    const [selectedAddons, setSelectedAddons] = React.useState<Record<string, number>>({});

    const [mobileNumber, setMobileNumber] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [specialInstructions, setSpecialInstructions] = React.useState('');

    const [address, setAddress] = React.useState('');
    const [latitude, setLatitude] = React.useState<number | null>(null);
    const [longitude, setLongitude] = React.useState<number | null>(null);

    const [checkoutLoading, setCheckoutLoading] = React.useState(false);

    const [locLoading, setLocLoading] = React.useState(false);

    const [batterySize, setBatterySize] = React.useState('');
    const [batteryType, setBatteryType] = React.useState('');
    const [batteryBrand, setBatteryBrand] = React.useState('');

    const { createBooking } = useBooking();

    const toYMD = (d: Date) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const toDayKey = (d: Date) =>
        d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const toDayLabel = (d: Date) =>
        d.toLocaleDateString(isRTL ? 'ar' : 'en-US', { weekday: 'long' });

    const defaultRegion = {
        latitude: 24.7136, // Riyadh
        longitude: 46.6753,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    React.useEffect(() => {
        if (!packageId) return;

        (async () => {
            try {
                setLoading(true);
                const data = await fetchPackageById(packageId);
                setPkg(data);
            } catch (e) {
                console.log('[YourBooking] failed to fetch package:', e);
                setPkg(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [packageId, fetchPackageById]);

    React.useEffect(() => {
        (async () => {
            try {
                const c = await getCarProfile();
                setCar(c);

                const u: any = await getUserData();

                if (u) {
                    if (u.mobileNumber) setMobileNumber(u.mobileNumber);
                    if (u.email) setEmail(u.email);

                    if (u.address) {
                        setAddress(u.address);
                    } else if (u.city) {
                        setAddress(u.city);
                    }

                    const lat = u.location?.latitude ?? u.location?.lat;
                    const lng = u.location?.longitude ?? u.location?.lng;

                    if (
                        typeof lat === 'number' &&
                        typeof lng === 'number' &&
                        (lat !== 0 || lng !== 0)
                    ) {
                        setLatitude(lat);
                        setLongitude(lng);
                    }
                }

                if (u?.id && packageId) {
                    const ownRes = await checkIfUserOwnsPackage(u.id as string, packageId);
                    const first = ownRes?.results?.[0];
                    if (first?.id) {
                        setUserPackageId(first.id);
                    }
                }
            } catch (e) {
                console.log('[YourBooking] car/userPackage fetch error:', e);
            }
        })();
    }, [packageId]);

    React.useEffect(() => {
        if (!packageId) return;
        (async () => {
            try {
                const day = toDayKey(bookingDate);
                setSelectedDay(toDayLabel(bookingDate));
                const res = await fetchSlotsByDay({ day, packageId, limit: 50 });
                setSlots(res.results || []);
            } catch (e) {
                setSlots([]);
            }
        })();
    }, [bookingDate, packageId, fetchSlotsByDay]);

    React.useEffect(() => {
        fetchAddons();
    }, [fetchAddons]);

    const priceLabel =
        pkg?.pricingType === 'fixed'
            ? `SAR ${pkg.fixedPrice}`
            : i18n.t('bookingnew.vehicleBasedPricing');

    const isBatteryPackage = pkg?.name?.toLowerCase().includes('battery');

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: i18n.t('bookingnew.locationPermissionTitle'),
                    message: i18n.t('bookingnew.locationPermissionMessage'),
                    buttonPositive: i18n.t('common.ok'),
                },
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const handleUseCurrentLocation = async () => {
        try {
            setLocLoading(true);
            const ok = await requestLocationPermission();
            if (!ok) {
                Alert.alert(i18n.t('bookingnew.permissionRequired'), i18n.t('bookingnew.enableLocation'));
                setLocLoading(false);
                return;
            }

            Geolocation.getCurrentPosition(
                async pos => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    setLatitude(lat);
                    setLongitude(lng);

                    try {
                        const resp = await fetch(
                            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&language=${isRTL ? 'ar' : 'en'}`,
                        );
                        const geo = await resp.json();
                        const formatted = geo?.results?.[0]?.formatted_address;
                        if (formatted) {
                            setAddress(formatted);
                        }
                    } catch (err) {
                        console.log('Reverse geocode error', err);
                    } finally {
                        setLocLoading(false);
                    }
                },
                err => {
                    console.log('Geolocation error', err);
                    setLocLoading(false);
                    Alert.alert(i18n.t('bookingnew.error'), i18n.t('bookingnew.unableToGetLocation'));
                },
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
            );
        } catch (e) {
            console.log('Current location error', e);
            setLocLoading(false);
        }
    };

    const updateAddonQty = (addonId: string, delta: number) => {
        setSelectedAddons(prev => {
            const current = prev[addonId] ?? 0;
            const next = Math.max(0, current + delta);

            const copy: Record<string, number> = { ...prev };
            if (next === 0) {
                delete copy[addonId];
            } else {
                copy[addonId] = next;
            }
            return copy;
        });
    };

    const selectedAddonsEntries = Object.entries(selectedAddons) as [string, number][];

    const additionalAddOns =
        addons.length === 0
            ? []
            : selectedAddonsEntries
                .filter(([, qty]) => qty > 0)
                .map(([addonId, quantity]) => {
                    const addon = addons.find(a => a.id === addonId);
                    if (!addon) return null;
                    return {
                        addOnId: addonId,
                        quantity,
                        price: addon.price,
                    };
                })
                .filter((x): x is { addOnId: string; quantity: number; price: number } => x !== null);

    const addonsTotal = additionalAddOns.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    const addonsVat = addonsTotal * 0.15;
    const addonsTotalWithVat = addonsTotal + addonsVat;

    const handleMapPress = (e: MapPressEvent) => {
        const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
        setLatitude(lat);
        setLongitude(lng);
    };

    const canCheckout =
        !!car &&
        !!userPackageId &&
        !!selectedSlot &&
        mobileNumber.trim().length > 0 &&
        email.trim().length > 0 &&
        address.trim().length > 0 &&
        latitude !== null &&
        longitude !== null &&
        (!isBatteryPackage ||
            (batterySize.trim().length > 0 &&
                batteryType.trim().length > 0 &&
                batteryBrand.trim().length > 0));

    if (loading || !pkg) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator size="large" color={BRAND} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}>
                {/* Package summary card */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 18,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 2,
                    }}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: '#111827',
                            marginBottom: 4,
                            ...textAlign,
                        }}>
                        {pkg.name}
                    </Text>

                    <Text
                        style={{
                            fontSize: 13,
                            color: '#6B7280',
                            marginBottom: 8,
                            ...textAlign,
                        }}>
                        {pkg.pricingType === 'fixed'
                            ? i18n.t('bookingnew.fixedPricePackage')
                            : i18n.t('bookingnew.vehicleBasedPricing')}
                    </Text>

                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: BRAND,
                            marginBottom: 10,
                            ...textAlign,
                        }}>
                        {priceLabel}
                    </Text>

                    {pkg.description ? (
                        <Text
                            style={{
                                fontSize: 14,
                                lineHeight: 20,
                                color: '#4B5563',
                                ...textAlign,
                            }}>
                            {pkg.description}
                        </Text>
                    ) : null}

                    <View
                        style={{
                            ...rowDir,
                            justifyContent: 'space-between',
                            marginTop: 12,
                        }}>
                        <Text
                            style={{
                                fontSize: 13,
                                color: '#374151',
                                ...textAlign,
                            }}>
                            {i18n.t('bookingnew.usageLimit')}{' '}
                            <Text style={{ fontWeight: '600' }}>
                                {pkg.usageLimit ?? i18n.t('bookingnew.unlimited')}
                            </Text>
                        </Text>

                        <Text
                            style={{
                                fontSize: 13,
                                color: '#374151',
                                ...textAlign,
                            }}>
                            {pkg.hasExpiry
                                ? i18n.t('bookingnew.expires', {
                                    date: pkg.expiryDate || i18n.t('bookingnew.na'),
                                })
                                : i18n.t('bookingnew.noExpiry')}
                        </Text>
                    </View>
                </View>

                {/* Slot selector */}
                <View style={{ marginBottom: 16 }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: 8,
                            ...textAlign,
                        }}>
                        {i18n.t('bookingnew.chooseSlot')}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => setCalendarOpen(true)}
                        style={{
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            backgroundColor: '#fff',
                            paddingVertical: 12,
                            paddingHorizontal: 14,
                            ...rowDir,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 12,
                        }}>
                        <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500', ...textAlign }}>
                            {toYMD(bookingDate)}
                        </Text>
                        <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    <Modal
                        visible={calendarOpen}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setCalendarOpen(false)}
                    >
                        <Pressable
                            style={{
                                flex: 1,
                                backgroundColor: "rgba(0,0,0,0.45)",
                                justifyContent: "center",
                                padding: 16,
                            }}
                            onPress={() => setCalendarOpen(false)}
                        >
                            <Pressable
                                style={{ backgroundColor: "#fff", borderRadius: 16, overflow: "hidden" }}
                                onPress={() => { }}
                            >
                                <Calendar
                                    minDate={toYMD(new Date())}
                                    markedDates={{
                                        [toYMD(bookingDate)]: { selected: true },
                                    }}
                                    onDayPress={(day) => {
                                        const picked = new Date(day.dateString + "T00:00:00");
                                        setBookingDate(picked);
                                        setSelectedDay(toDayLabel(picked));
                                        setSelectedSlot(null);
                                        setCalendarOpen(false);
                                    }}
                                />
                            </Pressable>
                        </Pressable>
                    </Modal>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => slotSheetRef.current?.open()}
                        style={{
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            backgroundColor: '#fff',
                            paddingVertical: 12,
                            paddingHorizontal: 14,
                            ...rowDir,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <View
                            style={{
                                flex: 1,
                                marginRight: isRTL ? 0 : 8,
                                marginLeft: isRTL ? 8 : 0,
                            }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: selectedSlot ? '#111827' : '#9CA3AF',
                                    fontWeight: selectedSlot ? '500' : '400',
                                    ...textAlign,
                                }}
                                numberOfLines={1}>
                                {selectedSlot
                                    ? `${selectedDay} • ${selectedSlot.time}`
                                    : slotsLoading
                                        ? i18n.t('bookingnew.loadingSlots')
                                        : i18n.t('bookingnew.tapToChooseTime')}
                            </Text>
                            {selectedSlot && (
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: '#6B7280',
                                        marginTop: 2,
                                        ...textAlign,
                                    }}
                                    numberOfLines={1}>
                                    {i18n.t('bookingnew.changeSlot')}
                                </Text>
                            )}
                        </View>

                        <Ionicons name="time-outline" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Slot RBSheet */}
                <RBSheet
                    ref={slotSheetRef}
                    {...{ closeOnDragDown: true }}
                    closeOnPressMask
                    customStyles={{
                        wrapper: { backgroundColor: 'rgba(0,0,0,0.4)' },
                        container: {
                            height: '70%',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 16,
                            paddingBottom: 24,
                        },
                    }}>
                    <View style={{ ...rowDir, alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', ...textAlign }}>
                                {i18n.t('bookingnew.chooseTime')}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4, ...textAlign }}>
                                {toYMD(bookingDate)} • {selectedDay}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => slotSheetRef.current?.close()}>
                            <Ionicons name="close" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {slotsLoading ? (
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 16,
                            }}>
                            <ActivityIndicator size="small" color={BRAND} />
                        </View>
                    ) : slots.length === 0 ? (
                        <View style={{ paddingVertical: 12 }}>
                            <Text style={{ color: '#6B7280', fontSize: 14, ...textAlign }}>
                                {i18n.t('bookingnew.noSlotsForDay')}
                            </Text>
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 1 }}>
                            {slots.map(slot => {
                                const isActive = selectedSlot?.id === slot.id;
                                return (
                                    <TouchableOpacity
                                        key={slot.id}
                                        onPress={() => {
                                            setSelectedSlot(slot);
                                            slotSheetRef.current?.close();
                                        }}
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 10,
                                            borderRadius: 10,
                                            marginBottom: 8,
                                            backgroundColor: isActive ? `${BRAND}10` : '#F9FAFB',
                                            borderWidth: 1,
                                            borderColor: isActive ? BRAND : '#E5E7EB',
                                            ...rowDir,
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                        <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500', ...textAlign }}>
                                            {slot.time}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#6B7280', ...textAlign }}>
                                            {i18n.t('bookingnew.minutes', { count: slot.duration })}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}
                </RBSheet>

                {/* Add-ons trigger */}
                <View style={{ marginBottom: 16 }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: 8,
                            ...textAlign,
                        }}>
                        {i18n.t('bookingnew.additionalAddons')}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => addonSheetRef.current?.open()}
                        style={{
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            backgroundColor: '#fff',
                            paddingVertical: 12,
                            paddingHorizontal: 14,
                            ...rowDir,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <View
                            style={{
                                flex: 1,
                                marginRight: isRTL ? 0 : 8,
                                marginLeft: isRTL ? 8 : 0,
                            }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: addonsTotal > 0 ? '#111827' : '#9CA3AF',
                                    fontWeight: addonsTotal > 0 ? '500' : '400',
                                    ...textAlign,
                                }}
                                numberOfLines={1}>
                                {addonsTotal > 0
                                    ? i18n.t('bookingnew.selectedAddonsCount', { count: Object.keys(selectedAddons).length })
                                    : i18n.t('bookingnew.tapToAddExtras')}
                            </Text>
                            {addonsTotal > 0 && (
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: BRAND,
                                        marginTop: 2,
                                        ...textAlign,
                                    }}
                                    numberOfLines={2}>
                                    {i18n.t('bookingnew.addonsLabel')}: SAR {addonsTotal.toFixed(2)} | {i18n.t('bookingnew.vat15')}: SAR{' '}
                                    {addonsVat.toFixed(2)} | {i18n.t('bookingnew.total')}: SAR {addonsTotalWithVat.toFixed(2)}
                                </Text>
                            )}
                        </View>

                        <Ionicons name="add-circle-outline" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Add-ons RBSheet */}
                <RBSheet
                    ref={addonSheetRef}
                    {...{ closeOnDragDown: true }}
                    closeOnPressMask
                    customStyles={{
                        wrapper: { backgroundColor: 'rgba(0,0,0,0.4)' },
                        container: {
                            height: '65%',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 16,
                            paddingBottom: 24,
                        },
                    }}>
                    <View style={{ ...rowDir, alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', ...textAlign }}>
                            {i18n.t('bookingnew.chooseAddons')}
                        </Text>
                        <TouchableOpacity onPress={() => addonSheetRef.current?.close()}>
                            <Ionicons name="close" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {addonsLoading ? (
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 16,
                            }}>
                            <ActivityIndicator size="small" color={BRAND} />
                        </View>
                    ) : addons.length === 0 ? (
                        <View style={{ paddingVertical: 12 }}>
                            <Text style={{ fontSize: 13, color: '#6B7280', ...textAlign }}>
                                {i18n.t('bookingnew.noAddons')}
                            </Text>
                        </View>
                    ) : (
                        <>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
                                {addons.map((addon: AddonItem) => {
                                    const qty = selectedAddons[addon.id] ?? 0;
                                    return (
                                        <View
                                            key={addon.id}
                                            style={{
                                                paddingVertical: 10,
                                                borderBottomWidth: 0.5,
                                                borderBottomColor: '#E5E7EB',
                                                ...rowDir,
                                                alignItems: 'center',
                                            }}>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    paddingRight: isRTL ? 0 : 8,
                                                    paddingLeft: isRTL ? 8 : 0,
                                                }}>
                                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', ...textAlign }}>
                                                    {addon.name}
                                                </Text>
                                                {addon.description ? (
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: '#6B7280',
                                                            marginTop: 2,
                                                            ...textAlign,
                                                        }}
                                                        numberOfLines={2}>
                                                        {addon.description}
                                                    </Text>
                                                ) : null}
                                                <Text style={{ fontSize: 13, color: BRAND, marginTop: 4, ...textAlign }}>
                                                    SAR {addon.price}
                                                </Text>
                                            </View>

                                            <View style={{ ...rowDir, alignItems: 'center' }}>
                                                <TouchableOpacity
                                                    onPress={() => updateAddonQty(addon.id, -1)}
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: 999,
                                                        borderWidth: 1,
                                                        borderColor: '#E5E7EB',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginRight: isRTL ? 0 : 8,
                                                        marginLeft: isRTL ? 8 : 0,
                                                    }}>
                                                    <Ionicons name="remove" size={16} color="#374151" />
                                                </TouchableOpacity>

                                                <Text
                                                    style={{
                                                        minWidth: 24,
                                                        textAlign: 'center',
                                                        fontSize: 14,
                                                        fontWeight: '500',
                                                        color: '#111827',
                                                    }}>
                                                    {qty}
                                                </Text>

                                                <TouchableOpacity
                                                    onPress={() => updateAddonQty(addon.id, 1)}
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: 999,
                                                        borderWidth: 1,
                                                        borderColor: BRAND,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginLeft: isRTL ? 0 : 8,
                                                        marginRight: isRTL ? 8 : 0,
                                                    }}>
                                                    <Ionicons name="add" size={16} color={BRAND} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })}
                            </ScrollView>

                            {addonsTotal > 0 && (
                                <View
                                    style={{
                                        marginTop: 8,
                                        paddingTop: 8,
                                        borderTopWidth: 0.5,
                                        borderTopColor: '#E5E7EB',
                                        ...rowDir,
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600', ...textAlign }}>
                                        {i18n.t('bookingnew.addonsTotal')}
                                    </Text>
                                    <Text style={{ fontSize: 13, color: BRAND, fontWeight: '700', ...textAlign }}>
                                        SAR {addonsTotal.toFixed(2)}
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </RBSheet>

                {/* Contact & instructions */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 14,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                    }}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 13, fontWeight: '500', color: '#111827', marginBottom: 4, ...textAlign }}>
                            {i18n.t('bookingnew.mobileNumber')}
                        </Text>
                        <TextInput
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                            keyboardType="phone-pad"
                            placeholder={i18n.t('bookingnew.mobilePlaceholder')}
                            placeholderTextColor="#9CA3AF"
                            style={{
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                fontSize: 14,
                                color: '#111827',
                                backgroundColor: '#F9FAFB',
                                textAlign: isRTL ? 'right' : 'left',
                            }}
                        />
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 13, fontWeight: '500', color: '#111827', marginBottom: 4, ...textAlign }}>
                            {i18n.t('bookingnew.email')}
                        </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder={i18n.t('bookingnew.emailPlaceholder')}
                            placeholderTextColor="#9CA3AF"
                            style={{
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                fontSize: 14,
                                color: '#111827',
                                backgroundColor: '#F9FAFB',
                                textAlign: isRTL ? 'right' : 'left',
                            }}
                        />
                    </View>

                    <View>
                        <Text style={{ fontSize: 13, fontWeight: '500', color: '#111827', marginBottom: 4, ...textAlign }}>
                            {i18n.t('bookingnew.specialInstructions')}
                        </Text>
                        <TextInput
                            value={specialInstructions}
                            onChangeText={setSpecialInstructions}
                            placeholder={i18n.t('bookingnew.specialInstructionsPlaceholder')}
                            placeholderTextColor="#9CA3AF"
                            multiline
                            style={{
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                fontSize: 14,
                                color: '#111827',
                                backgroundColor: '#F9FAFB',
                                minHeight: 70,
                                textAlignVertical: 'top',
                                textAlign: isRTL ? 'right' : 'left',
                            }}
                        />
                    </View>

                    {isBatteryPackage && (
                        <>
                            <View style={{ marginTop: 12 }}>
                                <Text style={{ fontSize: 13, fontWeight: '500', color: '#111827', marginBottom: 4, ...textAlign }}>
                                    {i18n.t('bookingnew.batterySize')}
                                </Text>
                                <TextInput
                                    value={batterySize}
                                    onChangeText={setBatterySize}
                                    placeholder={i18n.t('bookingnew.batterySizePlaceholder')}
                                    placeholderTextColor="#9CA3AF"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#E5E7EB',
                                        borderRadius: 10,
                                        paddingHorizontal: 12,
                                        paddingVertical: 10,
                                        fontSize: 14,
                                        color: '#111827',
                                        backgroundColor: '#F9FAFB',
                                        textAlign: isRTL ? 'right' : 'left',
                                    }}
                                />
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 13, fontWeight: '500', color: '#111827', marginBottom: 4, ...textAlign }}>
                                    {i18n.t('bookingnew.batteryType')}
                                </Text>
                                <TextInput
                                    value={batteryType}
                                    onChangeText={setBatteryType}
                                    placeholder={i18n.t('bookingnew.batteryTypePlaceholder')}
                                    placeholderTextColor="#9CA3AF"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#E5E7EB',
                                        borderRadius: 10,
                                        paddingHorizontal: 12,
                                        paddingVertical: 10,
                                        fontSize: 14,
                                        color: '#111827',
                                        backgroundColor: '#F9FAFB',
                                        textAlign: isRTL ? 'right' : 'left',
                                    }}
                                />
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 13, fontWeight: '500', color: '#111827', marginBottom: 4, ...textAlign }}>
                                    {i18n.t('bookingnew.batteryBrand')}
                                </Text>
                                <TextInput
                                    value={batteryBrand}
                                    onChangeText={setBatteryBrand}
                                    placeholder={i18n.t('bookingnew.batteryBrandPlaceholder')}
                                    placeholderTextColor="#9CA3AF"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#E5E7EB',
                                        borderRadius: 10,
                                        paddingHorizontal: 12,
                                        paddingVertical: 10,
                                        fontSize: 14,
                                        color: '#111827',
                                        backgroundColor: '#F9FAFB',
                                        textAlign: isRTL ? 'right' : 'left',
                                    }}
                                />
                            </View>
                        </>
                    )}
                </View>

                {/* Address + lat/lng preview */}
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8, ...textAlign }}>
                        {i18n.t('bookingnew.address')}
                    </Text>

                    <TouchableOpacity
                        onPress={() => addressSheetRef.current?.open()}
                        style={{
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            backgroundColor: '#fff',
                            paddingVertical: 12,
                            paddingHorizontal: 14,
                        }}>
                        <Text style={{ fontSize: 14, color: address ? '#111827' : '#9CA3AF', ...textAlign }} numberOfLines={2}>
                            {address || i18n.t('bookingnew.tapToChooseAddress')}
                        </Text>
                    </TouchableOpacity>

                    {latitude !== null && longitude !== null && (
                        <Text style={{ marginTop: 6, fontSize: 12, color: '#374151', ...textAlign }}>
                            {i18n.t('bookingnew.lat')}: {latitude.toFixed(6)} | {i18n.t('bookingnew.lng')}: {longitude.toFixed(6)}
                        </Text>
                    )}
                </View>

                {/* ADDRESS FULLSCREEN SHEET */}
                <RBSheet
                    ref={addressSheetRef}
                    {...{ closeOnDragDown: true }}
                    closeOnPressMask
                    customStyles={{
                        wrapper: { backgroundColor: 'rgba(0,0,0,0.4)' },
                        container: {
                            height: '100%',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 16,
                        },
                    }}>
                    <View style={{ flex: 1 }}>
                        {/* Header */}
                        <View style={{ ...rowDir, alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', ...textAlign }}>
                                {i18n.t('bookingnew.selectAddress')}
                            </Text>
                            <TouchableOpacity onPress={() => addressSheetRef.current?.close()}>
                                <Ionicons name="close" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={handleUseCurrentLocation}
                            disabled={locLoading}
                            style={{
                                marginTop: 8,
                                marginBottom: 10,
                                alignSelf: isRTL ? 'flex-end' : 'flex-start',
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 999,
                                backgroundColor: '#EEF2FF',
                                ...rowDir,
                                alignItems: 'center',
                            }}>
                            {locLoading ? (
                                <ActivityIndicator size="small" color={BRAND} />
                            ) : (
                                <>
                                    <Ionicons name="locate-outline" size={16} color={BRAND} />
                                    <Text
                                        style={{
                                            marginLeft: isRTL ? 0 : 6,
                                            marginRight: isRTL ? 6 : 0,
                                            fontSize: 13,
                                            color: BRAND,
                                            fontWeight: '500',
                                            ...textAlign,
                                        }}>
                                        {i18n.t('bookingnew.useMyCurrentLocation')}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Google Places (NO ScrollView wrapper here) */}
                        <GooglePlacesAutocomplete
                            placeholder={i18n.t('bookingnew.searchYourAddress')}
                            fetchDetails
                            enablePoweredByContainer={false}
                            keyboardShouldPersistTaps="handled"
                            query={{
                                key: GOOGLE_API_KEY,
                                language: isRTL ? 'ar' : 'en',
                                components: 'country:sa',
                            }}
                            onPress={(data, details = null) => {
                                const formatted = details?.formatted_address || data.description;
                                setAddress(formatted);

                                const loc = details?.geometry?.location;
                                if (loc) {
                                    setLatitude(loc.lat);
                                    setLongitude(loc.lng);
                                }
                            }}
                            textInputProps={{
                                placeholderTextColor: '#9CA3AF',
                                style: {
                                    height: 44,
                                    fontSize: 14,
                                    color: '#111827',
                                    paddingHorizontal: 10,
                                    textAlign: isRTL ? 'right' : 'left',
                                    width: '100%',
                                },
                            }}
                            styles={{
                                container: { flex: 0 },
                                textInputContainer: {
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    backgroundColor: '#fff',
                                },
                                listView: {
                                    backgroundColor: '#fff',
                                    borderRadius: 12,
                                    marginTop: 4,
                                    elevation: 6,
                                    maxHeight: 220,
                                },
                                row: { padding: 10, minHeight: 44 },
                                description: { color: '#111827', fontSize: 14 },
                                predefinedPlacesDescription: { color: '#111827' },
                            }}
                        />

                        {/* Map with flex below the list */}
                        <View style={{ flex: 1, borderRadius: 16, overflow: 'hidden', marginTop: 16 }}>
                            <MapView
                                style={{ flex: 1 }}
                                initialRegion={defaultRegion}
                                region={{
                                    latitude: latitude ?? defaultRegion.latitude,
                                    longitude: longitude ?? defaultRegion.longitude,
                                    latitudeDelta: defaultRegion.latitudeDelta,
                                    longitudeDelta: defaultRegion.longitudeDelta,
                                }}
                                onPress={handleMapPress}>
                                {latitude !== null && longitude !== null && (
                                    <Marker
                                        coordinate={{ latitude, longitude }}
                                        title={i18n.t('bookingnew.selectedLocation')}
                                    />
                                )}
                            </MapView>
                        </View>

                        {/* Lat/Lng display */}
                        {latitude !== null && longitude !== null && (
                            <Text style={{ marginTop: 8, fontSize: 13, color: '#111827', ...textAlign }}>
                                {i18n.t('bookingnew.lat')}: {latitude.toFixed(6)} | {i18n.t('bookingnew.lng')}: {longitude.toFixed(6)}
                            </Text>
                        )}

                        {/* Confirm button */}
                        <TouchableOpacity
                            onPress={() => {
                                if (!address || latitude === null || longitude === null) {
                                    Alert.alert(i18n.t('bookingnew.selectAddressTitle'), i18n.t('bookingnew.selectAddressMsg'));
                                    return;
                                }
                                addressSheetRef.current?.close();
                            }}
                            style={{
                                marginTop: 10,
                                paddingVertical: 12,
                                borderRadius: 999,
                                backgroundColor: BRAND,
                                alignItems: 'center',
                            }}>
                            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
                                {i18n.t('bookingnew.useThisLocation')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </RBSheet>

                {/* Checkout button */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={!canCheckout}
                    style={{
                        backgroundColor: canCheckout ? BRAND : '#9CA3AF',
                        paddingVertical: 14,
                        borderRadius: 999,
                        alignItems: 'center',
                        marginTop: 8,
                        opacity: canCheckout ? 1 : 0.7,
                    }}
                    onPress={async () => {
                        try {
                            if (!car || !selectedSlot || !mobileNumber || !address || latitude === null || longitude === null) {
                                Alert.alert(i18n.t('bookingnew.fillRequired'));
                                return;
                            }

                            setCheckoutLoading(true);

                            const payload = {
                                carId: car?._id || car?.id,
                                userPackageId: userPackageId!,
                                packageId,
                                slotId: selectedSlot.id,
                                bookingDate: toYMD(bookingDate),
                                additionalAddOns,
                                mobileNumber,
                                email,
                                address,
                                location: { latitude, longitude },
                                specialInstructions: specialInstructions.trim() || undefined,
                                ...(isBatteryPackage && {
                                    batterySize,
                                    batteryType,
                                    batteryBrand,
                                }),
                            };

                            const response = await createBooking(payload);

                            const bookingId =
                                response?._id ||
                                response?.id ||
                                response?.booking?._id ||
                                response?.data?._id ||
                                response?.data?.id;

                            setCheckoutLoading(false);
                            navigation.replace('Success', { bookingId });
                        } catch (e) {
                            setCheckoutLoading(false);
                            console.log('Create bookingnew error', e);
                            Alert.alert(i18n.t('bookingnew.error'), i18n.t('bookingnew.createBookingFailed'));
                        }
                    }}>
                    {checkoutLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                            {i18n.t('bookingnew.checkout')}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default YourBooking;
