import React from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePackage } from '../../hooks/usePackage';
import { getUserData } from '../../hooks/useAuthStorage';
import { checkIfUserOwnsPackage } from '../../api/package/package.api';

const BRAND = '#223671';

const PackageDetails: React.FC = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const [owns, setOwns] = React.useState(false);
    const packageId = route.params?.packageId as string;

    const { loading, fetchPackageById } = usePackage();
    const [data, setData] = React.useState<any>(null);
    const [localLoading, setLocalLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            try {
                setLocalLoading(true);
                const res = await fetchPackageById(packageId);
                setData(res);

                const u = await getUserData();
                if (u?.id) {
                    if (packageId) {
                        const ownRes = await checkIfUserOwnsPackage(u.id as string, packageId as string);
                        setOwns(ownRes.totalResults > 0);
                    }
                }

            } catch (e) {
                console.log('Package fetch error:', e);
            } finally {
                setLocalLoading(false);
            }
        })();
    }, [packageId, fetchPackageById]);

    const isLoading = loading || localLoading || !data;

    const isFixed = data?.pricingType === 'fixed';
    const basePrice =
        isFixed && typeof data.fixedPriceWithoutVAT === 'number'
            ? data.fixedPriceWithoutVAT
            : null;
    const totalPrice =
        isFixed && typeof data.fixedPrice === 'number'
            ? data.fixedPrice
            : null;
    const vatAmount =
        isFixed && basePrice != null && totalPrice != null
            ? totalPrice - basePrice
            : null;

    const priceLabel =
        isFixed && totalPrice != null
            ? `SAR ${totalPrice}`
            : 'Vehicle based pricing';

    const isAvailable = data?.isAvailable !== false;

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E5E7EB',
                    }}
                >
                    <TouchableOpacity onPress={() => navigation.navigate('Drawer', { screen: 'Home' })}>
                        <Ionicons name="arrow-back" size={22} color={BRAND} />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            marginLeft: 12,
                            color: '#111827',
                        }}
                    >
                        Package Details
                    </Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator size="large" color={BRAND} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            {/* Header (with back) */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: '#fff',
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                }}
            >
                <TouchableOpacity onPress={() => navigation.navigate('Drawer', { screen: 'Home' })}>
                    <Ionicons name="arrow-back" size={22} color={BRAND} />
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '600',
                        marginLeft: 12,
                        color: '#111827',
                    }}
                    numberOfLines={1}
                >
                    {data.name || 'Package Details'}
                </Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Main card */}
                <View
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 20,
                        padding: 18,
                        shadowColor: '#000',
                        shadowOpacity: 0.06,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 2,
                        marginBottom: 16,
                    }}
                >
                    {/* Title + Price */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                        }}
                    >
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: '700',
                                    color: '#111827',
                                    marginBottom: 4,
                                }}
                            >
                                {data.name}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: '#6B7280',
                                }}
                            >
                                {data.pricingType === 'fixed'
                                    ? 'Fixed price package'
                                    : 'Vehicle based pricing'}
                            </Text>
                        </View>

                        <View
                            style={{
                                backgroundColor: `${BRAND}15`,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 999,
                            }}
                        >
                            <Text
                                style={{
                                    color: BRAND,
                                    fontWeight: '700',
                                    fontSize: 16,
                                }}
                            >
                                {priceLabel}
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    {data.description ? (
                        <Text
                            style={{
                                marginTop: 12,
                                fontSize: 14,
                                lineHeight: 20,
                                color: '#4B5563',
                            }}
                        >
                            {data.description}
                        </Text>
                    ) : null}

                    {isFixed && basePrice != null && totalPrice != null && (
                        <View
                            style={{
                                marginTop: 12,
                                padding: 12,
                                borderRadius: 12,
                                backgroundColor: '#F9FAFB',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: '#374151',
                                    marginBottom: 2,
                                }}
                            >
                                Price (excl. VAT):{' '}
                                <Text style={{ fontWeight: '600' }}>SAR {basePrice}</Text>
                            </Text>
                            {vatAmount != null && (
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: '#374151',
                                        marginBottom: 2,
                                    }}
                                >
                                    VAT 15%:{' '}
                                    <Text style={{ fontWeight: '600' }}>SAR {vatAmount}</Text>
                                </Text>
                            )}
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: '#111827',
                                    fontWeight: '700',
                                    marginTop: 4,
                                }}
                            >
                                Total (incl. VAT): SAR {totalPrice}
                            </Text>
                        </View>
                    )}

                    {/* Usage / Expiry row */}
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 14,
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="repeat-outline" size={18} color={BRAND} />
                            <Text
                                style={{
                                    marginLeft: 6,
                                    fontSize: 13,
                                    color: '#374151',
                                }}
                            >
                                Usage limit:{' '}
                                <Text style={{ fontWeight: '600' }}>
                                    {data.usageLimit ?? 'Unlimited'}
                                </Text>
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="time-outline" size={18} color={BRAND} />
                            <Text
                                style={{
                                    marginLeft: 6,
                                    fontSize: 13,
                                    color: '#374151',
                                }}
                            >
                                {data.hasExpiry
                                    ? `Expires: ${data.expiryDate || 'N/A'}`
                                    : 'No expiry'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Services Included */}
                {Array.isArray(data.servicesIncluded) &&
                    data.servicesIncluded.length > 0 && (
                        <View
                            style={{
                                backgroundColor: '#ffffff',
                                borderRadius: 16,
                                padding: 16,
                                marginBottom: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#111827',
                                    marginBottom: 8,
                                }}
                            >
                                Services Included
                            </Text>

                            {data.servicesIncluded.map((svc: any) => (
                                <View
                                    key={svc.id}
                                    style={{
                                        marginBottom: 12,
                                        padding: 10,
                                        borderRadius: 12,
                                        backgroundColor: '#F9FAFB',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: '#111827',
                                            marginBottom: 4,
                                        }}
                                    >
                                        {svc.name}
                                    </Text>
                                    {svc.description ? (
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: '#6B7280',
                                                marginBottom: 6,
                                            }}
                                        >
                                            {svc.description}
                                        </Text>
                                    ) : null}

                                    {Array.isArray(svc.offerings) &&
                                        svc.offerings.length > 0 && (
                                            <View style={{ marginTop: 4 }}>
                                                {svc.offerings.map((off: any) => (
                                                    <View
                                                        key={off.id}
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'flex-start',
                                                            marginBottom: 4,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                marginRight: 6,
                                                                marginTop: 2,
                                                                color: BRAND,
                                                            }}
                                                        >
                                                            •
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                flex: 1,
                                                                fontSize: 13,
                                                                color: '#4B5563',
                                                            }}
                                                        >
                                                            {off.name}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                </View>
                            ))}
                        </View>
                    )}

                {/* Add-ons Included */}
                {Array.isArray(data.addOnsIncluded) &&
                    data.addOnsIncluded.length > 0 && (
                        <View
                            style={{
                                backgroundColor: '#ffffff',
                                borderRadius: 16,
                                padding: 16,
                                marginBottom: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#111827',
                                    marginBottom: 8,
                                }}
                            >
                                Add-ons Included
                            </Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {data.addOnsIncluded.map((a: any) => (
                                    <View
                                        key={a.id}
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 6,
                                            borderRadius: 999,
                                            backgroundColor: `${BRAND}10`,
                                            marginRight: 6,
                                            marginBottom: 6,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: BRAND,
                                                fontWeight: '500',
                                            }}
                                        >
                                            {a.name} · SAR {a.price}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                {/* Bottom CTA */}
                <TouchableOpacity
                    activeOpacity={isAvailable ? 0.85 : 1}
                    disabled={!isAvailable}
                    style={{
                        marginTop: 4,
                        backgroundColor: isAvailable ? BRAND : '#9CA3AF',
                        paddingVertical: 14,
                        borderRadius: 999,
                        alignItems: 'center',
                    }}
                    onPress={() => {
                        if (!isAvailable) return;
                        if (owns) {
                            navigation.navigate('YourBooking', { packageId });
                        } else {
                            navigation.navigate('BuyPackage', { packageId });
                        }
                    }}
                >
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 15,
                            fontWeight: '600',
                        }}
                    >
                        {isAvailable ? (owns ? 'Steam It' : 'Buy Now') : 'Not available right now'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PackageDetails;
