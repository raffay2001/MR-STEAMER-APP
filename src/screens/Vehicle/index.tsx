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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SAUDI_CITIES, SAUDI_CITIES_AR, SELECTED_CITY } from '../../constants';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const SWATCHES = [
  '#000000', '#FFFFFF', '#FF0000', '#0000FF', '#008000',
  '#FFFF00', '#FFA500', '#800080', '#808080', '#A52A2A',
];

const isAr = i18n.language?.startsWith('ar');
const CITY_KEY = SELECTED_CITY;
// const CITY_OPTIONS = SAUDI_CITIES;
const CITY_OPTIONS = isAr ? SAUDI_CITIES_AR : SAUDI_CITIES;

const Vehicle: React.FC<TVehicleProps> = ({ navigation }) => {
  const { loading, fetchEnumsByType } = useEnums();
  const { loading: creating, createCar } = useCar();

  const { t } = useTranslation();

  const [items, setItems] = React.useState<any[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  // modal state
  const [showModal, setShowModal] = React.useState(false);
  const [pickedType, setPickedType] = React.useState<any>(null);

  // City Modal
  const [showCityModal, setShowCityModal] = React.useState(false);
  const [cityQuery, setCityQuery] = React.useState('');
  const [selectedCity, setSelectedCity] = React.useState<string | null>(null);

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

  const toArabicDesc = React.useCallback((d: string) => {
    const s = d?.toLowerCase().replace(/\s+/g, ' ').trim();
    if (s.includes('sedan') && s.includes('mini')) {
      return 'سيدان، كوبيه، رياضية، صغيرة أو ما شابه';
    }
    if (s.includes('suv 5') || s.includes('short pickups')) {
      return 'سيارة SUV بخمسة مقاعد، بيك أب قصير أو ما شابه';
    }
    if (s.includes('suv 7') || s.includes('long pickups')) {
      return 'سيارة SUV بسبعة مقاعد، بيك أب طويل أو ما شابه';
    }
    return d;
  }, []);

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
    (async () => {
      const saved = await AsyncStorage.getItem(CITY_KEY);
      if (!saved || !CITY_OPTIONS.includes(saved)) {
        setShowCityModal(true);
        setSelectedCity(null);
      } else {
        setSelectedCity(saved);
        setShowCityModal(false);
      }
    })();
  }, []);

  const onPickCity = React.useCallback(async (city: string) => {
    setSelectedCity(city);
    await AsyncStorage.setItem(CITY_KEY, city);
    setShowCityModal(false);
  }, []);

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
      city: selectedCity as string,
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
  }, [pickedType, color, selectedBrandId, carNumber, carName, selectedCity, createCar, navigation]);

  const canSubmit = !!(pickedType && selectedBrandId && carNumber.trim() && color && carName.trim() && selectedCity);

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
      <Text style={{ color: '#333', fontSize: 16, textAlign: isAr ? 'right' : 'left' }}>{title}</Text>
      <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
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
          <Text className="text-black text-sm" style={{ textAlign: isAr ? 'right' : 'left' }}>
            {t('vehicle.selectType')}
          </Text>
        </View>

        {loading && !refreshing ? (
          <View className="items-center justify-center my-10">
            <ActivityIndicator />
          </View>
        ) : items.length === 0 ? (
          <View className="items-center justify-center my-10">
            <Text className="text-black" style={{ textAlign: isAr ? 'right' : 'left' }}>
              {t('vehicle.noTypes')}
            </Text>
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
                  <Text
                    className="text-black/60 mt-1 text-[20px] w-full"
                    style={{ textAlign: isAr ? 'right' : 'left' }}
                  >
                    {isAr ? toArabicDesc(it.description) : it.description}
                  </Text>
                ) : null}
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {/* Full-screen City Picker Modal */}
      <Modal
        visible={showCityModal}
        transparent={false}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => { /* block back: must choose a city */ }}
      >
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 24, paddingHorizontal: 16 }}>
          {/* Search bar */}
          <View
            style={{
              backgroundColor: '#F1F5F9',
              height: 48,
              borderRadius: 24,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 8,
              marginBottom: 12,
            }}
          >
            <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: isAr ? 0 : 6, marginLeft: isAr ? 6 : 0 }} />
            <TextInput
              placeholder={t('vehicle.searchArea')}
              placeholderTextColor="#9CA3AF"
              value={cityQuery}
              onChangeText={setCityQuery}
              style={{ flex: 1, color: '#111', textAlign: isAr ? 'right' : 'left' }}
            />
          </View>

          {/* City list */}
          <ScrollView keyboardShouldPersistTaps="handled">
            {CITY_OPTIONS
              .filter(c => c.toLowerCase().includes(cityQuery.trim().toLowerCase()))
              .map((c, idx) => (
                <TouchableOpacity
                  key={`${c}-${idx}`}
                  onPress={() => onPickCity(c)}
                  style={{ paddingVertical: 14 }}
                >
                  <Text style={{ color: '#111', fontSize: 16, textAlign: isAr ? 'right' : 'left' }}>{c}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </Modal>

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
              {t('vehicle.modal.title')}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Car Color */}
              <Row
                title={t('vehicle.fields.color')}
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
                title={t('vehicle.fields.brand')}
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
              {openBrand && (brandLoading ? (
                <ActivityIndicator style={{ marginVertical: 8 }} />
              ) : brandList.length === 0 ? (
                <Text style={{ color: '#666', marginBottom: 12, textAlign: isAr ? 'right' : 'left' }}>
                  {t('vehicle.noBrands')}
                </Text>
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
                title={t('vehicle.fields.name')}
                right={<Text style={{ color: '#333' }}>{carName || ''}</Text>}
                onPress={() => { setOpenName(v => !v); setOpenColor(false); setOpenBrand(false); setOpenNumber(false); }}
              />
              {openName && (
                <TextInput
                  placeholder={t('vehicle.placeholders.name')}
                  placeholderTextColor="#888"
                  value={carName}
                  onChangeText={setCarName}
                  style={{
                    height: 48, borderWidth: 1, borderColor: '#eee',
                    backgroundColor: '#F5F7FA', borderRadius: 12,
                    paddingHorizontal: 14, color: '#111', marginBottom: 12,
                    textAlign: isAr ? 'right' : 'left'
                  }}
                />
              )}

              {/* Car number */}
              <Row
                title={t('vehicle.fields.number')}
                right={<Text style={{ color: '#333' }}>{carNumber || ''}</Text>}
                onPress={() => { setOpenNumber(v => !v); setOpenColor(false); setOpenBrand(false); setOpenName(false); }}
              />
              {openNumber && (
                <TextInput
                  placeholder={t('vehicle.placeholders.number')}
                  placeholderTextColor="#888"
                  value={carNumber}
                  onChangeText={setCarNumber}
                  autoCapitalize="characters"
                  style={{
                    height: 48, borderWidth: 1, borderColor: '#eee',
                    backgroundColor: '#F5F7FA', borderRadius: 12,
                    paddingHorizontal: 14, color: '#111', marginBottom: 12,
                    textAlign: isAr ? 'right' : 'left'
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
                    <Text style={{ color: '#fff', fontWeight: '600' }}>{t('vehicle.submit')}</Text>
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
