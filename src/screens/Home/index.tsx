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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// import HomePageAd from '../../assets/svgs/HomePageAd.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TNavProps } from '../../services/types/drawerscreens.types';
import SearchInput from '../../components/SearchInput';
import BlackCar from '../../assets/images/black-car.png';
import { HOME_AD_SEEN } from '../../constants';
import { useBanner } from '../../hooks/useBanner';
import { usePackage } from '../../hooks/usePackage';
import { BACKEND_URL } from '../../api';
import { getCarProfile } from '../../hooks/useCarStorage';
import { getUserData } from '../../hooks/useAuthStorage';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

export const Home: React.FC<TNavProps> = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const [userId, setUserId] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    (async () => {
      const u = await getUserData();
      setUserId(u?.id || null);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const storedCar = await getCarProfile();
      setCar(storedCar);
    })();
  }, []);

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

  React.useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem(KEY_HOME_AD);
      if (!seen) {
        setShowAd(true);
        await AsyncStorage.setItem(KEY_HOME_AD, '1');
      }
    })();
  }, []);

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

      // SEARCH
      if (search.trim()) {
        const s = search.toLowerCase();
        list = list.filter((p) =>
          p.name?.toLowerCase().includes(s)
        );
      }

      // FILTER BY NAMES
      if (selectedFilterNames.length) {
        list = list.filter((p) => selectedFilterNames.includes(p.name));
      }

      // SORT
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
  }, [search, packages, selectedFilterNames, selectedSort]);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('HOME_FILTERS', ({ sortBy, names }) => {
      setSelectedSort(sortBy);
      setSelectedFilterNames(names || []);
    });

    return () => sub.remove();
  }, []);

  const getPackagePriceLabel = (pkg: any, car: any) => {
    if (!car) return 'Vehicle based pricing';

    // ✅ handle both: car.type = "id"  OR car.type = { id: "id", ... }
    const carTypeId =
      typeof car.type === 'string' ? car.type : car.type?.id;

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

        <View className="px-5 mt-6">
          <DealCard />
        </View>

        {/* Packages */}
        <View className="px-5 mt-6 mb-6">
          <Text className="text-black text-lg font-semibold mb-3">
            {t('home.packagesTitle', 'Our Packages')}
          </Text>

          {packagesLoading ? (
            <ActivityIndicator />
          ) : !packages.length ? (
            <Text className="text-gray-500 text-sm">
              {t('home.noPackages', 'No packages available right now.')}
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
                    backgroundColor: "#ffffff",
                    shadowColor: "#000",
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 3,
                  }}
                >
                  {/* Top row: Title + Price */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text
                      className="text-black font-semibold"
                      style={{ fontSize: 17, flex: 1, marginRight: 10 }}
                      numberOfLines={2}
                    >
                      {pkg.name}
                    </Text>

                    {/* Price pill */}
                    <View
                      style={{
                        backgroundColor: "#22367115",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                      }}
                    >
                      <Text style={{ color: "#223671", fontWeight: "700", fontSize: 14 }}>
                        {getPackagePriceLabel(pkg, car)}
                      </Text>
                    </View>
                  </View>

                  {/* Description */}
                  <Text
                    style={{
                      color: "#6B7280",
                      fontSize: 12,
                      marginTop: 6,
                      lineHeight: 16,
                    }}
                    numberOfLines={3}
                  >
                    {pkg.description}
                  </Text>

                  {/* Divider */}
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#E5E7EB",
                      marginVertical: 12,
                      opacity: 0.6,
                    }}
                  />

                  {/* Services Included */}
                  <Text style={{ color: "#111827", fontWeight: "600", marginBottom: 6 }}>
                    Includes:
                  </Text>

                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {pkg.servicesIncluded?.slice(0, 6).map((s: any) => (
                      <View
                        key={s.id}
                        style={{
                          backgroundColor: "#22367110",
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 999,
                          marginRight: 6,
                          marginBottom: 6,
                        }}
                      >
                        <Text style={{ fontSize: 11, color: "#223671" }}>{s.name}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Button */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      marginTop: 12,
                      backgroundColor: "#223671",
                      paddingVertical: 10,
                      borderRadius: 14,
                      alignItems: "center",
                    }}
                    onPress={() => navigation.navigate("PackageDetails", { packageId: pkg.id })}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                      View Details
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

      {/* Ad Modal */}
      <Modal
        visible={showAd}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAd(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <View style={{ width: '88%', maxWidth: 420, backgroundColor: '#00163B', borderRadius: 16, padding: 14 }}>
            <TouchableOpacity
              onPress={() => setShowAd(false)}
              style={{
                position: 'absolute', top: 10, right: 10,
                width: 28, height: 28, borderRadius: 8,
                backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
                zIndex: 10
              }}>
              <Ionicons name="close" size={18} color="#00163B" />
            </TouchableOpacity>

            <View style={{ paddingVertical: 14, alignItems: 'center' }}>
              {bannerLoading ? (
                <ActivityIndicator color="#fff" />
              ) : banner?.isActive && banner.mediaPath ? (
                <Image
                  source={{ uri: `${BACKEND_URL}${banner.mediaPath}` }}
                  style={{ width: 260, height: 200, borderRadius: 12, resizeMode: 'contain' }}
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
    </SafeAreaView>
  );
};

const DealCard = () => {
  const slides = React.useMemo(
    () => [
      { id: '1', img: BlackCar, title: 'Enjoy our Aug\nDeals', badge: '30% off' },
      { id: '2', img: BlackCar, title: 'Premium wash\nanytime', badge: 'Save 20%' },
      { id: '3', img: BlackCar, title: 'Detailing & Wax\nSpecial', badge: 'From $19' },
    ],
    []
  );

  const scrollRef = React.useRef<ScrollView>(null);
  const [index, setIndex] = React.useState(0);
  const cardW = Dimensions.get('window').width - 40;

  React.useEffect(() => {
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

  return (
    <View
      style={{ width: cardW, height: 189, overflow: 'hidden' }}
      className="bg-[#F5F7FA] rounded-3xl"
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
      >
        {slides.map((s) => (
          <View key={s.id} style={{ width: cardW }} className="flex-row px-4 justify-center items-center">
            <View className="flex-1 justify-center">
              <Image source={s.img} style={{ width: '100%', height: 150, resizeMode: 'contain' }} />
            </View>

            <View className="flex-1 items-center justify-center pr-2">
              <Text className="text-black text-lg font-semibold text-center leading-6">{s.title}</Text>
              <View className="rounded-full px-4 py-2 mt-2 bg-[#223671]">
                <Text className="text-white text-sm">{s.badge}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* dots */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
        {slides.map((_, i) => (
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
    </View>
  );
};
