import React, { useEffect, useMemo, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    I18nManager,
    TextStyle,
    ViewStyle,
    Platform,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePackage } from '../../hooks/usePackage';
import { usePromoCode } from '../../hooks/usePromoCode';
import { useUserPackage } from '../../hooks/useUserPackage';
import { getCarProfile } from '../../hooks/useCarStorage';
import i18n from '../../i18n';

const BRAND = '#223671';

const BuyNow: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const packageId = route.params?.packageId as string;

    const insets = useSafeAreaInsets();
    const headerTop = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : insets.top;

    const { validate, loading: promoLoading } = usePromoCode();
    const { purchase, loading: purchaseLoading } = useUserPackage();
    const { fetchPackageById } = usePackage();

    const [car, setCar] = useState<any>(null);
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');
    const [purchaseError, setPurchaseError] = useState('');

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [promo, setPromo] = useState('');

    const isRTL = useMemo(() => {
        return I18nManager.isRTL || i18n.language?.startsWith('ar');
    }, []);

    const rowDir: ViewStyle = useMemo(
        () => ({ flexDirection: isRTL ? 'row-reverse' : 'row' }),
        [isRTL]
    );

    const textAlignStyle: TextStyle = useMemo(
        () => ({ textAlign: isRTL ? 'right' : 'left' }),
        [isRTL]
    );

    const inputAlignStyle: TextStyle = useMemo(
        () => ({ textAlign: isRTL ? 'right' : 'left' }),
        [isRTL]
    );

    useEffect(() => {
        (async () => {
            const c = await getCarProfile();
            setCar(c);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchPackageById(packageId);
                setData(res);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [packageId, fetchPackageById]);

    const vehicleTypeId = typeof car?.type === 'string' ? car.type : car?.type?.id;

    const handlePromoValidate = async () => {
        try {
            setPromoError('');
            setPromoSuccess('');

            await validate(promo, packageId);
            setPromoSuccess(i18n.t('buyNow.promoApplied'));
        } catch (e: any) {
            setPromoError(e?.response?.data?.message || i18n.t('buyNow.invalidPromo'));
        }
    };

    const handlePurchase = async () => {
        if (!car) {
            setPurchaseError(i18n.t('buyNow.selectVehicleFirst'));
            return;
        }

        try {
            setPurchaseError('');
            await purchase(packageId, vehicleTypeId, promo || undefined);
            navigation.replace('PackageDetails', { packageId });
        } catch (e: any) {
            setPurchaseError(e?.response?.data?.message || i18n.t('buyNow.purchaseFailed'));
        }
    };

    if (loading || !data) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={[{ paddingTop: headerTop, paddingHorizontal: 16, paddingBottom: 12, alignItems: 'center' }, rowDir]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={BRAND} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={BRAND} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            {/* Header */}
            <View
                style={[
                    {
                        alignItems: 'center',
                        paddingTop: headerTop,
                        paddingHorizontal: 16,
                        paddingBottom: 12,
                        backgroundColor: '#fff',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E5E7EB',
                    },
                    rowDir,
                ]}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={BRAND} />
                </TouchableOpacity>

                <Text
                    style={[
                        {
                            marginLeft: isRTL ? 0 : 12,
                            marginRight: isRTL ? 12 : 0,
                            fontSize: 18,
                            fontWeight: '600',
                            color: '#111827',
                            flex: 1,
                        },
                        textAlignStyle,
                    ]}
                    numberOfLines={1}
                >
                    {i18n.t('buyNow.title')}
                </Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
                {/* Package card */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        padding: 18,
                        borderRadius: 16,
                        marginBottom: 20,
                        shadowColor: '#000',
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 2,
                    }}
                >
                    <Text style={[{ fontSize: 18, fontWeight: '700', color: '#111827' }, textAlignStyle]}>
                        {data.name}
                    </Text>

                    <Text
                        style={[
                            { marginTop: 8, fontSize: 14, color: '#6B7280', lineHeight: 20 },
                            textAlignStyle,
                        ]}
                    >
                        {data.description}
                    </Text>

                    <Text style={[{ marginTop: 14, fontSize: 17, fontWeight: '700', color: BRAND }, textAlignStyle]}>
                        {data.pricingType === 'fixed'
                            ? `SAR ${data.fixedPrice}`
                            : i18n.t('buyNow.vehicleBasedPricing')}
                    </Text>
                </View>

                {/* Promo code */}
                <View style={{ marginBottom: 20 }}>
                    <Text
                        style={[
                            { fontSize: 15, fontWeight: '600', marginBottom: 8, color: '#000' },
                            textAlignStyle,
                        ]}
                    >
                        {i18n.t('buyNow.promoTitle')}
                    </Text>

                    <TextInput
                        placeholder={i18n.t('buyNow.promoPlaceholder')}
                        value={promo}
                        onChangeText={setPromo}
                        style={[
                            {
                                backgroundColor: '#fff',
                                padding: 14,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                                fontSize: 15,
                                color: '#000',
                            },
                            inputAlignStyle,
                        ]}
                        placeholderTextColor="#ccc"
                    />

                    <TouchableOpacity
                        onPress={handlePromoValidate}
                        style={{
                            marginTop: 8,
                            backgroundColor: '#FFF',
                            borderWidth: 1,
                            borderColor: BRAND,
                            paddingVertical: 12,
                            borderRadius: 12,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: BRAND, fontWeight: '600' }}>
                            {promoLoading ? i18n.t('buyNow.checking') : i18n.t('buyNow.applyPromo')}
                        </Text>
                    </TouchableOpacity>

                    {!!promoError && <Text style={[{ color: 'red', marginTop: 6 }, textAlignStyle]}>{promoError}</Text>}
                    {!!promoSuccess && (
                        <Text style={[{ color: 'green', marginTop: 6 }, textAlignStyle]}>{promoSuccess}</Text>
                    )}
                </View>

                {/* Buy button */}
                {promo.length === 0 ? (
                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={{
                            backgroundColor: BRAND,
                            paddingVertical: 14,
                            borderRadius: 999,
                            alignItems: 'center',
                            marginTop: 12,
                        }}
                        onPress={handlePurchase}
                    >
                        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                            {purchaseLoading ? i18n.t('buyNow.processing') : i18n.t('buyNow.confirmPurchase')}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 6, color: '#6B7280' }}>
                        {i18n.t('buyNow.applyPromoOrClear')}
                    </Text>
                )}

                {!!purchaseError && (
                    <Text style={[{ color: 'red', marginTop: 8 }, textAlignStyle]}>{purchaseError}</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default BuyNow;
