import React from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePackage } from '../../hooks/usePackage';

const ChoosePackages: React.FC = () => {
    const navigation = useNavigation<any>();
    const { loading, fetchPackages } = usePackage();
    const [items, setItems] = React.useState<any[]>([]);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Choose Packages',
            headerTitleAlign: 'center',
        });
    }, [navigation]);

    React.useEffect(() => {
        (async () => {
            try {
                const data = await fetchPackages({ page: 1, limit: 50 });
                console.log(data)
                const list = data?.results ?? [];
                setItems(list);
                if (list.length > 0) setSelectedId(list[0].id);
            } catch {
                setItems([]);
            }
        })();
    }, [fetchPackages]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
                <Text style={{ marginTop: 8, color: '#000', fontSize: 14, fontWeight: '400' }}>
                    Choose a package for the best service
                </Text>

                {loading && items.length === 0 ? (
                    <View style={{ marginTop: 20 }}>
                        <ActivityIndicator />
                    </View>
                ) : items.length === 0 ? (
                    <Text style={{ marginTop: 16, color: '#666' }}>No items.</Text>
                ) : (
                    items.map(it => {
                        const active = selectedId === it.id;
                        return (
                            <Pressable
                                key={it.id}
                                onPress={() => setSelectedId(it.id)}
                                style={{
                                    marginTop: 32,
                                    backgroundColor: '#fff',
                                    borderRadius: 25,
                                    paddingHorizontal: 14,
                                    paddingTop: 12,
                                    paddingBottom: 10,
                                    borderWidth: 1,
                                    borderColor: active ? '#2CB67D' : '#EEE',
                                    shadowColor: '#000',
                                    shadowOpacity: 0.05,
                                    shadowRadius: 6,
                                    shadowOffset: { width: 0, height: 2 },
                                    elevation: 2,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space-between' }}>
                                    {active ? (
                                        <View
                                            style={{
                                                width: 22, height: 22, borderRadius: 6, backgroundColor: '#2CB67D',
                                                alignItems: 'center', justifyContent: 'center', marginRight: 10,
                                            }}
                                        >
                                            <Ionicons name="checkmark" size={14} color="#fff" />
                                        </View>
                                    ) : (
                                        <View
                                            style={{
                                                width: 22, height: 22, borderRadius: 6,
                                                borderWidth: 1.5, borderColor: '#CFCFCF', marginRight: 10,
                                            }}
                                        />
                                    )}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#232323' }}>
                                            {it.name}
                                        </Text>
                                        {!!it.type && (
                                            <Text style={{ marginTop: 2, color: '#6B7280', fontSize: 12 }}>
                                                {it.type}
                                            </Text>
                                        )}
                                    </View>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111' }}>
                                        {`SAR ${it.pricing ?? 0}`}
                                    </Text>
                                </View>

                                <View style={{ height: 1, backgroundColor: '#EFEFEF' }} />

                                <View style={{ paddingVertical: 12 }}>
                                    {!!it.detail && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name="checkmark-done" size={16} color={active ? '#16A34A' : '#9CA3AF'} />
                                            <Text style={{ marginLeft: 8, color: '#111', fontSize: 14 }}>{it.detail}</Text>
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        disabled={!active}
                                        onPress={() => active && navigation.navigate('YourBooking', { packageId: it.id })}
                                        style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', width: '100%', opacity: active ? 1 : 0.5 }}
                                    >
                                        <Text style={{ color: active ? '#2D4795' : '#9CA3AF', fontWeight: '500', textDecorationLine: 'underline', fontSize: 16 }}>
                                            Steam it
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChoosePackages;
