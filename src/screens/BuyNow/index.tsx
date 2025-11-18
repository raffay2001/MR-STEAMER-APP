import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePackage } from '../../hooks/usePackage';
import { usePromoCode } from '../../hooks/usePromoCode';
import { useUserPackage } from '../../hooks/useUserPackage';
import { getCarProfile } from '../../hooks/useCarStorage';

const BRAND = '#223671';

const BuyNow = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const packageId = route.params?.packageId as string;
    const { validate, loading: promoLoading } = usePromoCode();
    const { purchase, loading: purchaseLoading } = useUserPackage();
    const [car, setCar] = useState<any>(null);
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');
    const [purchaseError, setPurchaseError] = useState('');

    const { fetchPackageById } = usePackage();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [promo, setPromo] = useState('');

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
    }, [packageId]);

    const vehicleTypeId =
        typeof car?.type === 'string' ? car.type : car?.type?.id;

    const handlePromoValidate = async () => {
        try {
            setPromoError('');
            setPromoSuccess('');

            // console.log('promo code: ', promo)
            // console.log('package id: ', packageId)

            const res = await validate(promo, packageId);
            setPromoSuccess('Promo applied ✔️');
        } catch (e: any) {
            setPromoError(e?.response?.data?.message || 'Invalid promo code');
        }
    };

    const handlePurchase = async () => {
        if (!car) {
            setPurchaseError('Please select a vehicle first.');
            return;
        }

        try {
            setPurchaseError('');
            const res = await purchase(packageId, vehicleTypeId, promo || undefined);

            navigation.replace('PackageDetails', { packageId });
        } catch (e: any) {
            setPurchaseError(e?.response?.data?.message || 'Purchase failed.');
        }
    };

    if (loading || !data) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ padding: 16 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={22} color={BRAND} />
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
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: '#fff',
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color={BRAND} />
                </TouchableOpacity>
                <Text
                    style={{
                        marginLeft: 12,
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#111827',
                    }}
                >
                    Buy Package
                </Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            >
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
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                        {data.name}
                    </Text>

                    <Text
                        style={{
                            marginTop: 8,
                            fontSize: 14,
                            color: '#6B7280',
                            lineHeight: 20,
                        }}
                    >
                        {data.description}
                    </Text>

                    <Text
                        style={{
                            marginTop: 14,
                            fontSize: 17,
                            fontWeight: '700',
                            color: BRAND,
                        }}
                    >
                        {data.pricingType === 'fixed'
                            ? `SAR ${data.fixedPrice}`
                            : 'Vehicle based pricing'}
                    </Text>
                </View>

                {/* Promo code */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 8, color: '#000', }}>
                        Promo Code
                    </Text>
                    <TextInput
                        placeholder="Enter promo code"
                        value={promo}
                        onChangeText={setPromo}
                        style={{
                            backgroundColor: '#fff',
                            padding: 14,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            fontSize: 15,
                            color: '#000',
                        }}
                        placeholderTextColor={"#ccc"}
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
                            {promoLoading ? 'Checking...' : 'Apply Promo'}
                        </Text>
                    </TouchableOpacity>

                    {promoError ? (
                        <Text style={{ color: 'red', marginTop: 6 }}>{promoError}</Text>
                    ) : null}

                    {promoSuccess ? (
                        <Text style={{ color: 'green', marginTop: 6 }}>{promoSuccess}</Text>
                    ) : null}
                </View>

                {/* Buy button */}
                {promo.length === 0 && (
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
                            {purchaseLoading ? 'Processing...' : 'Confirm Purchase'}
                        </Text>
                    </TouchableOpacity>
                )}

                {promo.length > 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 6, color: '#6B7280' }}>
                        Apply promo or clear it to continue
                    </Text>
                )}

                {purchaseError ? (
                    <Text style={{ color: 'red', marginTop: 8 }}>{purchaseError}</Text>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
};

export default BuyNow;
