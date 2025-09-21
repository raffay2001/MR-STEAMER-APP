// src/screens/Vehicle/page.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { TVehicleProps } from './types';
import { useEnums } from '../../hooks/useEnums';
import { useCar } from '../../hooks/useCar';
import { BACKEND_URL } from '../../api';
import { getAccessToken, clearAuth } from '../../hooks/useAuthStorage';
import { setCarProfile } from '../../hooks/useCarStorage';

const SWATCHES = [
  '#000000', '#FFFFFF', '#FF0000', '#0000FF', '#008000',
  '#FFFF00', '#FFA500', '#800080', '#808080', '#A52A2A',
];

const Vehicle: React.FC<TVehicleProps> = ({ navigation }) => {
  const { loading, fetchEnumsByType } = useEnums();
  const { loading: creating, createCar } = useCar();

  const [items, setItems] = React.useState<any[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  // modal state
  const [showModal, setShowModal] = React.useState(false);
  const [pickedType, setPickedType] = React.useState<any>(null);

  // form state
  const [color, setColor] = React.useState<string>(''); // chosen swatch or custom hex/name
  const [brandList, setBrandList] = React.useState<any[]>([]);
  const [brandLoading, setBrandLoading] = React.useState(false);
  const [selectedBrandId, setSelectedBrandId] = React.useState<string>('');
  const [carNumber, setCarNumber] = React.useState<string>('');
  const [carName, setCarName] = React.useState<string>(''); // NEW

  // collapsibles
  const [openColor, setOpenColor] = React.useState(false);
  const [openBrand, setOpenBrand] = React.useState(false);
  const [openName, setOpenName] = React.useState(false);   // NEW
  const [openNumber, setOpenNumber] = React.useState(false);

  // guards / caches
  const loadedRef = React.useRef(false);
  const brandsCacheRef = React.useRef<any[]>([]);

  const cardBg = React.useCallback((raw?: string) => {
    const name = (raw || '').trim().toLowerCase();
    if (name === 'sedan') return '#e1dfa4';
    if (name === 'suv 5 seater') return '#e3ecf1';
    if (name === 'suv 7 seater') return '#f4e3e5';
    return '#F5F7FA';
  }, []);

  const loadOnce = React.useCallback(async () => {
    const token = await getAccessToken();
    const url = `${BACKEND_URL}/v1/enum?enumType=VEHICLE_TYPE&page=1&limit=50`;
    console.log('🔵 [Vehicle] first-load token:', token ? token.slice(0, 12) + '…' : 'none');
    console.log('🔵 [Vehicle] first-load GET:', url);

    try {
      const res = await fetchEnumsByType('VEHICLE_TYPE', { page: 1, limit: 50 });
      setItems(res?.results ?? []);
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.log('🛑 [Vehicle] first-load ERROR status:', status, 'msg:', err?.message, 'data:', JSON.stringify(data));
      if (status === 401) {
        await clearAuth();
        navigation.reset({ index: 0, routes: [{ name: 'Vehicle' as never }] });
        return;
      }
    }
  }, [fetchEnumsByType, navigation]);

  React.useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    loadOnce();
  }, [loadOnce]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetchEnumsByType('VEHICLE_TYPE', { page: 1, limit: 50 });
      setItems(res?.results ?? []);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        await clearAuth();
        navigation.reset({ index: 0, routes: [{ name: 'Vehicle' as never }] });
        return;
      }
    } finally {
      setRefreshing(false);
    }
  }, [fetchEnumsByType, navigation]);

  // open modal -> reset fields & (cached) load brands
  const openModalFor = React.useCallback(async (typeItem: any) => {
    setPickedType(typeItem);
    setShowModal(true);
    setColor('');
    setSelectedBrandId('');
    setCarNumber('');
    setCarName('');
    setOpenColor(false);
    setOpenBrand(false);
    setOpenName(false);
    setOpenNumber(false);

    if (brandsCacheRef.current.length) {
      setBrandList(brandsCacheRef.current);
      return;
    }
    try {
      setBrandLoading(true);
      const b = await fetchEnumsByType('VEHICLE_BRAND', { page: 1, limit: 100 });
      brandsCacheRef.current = b?.results ?? [];
      setBrandList(brandsCacheRef.current);
    } catch (e) {
      console.log('🛑 [Vehicle] load brands failed:', e);
      setBrandList([]);
    } finally {
      setBrandLoading(false);
    }
  }, [fetchEnumsByType]);

  const onSubmit = React.useCallback(async () => {
    if (!pickedType?.id) return;
    const payload = {
      type: pickedType.id,
      color,
      brand: selectedBrandId,
      number: carNumber.trim(),
      name: carName.trim(),
    };
    console.log('🚗 [Vehicle] createCar payload:', payload);

    try {
      const created = await createCar(payload);
      console.log('✅ [Vehicle] car created:', created?.id || created);
      await setCarProfile(created);
      setShowModal(false);
      navigation.navigate('Drawer', { screen: 'Home' });
    } catch (err: any) {
      const status = err?.response?.status;
      console.log('🛑 [Vehicle] createCar ERROR status:', status, 'msg:', err?.message);
      if (status === 401) {
        await clearAuth();
        navigation.reset({ index: 0, routes: [{ name: 'Vehicle' as never }] });
        return;
      }
    }
  }, [pickedType, color, selectedBrandId, carNumber, carName, createCar, navigation]);

  const canSubmit = !!(pickedType && selectedBrandId && carNumber.trim() && color && carName.trim());

  const Row = ({
    title,
    right,
    onPress,
  }: {
    title: string;
    right?: React.ReactNode;
    onPress?: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#F5F7FA',
        borderRadius: 999,
        height: 50,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}
    >
      <Text style={{ color: '#333', fontSize: 16 }}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {right}
        <Text style={{ color: '#999', fontSize: 18 }}>▾</Text>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-white"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="px-6 py-4 mb-7 bg-[#F5F7FA]">
          <Text className="text-black text-sm">Select Vehicle Type</Text>
        </View>

        {loading && !refreshing ? (
          <View className="items-center justify-center my-10">
            <ActivityIndicator />
          </View>
        ) : items.length === 0 ? (
          <View className="items-center justify-center my-10">
            <Text className="text-black">No vehicle types found.</Text>
          </View>
        ) : (
          items.map((it) => {
            const imgUri = it?.mediaPath ? `${BACKEND_URL}${it.mediaPath}` : undefined;
            const bg = cardBg(it.displayName || it.name);
            return (
              <Pressable
                key={it.id}
                onPress={() => openModalFor(it)}
                style={{ backgroundColor: bg }}
                className="mb-7 rounded-xl px-9 py-4 items-center mx-6"
              >
                {imgUri ? (
                  <Image
                    source={{ uri: imgUri }}
                    style={{ width: 220, height: 100, marginBottom: 2, resizeMode: 'contain' }}
                  />
                ) : null}
                {it.description ? (
                  <Text className="text-black/60 mt-1 text-[20px] text-left w-full">{it.description}</Text>
                ) : null}
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {/* Centered Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.45)' }}>
          {/* backdrop tap to close */}
          <Pressable
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
            onPress={() => setShowModal(false)}
          />

          {/* card */}
          <View
            style={{
              width: '92%',
              maxWidth: 460,
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 16,
              maxHeight: '80%',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#111', textAlign: 'center', marginBottom: 16 }}>
              Car Information
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Car Color */}
              <Row
                title="Car Color"
                right={
                  <View
                    style={{
                      width: 18, height: 18, borderRadius: 9,
                      backgroundColor: color || '#ddd', borderWidth: 1, borderColor: '#ccc'
                    }}
                  />
                }
                onPress={() => { setOpenColor(v => !v); setOpenBrand(false); setOpenName(false); setOpenNumber(false); }}
              />
              {openColor && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  {SWATCHES.map(c => {
                    const active = color?.toLowerCase() === c.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={c}
                        onPress={() => setColor(c)}
                        style={{
                          width: 34, height: 34, borderRadius: 17, backgroundColor: c,
                          borderWidth: active ? 3 : 1, borderColor: active ? '#111' : '#ddd'
                        }}
                      />
                    );
                  })}
                </View>
              )}

              {/* Brand */}
              <Row
                title="Brand"
                right={
                  <Text style={{ color: '#333' }}>
                    {selectedBrandId
                      ? (brandList.find(b => b.id === selectedBrandId)?.displayName ||
                        brandList.find(b => b.id === selectedBrandId)?.name || '')
                      : ''}
                  </Text>
                }
                onPress={() => { setOpenBrand(v => !v); setOpenColor(false); setOpenName(false); setOpenNumber(false); }}
              />
              {openBrand && (
                brandLoading ? (
                  <ActivityIndicator style={{ marginVertical: 8 }} />
                ) : brandList.length === 0 ? (
                  <Text style={{ color: '#666', marginBottom: 12 }}>No brands found.</Text>
                ) : (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                    {brandList.map(b => {
                      const active = selectedBrandId === b.id;
                      return (
                        <Pressable
                          key={b.id}
                          onPress={() => setSelectedBrandId(b.id)}
                          style={{
                            paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999,
                            borderWidth: 1, borderColor: active ? '#111' : '#ddd',
                            backgroundColor: active ? '#111' : '#fff',
                            marginRight: 8, marginBottom: 8,
                          }}
                        >
                          <Text style={{ color: active ? '#fff' : '#111' }}>
                            {b.displayName || b.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )
              )}

              {/* Car name (model) */}
              <Row
                title="Car name"
                right={<Text style={{ color: '#333' }}>{carName || ''}</Text>}
                onPress={() => { setOpenName(v => !v); setOpenColor(false); setOpenBrand(false); setOpenNumber(false); }}
              />
              {openName && (
                <TextInput
                  placeholder="e.g., Corolla Grande"
                  placeholderTextColor="#888"
                  value={carName}
                  onChangeText={setCarName}
                  style={{
                    height: 48, borderWidth: 1, borderColor: '#eee',
                    backgroundColor: '#F5F7FA', borderRadius: 12,
                    paddingHorizontal: 14, color: '#111', marginBottom: 12,
                  }}
                />
              )}

              {/* Car number */}
              <Row
                title="Car number"
                right={<Text style={{ color: '#333' }}>{carNumber || ''}</Text>}
                onPress={() => { setOpenNumber(v => !v); setOpenColor(false); setOpenBrand(false); setOpenName(false); }}
              />
              {openNumber && (
                <TextInput
                  placeholder="Enter plate / registration"
                  placeholderTextColor="#888"
                  value={carNumber}
                  onChangeText={setCarNumber}
                  autoCapitalize="characters"
                  style={{
                    height: 48, borderWidth: 1, borderColor: '#eee',
                    backgroundColor: '#F5F7FA', borderRadius: 12,
                    paddingHorizontal: 14, color: '#111', marginBottom: 12,
                  }}
                />
              )}

              {/* Submit */}
              <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 4 }}>
                <Pressable
                  onPress={onSubmit}
                  disabled={!canSubmit || creating}
                  style={{
                    backgroundColor: (!canSubmit || creating) ? '#9e9e9e' : '#2e7d32',
                    paddingVertical: 12, paddingHorizontal: 28, borderRadius: 999,
                    minWidth: 140, alignItems: 'center',
                  }}
                >
                  {creating ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Submit</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Vehicle;
