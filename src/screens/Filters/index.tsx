import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Pressable, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePackage } from '../../hooks/usePackage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import PricingDown from "../../assets/svgs/PricingDown.svg";
import PricingUp from "../../assets/svgs/PricingUp.svg";

const SERVICES = [
    { id: 'car-wash', label: 'Car Wash', disabled: false },
    { id: 'tyre-replacement', label: 'Tyre Replacement', disabled: true },
    { id: 'oil-change', label: 'Oil Change', disabled: true },
    { id: 'roadside', label: 'Roadside Assistance', disabled: true },
    { id: 'tow', label: 'Car Tow Service', disabled: true },
];

const SORT_OPTIONS = [
    { id: 'popularity', label: 'Popularity' },
    { id: 'rating', label: 'Rating' },
    { id: 'discount', label: 'Discount' },
    { id: 'price_desc', label: 'Price', trailing: 'down' },
    { id: 'price_asc', label: 'Price', trailing: 'up' },
];

const Filters: React.FC = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const [sortBy, setSortBy] = useState<string>('popularity');
    const [pkgNames, setPkgNames] = useState<string[]>([]);
    const [selectedPkgs, setSelectedPkgs] = useState<Record<string, boolean>>({});
    const { fetchPackages } = usePackage();
    const KEY = 'FILTERS_V1';

    const reset = async () => {
        setSelected({});
        setSelectedPkgs({});
        setSortBy('popularity');
        await AsyncStorage.removeItem(KEY);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Filters',
            headerTitleAlign: 'center',
            headerRight: () => (
                <TouchableOpacity onPress={reset} style={{ paddingHorizontal: 8 }}>
                    <Text style={{ color: '#111', fontSize: 14 }}>Reset</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        (async () => {
            try {
                // packages for names
                const res = await fetchPackages({ page: 1, limit: 100 });
                const names = Array.from(new Set((res?.results || []).map((p: any) => p?.name).filter(Boolean)));
                setPkgNames(names);
            } catch { }
        })();
    }, [fetchPackages]);

    useEffect(() => {
        const unsub = navigation.addListener('focus', async () => {
            try {
                const raw = await AsyncStorage.getItem(KEY);
                if (!raw) return;
                const saved = JSON.parse(raw);
                setSortBy(saved.sortBy || 'popularity');
                setSelected(saved.selected || {});
                setSelectedPkgs(saved.selectedPkgs || {});
            } catch { }
        });
        return unsub;
    }, [navigation]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#EFEFEF' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Packages (from backend) */}
                <View style={{ paddingHorizontal: 16, paddingVertical: 12, marginTop: 16 }}>
                    <Text style={{ color: '#111', fontSize: 16, fontWeight: '600' }}>Services</Text>
                </View>
                {pkgNames.map((name) => {
                    const checked = !!selectedPkgs[name];
                    return (
                        <Pressable
                            key={name}
                            onPress={() => setSelectedPkgs(prev => ({ ...prev, [name]: !checked }))}
                            style={{
                                backgroundColor: '#fff',
                                paddingHorizontal: 16,
                                height: 52,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderColor: '#EEE',
                            }}
                        >
                            <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={20} color="#000" />
                            <Text style={{ marginLeft: 12, color: '#000', fontSize: 16, fontWeight: '400' }}>
                                {name}
                            </Text>
                        </Pressable>
                    );
                })}

                {/* Sort By heading */}
                <View style={{ paddingHorizontal: 16, paddingVertical: 12, marginTop: 16 }}>
                    <Text style={{ color: '#111', fontSize: 16, fontWeight: '600' }}>Sort By</Text>
                </View>

                {/* Sort By list */}
                {SORT_OPTIONS.map(opt => {
                    const checked = sortBy === opt.id;
                    return (
                        <Pressable
                            key={opt.id}
                            onPress={() => setSortBy(opt.id)}
                            style={{
                                backgroundColor: '#fff',
                                paddingHorizontal: 16,
                                height: 52,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottomWidth: 1,
                                borderColor: '#EEE',
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons
                                    name={checked ? 'radio-button-on' : 'radio-button-off'}
                                    size={20}
                                    color="#111"
                                />
                                <Text style={{ marginLeft: 12, color: '#232323', fontSize: 14, fontWeight: '500', marginRight: 15 }}>
                                    {opt.label}
                                </Text>
                                {opt.trailing === 'down' ? (
                                    <PricingDown width={18} height={18} />
                                ) : opt.trailing === 'up' ? (
                                    <PricingUp width={18} height={18} />
                                ) : null}
                            </View>
                        </Pressable>
                    );
                })}

                {/* Apply button */}
                <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                    <TouchableOpacity
                        onPress={async () => {
                            const names = Object.keys(selectedPkgs).filter(k => selectedPkgs[k]);
                            await AsyncStorage.setItem(KEY, JSON.stringify({
                                sortBy,
                                selected,
                                selectedPkgs,
                            }));
                            DeviceEventEmitter.emit('HOME_FILTERS', { sortBy, names });
                            navigation.goBack();
                        }}
                        style={{
                            height: 48,
                            borderRadius: 12,
                            backgroundColor: '#2C4694',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Filters;
