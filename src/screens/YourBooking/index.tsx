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
} from 'react-native';
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

const GOOGLE_API_KEY = 'AIzaSyApI2bRWLV7R3ID776FLL1N51MtN9f34Uw';

const BRAND = '#223671';

type RouteParams = { packageId: string };

const YourBooking: React.FC = () => {
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
    const [daysToShow, setDaysToShow] = React.useState<string[]>([]);
    const [slots, setSlots] = React.useState<SlotItem[]>([]);
    const [selectedSlot, setSelectedSlot] = React.useState<SlotItem | null>(null);

    const { loading: addonsLoading, addons, fetchAddons } = useAddons();
    const [selectedAddons, setSelectedAddons] = React.useState<Record<string, number>>({});

    const [mobileNumber, setMobileNumber] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [specialInstructions, setSpecialInstructions] = React.useState('');

    const [address, setAddress] = React.useState('');
    const [latitude, setLatitude] = React.useState<number | null>(null);
    const [longitude, setLongitude] = React.useState<number | null>(null);

    const [checkoutLoading, setCheckoutLoading] = React.useState(false);

    const { createBooking } = useBooking();

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

                const u = await getUserData();
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
        const all = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
        ];

        const jsDay = new Date().getDay(); // 0 = Sun ... 6 = Sat
        const startIdx = (jsDay + 6) % 7; // 0 = Mon ... 6 = Sun

        const ordered = all.slice(startIdx);
        setDaysToShow(ordered);
        setSelectedDay(all[startIdx]);
    }, []);

    React.useEffect(() => {
        if (!selectedDay) return;
        (async () => {
            try {
                const res = await fetchSlotsByDay({ day: selectedDay, limit: 50 });
                setSlots(res.results || []);
            } catch (e) {
                console.log('[YourBooking] fetch slots error:', e);
                setSlots([]);
            }
        })();
    }, [selectedDay, fetchSlotsByDay]);

    React.useEffect(() => {
        fetchAddons();
    }, [fetchAddons]);

    const priceLabel =
        pkg?.pricingType === 'fixed'
            ? `SAR ${pkg.fixedPrice}`
            : 'Vehicle based pricing';

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

    const additionalAddOns =
        addons.length === 0
            ? []
            : Object.entries(selectedAddons)
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
                .filter(Boolean) as { addOnId: string; quantity: number; price: number }[];

    const addonsTotal = additionalAddOns.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

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
        specialInstructions.trim().length > 0 &&
        address.trim().length > 0 &&
        latitude !== null &&
        longitude !== null;

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
                        }}>
                        {pkg.name}
                    </Text>

                    <Text
                        style={{
                            fontSize: 13,
                            color: '#6B7280',
                            marginBottom: 8,
                        }}>
                        {pkg.pricingType === 'fixed'
                            ? 'Fixed price package'
                            : 'Vehicle based pricing'}
                    </Text>

                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: BRAND,
                            marginBottom: 10,
                        }}>
                        {priceLabel}
                    </Text>

                    {pkg.description ? (
                        <Text
                            style={{
                                fontSize: 14,
                                lineHeight: 20,
                                color: '#4B5563',
                            }}>
                            {pkg.description}
                        </Text>
                    ) : null}

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 12,
                        }}>
                        <Text
                            style={{
                                fontSize: 13,
                                color: '#374151',
                            }}>
                            Usage limit:{' '}
                            <Text style={{ fontWeight: '600' }}>
                                {pkg.usageLimit ?? 'Unlimited'}
                            </Text>
                        </Text>

                        <Text
                            style={{
                                fontSize: 13,
                                color: '#374151',
                            }}>
                            {pkg.hasExpiry
                                ? `Expires: ${pkg.expiryDate || 'N/A'}`
                                : 'No expiry'}
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
                        }}>
                        Choose Slot *
                    </Text>

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
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: selectedSlot ? '#111827' : '#9CA3AF',
                                    fontWeight: selectedSlot ? '500' : '400',
                                }}
                                numberOfLines={1}>
                                {selectedSlot
                                    ? `${selectedSlot.day ?? selectedDay} • ${selectedSlot.time}`
                                    : slotsLoading
                                        ? 'Loading slots...'
                                        : 'Tap to choose day & time'}
                            </Text>
                            {selectedSlot && (
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: '#6B7280',
                                        marginTop: 2,
                                    }}
                                    numberOfLines={1}>
                                    Change slot
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
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 8,
                        }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#111827',
                            }}>
                            Choose day & time
                        </Text>
                        <TouchableOpacity onPress={() => slotSheetRef.current?.close()}>
                            <Ionicons name="close" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {daysToShow.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingVertical: 8,
                                paddingHorizontal: 4,
                                marginBottom: 18,
                            }}>
                            {daysToShow.map(day => {
                                const isActive = day === selectedDay;
                                const label =
                                    day.charAt(0).toUpperCase() + day.slice(1);

                                return (
                                    <TouchableOpacity
                                        key={day}
                                        onPress={() => setSelectedDay(day)}
                                        style={{
                                            height: 32,
                                            paddingHorizontal: 14,
                                            borderRadius: 999,
                                            borderWidth: 1,
                                            borderColor: isActive ? BRAND : '#E5E7EB',
                                            backgroundColor: isActive ? `${BRAND}15` : '#fff',
                                            marginRight: 8,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 10,
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                lineHeight: 18,
                                                fontWeight: '500',
                                                color: isActive ? BRAND : '#374151',
                                            }}>
                                            {label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}

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
                            <Text style={{ color: '#6B7280', fontSize: 14 }}>
                                No slots available for this day.
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingTop: 1 }}>
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
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: '#111827',
                                                fontWeight: '500',
                                            }}>
                                            {slot.time}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: '#6B7280',
                                            }}>
                                            {slot.duration} min
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
                        }}>
                        Additional Add-ons
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
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: addonsTotal > 0 ? '#111827' : '#9CA3AF',
                                    fontWeight: addonsTotal > 0 ? '500' : '400',
                                }}
                                numberOfLines={1}>
                                {addonsTotal > 0
                                    ? `Selected ${Object.keys(selectedAddons).length} add-on(s)`
                                    : 'Tap to add extras to your wash'}
                            </Text>
                            {addonsTotal > 0 && (
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: BRAND,
                                        marginTop: 2,
                                    }}
                                    numberOfLines={1}>
                                    Add-ons total: SAR {addonsTotal}
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
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 8,
                        }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#111827',
                            }}>
                            Choose Add-ons
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
                            <Text style={{ fontSize: 13, color: '#6B7280' }}>
                                No add-ons available.
                            </Text>
                        </View>
                    ) : (
                        <>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 8 }}>
                                {addons.map((addon: AddonItem) => {
                                    const qty = selectedAddons[addon.id] ?? 0;
                                    return (
                                        <View
                                            key={addon.id}
                                            style={{
                                                paddingVertical: 10,
                                                borderBottomWidth: 0.5,
                                                borderBottomColor: '#E5E7EB',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}>
                                            <View style={{ flex: 1, paddingRight: 8 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: '600',
                                                        color: '#111827',
                                                    }}>
                                                    {addon.name}
                                                </Text>
                                                {addon.description ? (
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: '#6B7280',
                                                            marginTop: 2,
                                                        }}
                                                        numberOfLines={2}>
                                                        {addon.description}
                                                    </Text>
                                                ) : null}
                                                <Text
                                                    style={{
                                                        fontSize: 13,
                                                        color: BRAND,
                                                        marginTop: 4,
                                                    }}>
                                                    SAR {addon.price}
                                                </Text>
                                            </View>

                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
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
                                                        marginRight: 8,
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
                                                        marginLeft: 8,
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
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: '#374151',
                                            fontWeight: '600',
                                        }}>
                                        Add-ons Total
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: BRAND,
                                            fontWeight: '700',
                                        }}>
                                        SAR {addonsTotal}
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
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '500',
                                color: '#111827',
                                marginBottom: 4,
                            }}>
                            Mobile Number *
                        </Text>
                        <TextInput
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                            keyboardType="phone-pad"
                            placeholder="+9665..."
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
                            }}
                        />
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '500',
                                color: '#111827',
                                marginBottom: 4,
                            }}>
                            Email *
                        </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="you@example.com"
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
                            }}
                        />
                    </View>

                    <View>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '500',
                                color: '#111827',
                                marginBottom: 4,
                            }}>
                            Special Instructions *
                        </Text>
                        <TextInput
                            value={specialInstructions}
                            onChangeText={setSpecialInstructions}
                            placeholder="E.g. Come near the bakery"
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
                            }}
                        />
                    </View>
                </View>

                {/* Address + lat/lng preview */}
                <View style={{ marginBottom: 16 }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: 8,
                        }}>
                        Address *
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
                        <Text
                            style={{
                                fontSize: 14,
                                color: address ? '#111827' : '#9CA3AF',
                            }}
                            numberOfLines={2}>
                            {address || 'Tap to choose address'}
                        </Text>
                    </TouchableOpacity>

                    {latitude !== null && longitude !== null && (
                        <Text
                            style={{
                                marginTop: 6,
                                fontSize: 12,
                                color: '#374151',
                            }}>
                            Lat: {latitude.toFixed(6)} | Lng: {longitude.toFixed(6)}
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
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 8,
                            }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#111827',
                                }}>
                                Select Address
                            </Text>
                            <TouchableOpacity onPress={() => addressSheetRef.current?.close()}>
                                <Ionicons name="close" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Google Places (NO ScrollView wrapper here) */}
                        <GooglePlacesAutocomplete
                            placeholder="Search your address"
                            fetchDetails
                            enablePoweredByContainer={false}
                            keyboardShouldPersistTaps="handled"
                            query={{
                                key: GOOGLE_API_KEY,
                                language: 'en',
                                components: 'country:sa',
                            }}
                            onPress={(data, details = null) => {
                                const formatted =
                                    details?.formatted_address || data.description;
                                setAddress(formatted);

                                const loc = details?.geometry?.location;
                                if (loc) {
                                    setLatitude(loc.lat);
                                    setLongitude(loc.lng);
                                }
                                // don't close, user can still adjust on map
                            }}
                            textInputProps={{
                                placeholderTextColor: '#9CA3AF',
                                style: {
                                    height: 44,
                                    fontSize: 14,
                                    color: '#111827',
                                    paddingHorizontal: 10,
                                },
                            }}
                            styles={{
                                container: {
                                    flex: 0,
                                },
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
                                    maxHeight: 220, // so it scrolls inside, not over map
                                },
                                row: {
                                    padding: 10,
                                    minHeight: 44,
                                },
                                description: {
                                    color: '#111827',
                                    fontSize: 14,
                                },
                                predefinedPlacesDescription: {
                                    color: '#111827',
                                },
                            }}
                        />

                        {/* Map with flex below the list */}
                        <View
                            style={{
                                flex: 1,
                                borderRadius: 16,
                                overflow: 'hidden',
                                marginTop: 16,
                            }}>
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
                                        title="Selected location"
                                    />
                                )}
                            </MapView>
                        </View>

                        {/* Lat/Lng display */}
                        {latitude !== null && longitude !== null && (
                            <Text
                                style={{
                                    marginTop: 8,
                                    fontSize: 13,
                                    color: '#111827',
                                }}>
                                Lat: {latitude.toFixed(6)} | Lng: {longitude.toFixed(6)}
                            </Text>
                        )}

                        {/* Confirm button */}
                        <TouchableOpacity
                            onPress={() => {
                                if (!address || latitude === null || longitude === null) {
                                    Alert.alert(
                                        'Select address',
                                        'Please choose address and location on map.',
                                    );
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
                            <Text
                                style={{
                                    color: '#fff',
                                    fontWeight: '600',
                                    fontSize: 14,
                                }}>
                                Use This Location
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
                            if (
                                !car ||
                                !selectedSlot ||
                                !mobileNumber ||
                                !address ||
                                latitude === null ||
                                longitude === null
                            ) {
                                Alert.alert('Please fill all required fields.');
                                return;
                            }

                            setCheckoutLoading(true);

                            const payload = {
                                carId: car?._id || car?.id,
                                userPackageId: userPackageId!,
                                packageId,
                                slotId: selectedSlot.id,
                                additionalAddOns,
                                mobileNumber,
                                email,
                                address,
                                location: { latitude, longitude },
                                specialInstructions,
                            };

                            const response = await createBooking(payload);

                            setCheckoutLoading(false);
                            navigation.replace('Success', { bookingId: response.id });
                        } catch (e) {
                            setCheckoutLoading(false);
                            console.log('Create booking error', e);
                            Alert.alert('Error', 'Could not create booking, please try again.');
                        }
                    }}
                >
                    {checkoutLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: '600',
                            }}>
                            Checkout
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default YourBooking;
