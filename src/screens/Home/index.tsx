import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
  ActivityIndicator,
  DeviceEventEmitter,
  RefreshControl,
  Alert,
  PermissionsAndroid,
  Platform,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import { TNavProps } from '../../services/types/drawerscreens.types';
import SearchInput from '../../components/SearchInput';
import BlackCar from '../../assets/images/black-car.png';
import { HOME_AD_SEEN, SELECTED_CITY } from '../../constants';
import { useBanner } from '../../hooks/useBanner';
import { usePackage } from '../../hooks/usePackage';
import { BACKEND_URL } from '../../api';
import { getCarProfile } from '../../hooks/useCarStorage';
import { getUserData, setAuth } from '../../hooks/useAuthStorage';
import { useUser } from '../../hooks/useUser';
import { usePromoCode } from '../../hooks/usePromoCode';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { useAddons } from '../../hooks/useAddons';

export const Home: React.FC<TNavProps> = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const [userId, setUserId] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<any | null>(null);

  const { fetchUserById, handleUpdateUser } = useUser();
  const { loading: addonsLoading, addons, fetchAddons } = useAddons();
  const { loading: promoLoading, promos } = usePromoCode();

  const { banner, loading: bannerLoading, error: bannerError } = useBanner();

  const { loading: packagesLoading, fetchPackages } = usePackage();
  const [packages, setPackages] = React.useState<any[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [car, setCar] = React.useState(null);

  const [search, setSearch] = React.useState('');
  const [filteredPackages, setFilteredPackages] = React.useState<any[]>([]);
  const [selectedFilterNames, setSelectedFilterNames] = React.useState<string[]>([]);
  const [selectedSort, setSelectedSort] = React.useState<string>('popularity');

  const KEY_HOME_AD = HOME_AD_SEEN;
  const [showAd, setShowAd] = React.useState(false);

  const [showLocationModal, setShowLocationModal] = React.useState(false);
  const [locationUpdating, setLocationUpdating] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const u = await getUserData();
      setUserId(u?.id || null);
    })();
  }, [i18n.language]);

  React.useEffect(() => {
    fetchAddons();
  }, [fetchAddons]);

  React.useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const data = await fetchUserById(userId);
        setUser(data);

        const needsLocation =
          (!data.city || data.city.trim() === '') &&
          (!data.location ||
            data.location.latitude === 0 ||
            data.location.longitude === 0);

        if (needsLocation) {
          setShowLocationModal(true);
        } else {
          await setAuth({ user: data });
        }
      } catch (e) {
        console.log('Failed to fetch user by id', e);
      }
    })();
  }, [userId, fetchUserById]);

  React.useEffect(() => {
    (async () => {
      const storedCar = await getCarProfile();
      setCar(storedCar);
    })();
  }, [i18n.language]);

  React.useEffect(() => {
    (async () => {
      const storedCar = await getCarProfile();
      setCar(storedCar);
    })();

    const sub = DeviceEventEmitter.addListener('CAR_CHANGED', (newCar: any) => {
      setCar(newCar);
    });

    return () => {
      sub.remove();
    };
  }, []);

  // show whenever Home screen gets focus
  useFocusEffect(
    React.useCallback(() => {
      if (!showLocationModal) setShowAd(true);
      return () => { };
    }, [showLocationModal])
  );

  const isFocused = useIsFocused();
  const appStateRef = React.useRef(AppState.currentState);

  // show whenever app returns to foreground AND Home is focused
  React.useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      const wasBg = /inactive|background/.test(appStateRef.current);
      if (wasBg && nextState === 'active' && isFocused) {
        setShowAd(true);
      }
      appStateRef.current = nextState;
    });

    return () => sub.remove();
  }, [isFocused]);

  const loadPackages = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchPackages();

      const list = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
          ? data
          : [];
      setPackages(list);
      applyFilters(list);
    } catch (e: any) {
      setPackages([]);
    } finally {
      setRefreshing(false);
    }
  }, [fetchPackages]);

  const applyFilters = React.useCallback(
    (all: any) => {
      let list = [...all];

      if (search.trim()) {
        const s = search.toLowerCase();
        list = list.filter((p) => p.name?.toLowerCase().includes(s));
      }

      if (selectedFilterNames.length) {
        list = list.filter((p) => selectedFilterNames.includes(p.name));
      }

      if (selectedSort === 'price_asc') {
        list.sort((a, b) => (a.fixedPrice || 0) - (b.fixedPrice || 0));
      } else if (selectedSort === 'price_desc') {
        list.sort((a, b) => (b.fixedPrice || 0) - (a.fixedPrice || 0));
      }

      setFilteredPackages(list);
    },
    [search, selectedFilterNames, selectedSort]
  );

  React.useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  React.useEffect(() => {
    applyFilters(packages);
  }, [search, packages, selectedFilterNames, selectedSort, applyFilters]);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('HOME_FILTERS', ({ sortBy, names }) => {
      setSelectedSort(sortBy);
      setSelectedFilterNames(names || []);
    });

    return () => sub.remove();
  }, []);

  const getPackagePriceLabel = (pkg: any, carData: any) => {
    if (!carData) return 'Vehicle based pricing';

    const carTypeId = typeof carData.type === 'string' ? carData.type : carData.type?.id;

    if (!carTypeId) return 'Vehicle based pricing';

    if (pkg.pricingType === 'fixed') {
      return `SAR ${pkg.fixedPrice}`;
    }

    const match = pkg.vehicleBasedPricing?.find(
      (v: any) => v.vehicleTypeId === carTypeId
    );

    if (match) {
      return `SAR ${match.price}`;
    }

    return 'Vehicle based pricing';
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need your location to show services near you.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentPosition = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (pos: { coords: { latitude: number; longitude: number } }) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err: { code: number; message: string }) => {
          console.log('Geolocation error', err);
          reject(err);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  };

  const handleUseCurrentLocation = async () => {
    if (!userId || !user) return;

    try {
      setLocationUpdating(true);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission required', 'Please enable location to continue.');
        return;
      }

      const { latitude, longitude } = await getCurrentPosition();

      const payload = {
        location: { latitude, longitude }, // 👈 only location now, no city
      };

      console.log('Location payload', payload);

      const updated = await handleUpdateUser(userId, payload);
      setUser(updated);

      await setAuth({ user: updated });

      // if backend sets city itself, store it
      if (updated?.city) {
        await AsyncStorage.setItem(SELECTED_CITY, updated.city);
      }

      setShowLocationModal(false);
    } catch (e: any) {
      console.log('Failed to update location', e);

      if (e?.response) {
        console.log('Update user error response', e.response.data);
        Alert.alert(
          'Error',
          e.response.data?.message ||
          'Unable to update your location. Please try again.'
        );
      } else if (e?.code === 2) {
        Alert.alert(
          'Turn on Location',
          'Please turn on Location / GPS in your device settings and try again.'
        );
      } else if (e?.code === 3) {
        Alert.alert('Timeout', 'Unable to get your location. Please try again.');
      } else {
        Alert.alert('Error', 'Unable to update your location. Please try again.');
      }
    } finally {
      setLocationUpdating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 mt-3"
        refreshControl={
          <RefreshControl
            refreshing={refreshing || packagesLoading}
            onRefresh={loadPackages}
            tintColor="#223671"
          />
        }
      >
        <View className="px-5">
          <SearchInput
            placeholder={t('home.searchPlaceholder')}
            value={search}
            onChangeText={(txt) => setSearch(txt)}
          />
        </View>

        {(promoLoading || promos?.length || bannerLoading || (banner?.isActive && banner?.mediaPath)) ? (
          <View className="px-5 mt-6">
            <DealCard
              promos={promos}
              promoLoading={promoLoading}
              banner={banner}
              bannerLoading={bannerLoading}
            />
          </View>
        ) : null}

        {/* Add-ons strip */}
        <View className="px-5 mt-6">
          <View
            style={{
              flexDirection: isAr ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <Text className="text-black text-lg font-semibold">{t('home.addons.title')}</Text>
            <Text
              style={{
                fontSize: 11,
                color: '#6B7280',
              }}
            >
              {t('home.addons.subtitle')}
            </Text>
          </View>

          {addonsLoading ? (
            <ActivityIndicator />
          ) : addons.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 8, paddingTop: 4 }}
            >
              {addons.map((addon) => (
                <View
                  key={addon.id}
                  style={{
                    width: 220,
                    marginRight: 14,
                    borderRadius: 20,
                    backgroundColor: '#F9FAFB',
                    padding: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(34,54,113,0.08)',
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 3,
                    marginBottom: 4
                  }}
                >
                  {/* Top: big image + price pill overlay */}
                  <View
                    style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 16,
                      overflow: 'hidden',
                      backgroundColor: '#E5E7EB',
                      marginBottom: 10,
                      position: 'relative',
                    }}
                  >
                    {addon.mediaPath ? (
                      <Image
                        source={{ uri: `${BACKEND_URL}${addon.mediaPath}` }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons name="sparkles-outline" size={28} color="#223671" />
                      </View>
                    )}

                    {/* Price pill overlay */}
                    <View
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                        backgroundColor: 'rgba(255,255,255,0.92)',
                        borderWidth: 1,
                        borderColor: 'rgba(34,54,113,0.12)',
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '800', color: '#223671' }}>
                        SAR {addon.price}
                      </Text>
                    </View>
                  </View>

                  {/* Name */}
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#111827',
                    }}
                    numberOfLines={1}
                  >
                    {addon.name}
                  </Text>

                  {/* Description */}
                  {addon.description ? (
                    <Text
                      style={{
                        fontSize: 11,
                        color: '#6B7280',
                        marginTop: 4,
                        lineHeight: 16,
                      }}
                    >
                      {addon.description}
                    </Text>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          ) : null}
        </View>

        {/* Packages */}
        <View className="px-5 mt-6 mb-6">
          <Text className="text-black text-lg font-semibold mb-3">
            {t('home.packagesTitle')}
          </Text>

          {packagesLoading ? (
            <ActivityIndicator />
          ) : !packages.length ? (
            <Text className="text-gray-500 text-sm">
              {t('home.noPackages')}
            </Text>
          ) : (
            <View>
              {filteredPackages.map((pkg: any) => (
                <View
                  key={pkg.id}
                  style={{
                    marginBottom: 16,
                    padding: 18,
                    borderRadius: 20,
                    backgroundColor: '#ffffff',
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 3,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      className="text-black font-semibold"
                      style={{ fontSize: 17, flex: 1, marginRight: 10 }}
                      numberOfLines={2}
                    >
                      {pkg.name}
                    </Text>

                    <View
                      style={{
                        backgroundColor: '#22367115',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: '#223671',
                          fontWeight: '700',
                          fontSize: 14,
                        }}
                      >
                        {getPackagePriceLabel(pkg, car)}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      color: '#6B7280',
                      fontSize: 12,
                      marginTop: 6,
                      lineHeight: 16,
                    }}
                    numberOfLines={3}
                  >
                    {pkg.description}
                  </Text>

                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#E5E7EB',
                      marginVertical: 12,
                      opacity: 0.6,
                    }}
                  />

                  <Text
                    style={{
                      color: '#111827',
                      fontWeight: '600',
                      marginBottom: 6,
                    }}
                  >
                    {t('home.includes')}
                  </Text>

                  <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                    {pkg.servicesIncluded?.slice(0, 6).map((s: any) => (
                      <View
                        key={s.id}
                        style={{
                          backgroundColor: '#22367110',
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 999,
                          marginRight: isAr ? 0 : 6,
                          marginLeft: isAr ? 6 : 0,
                          marginBottom: 6,
                        }}
                      >
                        <Text style={{ fontSize: 11, color: '#223671' }}>
                          {s.name}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      marginTop: 12,
                      backgroundColor: '#223671',
                      paddingVertical: 10,
                      borderRadius: 14,
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      navigation.navigate('PackageDetails', {
                        packageId: pkg.id,
                      })
                    }
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: '600',
                        fontSize: 14,
                      }}
                    >
                      {t('home.viewDetails')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB: Filters */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Filters')}
        activeOpacity={0.85}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 24,
          width: 45,
          height: 45,
          borderRadius: 28,
          backgroundColor: '#2C4694',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 6,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Ionicons name="options-outline" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Ad Modal – only show after / if location modal is done */}
      <Modal
        visible={showAd && !showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAd(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}
        >
          <View
            style={{
              width: '88%',
              maxWidth: 420,
              backgroundColor: '#00163B',
              borderRadius: 16,
              padding: 14,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowAd(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <Ionicons name="close" size={18} color="#00163B" />
            </TouchableOpacity>

            <View style={{ paddingVertical: 14, alignItems: 'center' }}>
              {bannerLoading ? (
                <ActivityIndicator color="#fff" />
              ) : banner?.isActive && banner.mediaPath ? (
                <Image
                  source={{ uri: `${BACKEND_URL}${banner.mediaPath}` }}
                  style={{
                    width: 260,
                    height: 200,
                    borderRadius: 12,
                    resizeMode: 'contain',
                  }}
                />
              ) : (
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                  {bannerError ? 'Failed to load banner.' : 'No active banner.'}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={() => { }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        >
          <View
            style={{
              width: '88%',
              maxWidth: 420,
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 8,
                color: '#111827',
                textAlign: 'center',
              }}
            >
              Use your current location
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#4B5563',
                textAlign: 'center',
                marginBottom: 18,
              }}
            >
              We use your city & location to show the best wash packages
              available near you.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleUseCurrentLocation}
              disabled={locationUpdating}
              style={{
                backgroundColor: '#223671',
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              {locationUpdating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: 15,
                  }}
                >
                  Allow & use my current location
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const DealCard = ({
  promos,
  promoLoading,
  banner,
  bannerLoading,
}: {
  promos: any[];
  promoLoading: boolean;
  banner: any | null;
  bannerLoading: boolean;
}) => {
  const slides = React.useMemo(() => {
    // ✅ promo codes -> carousel
    if (Array.isArray(promos) && promos.length) {
      return promos.map((p: any) => {
        const off =
          p.discountType === 'percentage'
            ? `${p.discountValue}% OFF`
            : `SAR ${p.discountValue} OFF`;

        return {
          id: p.id || p.code,
          type: 'promo',
          code: p.code,
          title: p.description,
          badge: off,
          expiryDate: p.expiryDate,
        };
      });
    }

    // ✅ no promo -> single banner ONLY
    if (banner?.isActive && banner?.mediaPath) {
      return [
        {
          id: 'banner',
          type: 'banner',
          mediaUri: `${BACKEND_URL}${banner.mediaPath}`,
        },
      ];
    }

    // ✅ if nothing at all -> render nothing
    return [];
  }, [promos, banner]);

  const scrollRef = React.useRef<ScrollView>(null);
  const [index, setIndex] = React.useState(0);
  const cardW = Dimensions.get('window').width - 40;

  React.useEffect(() => {
    setIndex(0);
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [slides.length]);

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      const next = (index + 1) % slides.length;
      scrollRef.current?.scrollTo({ x: next * cardW, animated: true });
      setIndex(next);
    }, 3000);
    return () => clearInterval(id);
  }, [index, slides.length, cardW]);

  const onMomentumEnd = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / cardW);
    setIndex(i);
  };

  const formatExpiry = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return `Valid till ${d.toLocaleDateString()}`;
  };

  const isLoading = promoLoading || (!promos?.length && bannerLoading);

  if (isLoading) {
    return (
      <View
        style={{ width: cardW, height: 189 }}
        className="bg-[#F5F7FA] rounded-3xl items-center justify-center"
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!slides.length) return null;

  return (
    <View
      style={{ width: cardW, height: 189, overflow: 'hidden' }}
      className="bg-[#e8f1ff] rounded-3xl"
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
      >
        {slides.map((s: any) => (
          <View
            key={s.id}
            style={{ width: cardW, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' }}
          >
            {s.type === 'banner' ? (
              <Image
                source={{ uri: s.mediaUri }}
                style={{ width: '100%', height: 189, borderRadius: 24, resizeMode: 'cover' }}
              />
            ) : (
              <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                {!!s.code && (
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 999,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderWidth: 1,
                      borderColor: '#E5E7EB',
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ color: '#111', fontWeight: '800', fontSize: 13 }}>
                      {s.code}
                    </Text>
                  </View>
                )}

                <Text
                  style={{
                    color: '#111827',
                    fontSize: 16,
                    fontWeight: '700',
                    textAlign: 'center',
                    lineHeight: 22,
                    paddingHorizontal: 10,
                  }}
                  numberOfLines={3}
                >
                  {s.title}
                </Text>

                {!!s.badge && (
                  <View className="rounded-full px-4 py-2 mt-3 bg-[#223671]">
                    <Text className="text-white text-sm font-semibold">{s.badge}</Text>
                  </View>
                )}

                {!!s.expiryDate && (
                  <Text style={{ marginTop: 10, fontSize: 11, color: '#6B7280', textAlign: 'center' }}>
                    {formatExpiry(s.expiryDate)}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {slides.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
          {slides.map((_: any, i: number) => (
            <View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor: i === index ? '#223671' : '#D1D5DB',
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};
