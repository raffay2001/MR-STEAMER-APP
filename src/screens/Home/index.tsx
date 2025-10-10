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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSlots, type SlotItem } from '../../hooks/useSlots';
import HomePageAd from '../../assets/svgs/HomePageAd.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TNavProps } from '../../services/types/drawerscreens.types';
import SearchInput from '../../components/SearchInput';
import BlackCar from '../../assets/images/black-car.png';
import { HOME_AD_SEEN } from '../../constants';
import Rectangle from '../../assets/images/rectangle.png';
import { useEnums } from '../../hooks/useEnums';
import { BACKEND_URL } from '../../api';
import { useServices } from '../../hooks/useServices';
import { getCarProfile } from '../../hooks/useCarStorage';
import LinearGradient from 'react-native-linear-gradient';
import PackageCardImg from "../../assets/svgs/PackageCardImg.svg"
import { getUserData } from '../../hooks/useAuthStorage';
import { useFavourites } from '../../hooks/useFavourites';
import { useRating } from '../../hooks/useRating';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

export const Home: React.FC<TNavProps> = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const { loading: servicesLoading, fetchServices, fetchPackagesByService } = useServices();
  const [services, setServices] = React.useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | null>(null);
  const [packages, setPackages] = React.useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = React.useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = React.useState<{ id: string; label: string } | null>(null);
  const [vehicleInitDone, setVehicleInitDone] = React.useState(false);

  // favourites modal state
  const { togglePackageFavourite, loading: favLoading } = useFavourites();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [pendingFavId, setPendingFavId] = React.useState<string | null>(null);
  const [favModalVisible, setFavModalVisible] = React.useState(false);
  const [favModalTitle, setFavModalTitle] = React.useState('');
  const [favModalItems, setFavModalItems] = React.useState<any[]>([]);
  const [localFavIds, setLocalFavIds] = React.useState<Set<string>>(new Set());

  // Rating States
  const { loading: ratingLoading, fetchRatingsByPackageName } = useRating();
  const [ratingsMap, setRatingsMap] = React.useState<Record<string, { avg: number; count: number }>>({});

  const [sortBy, setSortBy] = React.useState<'popularity' | 'rating' | 'price_desc' | 'price_asc'>('popularity');
  const [filterNames, setFilterNames] = React.useState<string[]>([]);

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
      const seen = await AsyncStorage.getItem(KEY_HOME_AD);
      if (!seen) {
        setShowAd(true);
        await AsyncStorage.setItem(KEY_HOME_AD, '1');
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const car = await getCarProfile();
        const typeId = car?.type || car?.vehicleType;
        if (typeId) {
          setSelectedVehicleType(prev =>
            prev?.id === String(typeId) ? prev : { id: String(typeId), label: prev?.label || '' }
          );
        }
      } finally {
        setVehicleInitDone(true);
      }
    })();
  }, []);

  const loadPackages = React.useCallback(async (serviceId: string, vehicleTypeId?: string) => {
    setPackagesLoading(true);
    try {
      const res = await fetchPackagesByService(serviceId, {
        page: 1,
        limit: 50,
        ...(vehicleTypeId ? { vehicleType: vehicleTypeId } : {}),
      });
      setPackages(res?.results ?? []);
    } finally {
      setPackagesLoading(false);
    }
  }, [fetchPackagesByService]);

  const loadedRef = React.useRef(false);
  React.useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    (async () => {
      try {
        const res = await fetchServices({ limit: 20, page: 1 });
        const list = res?.results ?? [];
        setServices(list);
        if (list.length > 0) {
          setSelectedServiceId(list[0].id);
        }
      } catch { }
    })();
  }, [fetchServices]);

  React.useEffect(() => {
    if (!selectedServiceId || !vehicleInitDone) return;
    loadPackages(selectedServiceId, selectedVehicleType?.id);
  }, [selectedServiceId, selectedVehicleType?.id, vehicleInitDone, loadPackages]);

  const groupedPackages = React.useMemo(() => {
    const map = new Map<
      string,
      { name: string; types: string[]; minPrice: number; sample: any; ids: string[] }
    >();
    packages.forEach((pkg: any) => {
      const key = pkg.name || 'Package';
      const type = pkg.type || '';
      const price = Number(pkg.pricing ?? 0);
      const exist = map.get(key);
      if (exist) {
        if (type && !exist.types.includes(type)) exist.types.push(type);
        if (!Number.isNaN(price)) exist.minPrice = Math.min(exist.minPrice, price);
        if (pkg.id && !exist.ids.includes(pkg.id)) exist.ids.push(pkg.id);
      } else {
        map.set(key, {
          name: key,
          types: type ? [type] : [],
          minPrice: Number.isNaN(price) ? 0 : price,
          sample: pkg,
          ids: pkg.id ? [pkg.id] : [],
        });
      }
    });
    return Array.from(map.values());
  }, [packages]);

  // apply name filters, then sort
  const sortedGroups = React.useMemo(() => {
    let base = [...groupedPackages];
    if (filterNames.length > 0) {
      const set = new Set(filterNames);
      base = base.filter(g => set.has(g.name));
    }
    const copy = [...base];
    if (sortBy === 'rating') {
      // higher avg first; if tie, more reviews first; then by price asc
      copy.sort((a, b) => {
        const ra = ratingsMap[a.name]?.avg ?? 0;
        const rb = ratingsMap[b.name]?.avg ?? 0;
        if (rb !== ra) return rb - ra;
        const ca = ratingsMap[a.name]?.count ?? 0;
        const cb = ratingsMap[b.name]?.count ?? 0;
        if (cb !== ca) return cb - ca;
        return (a.minPrice ?? 0) - (b.minPrice ?? 0);
      });
    } else if (sortBy === 'price_asc') {
      copy.sort((a, b) => (a.minPrice ?? 0) - (b.minPrice ?? 0));
    } else if (sortBy === 'price_desc') {
      copy.sort((a, b) => (b.minPrice ?? 0) - (a.minPrice ?? 0));
    }
    return copy;
  }, [groupedPackages, ratingsMap, sortBy, filterNames]);

  // listen for "Apply" from Filters (sort + names)
  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('HOME_FILTERS', ({ sortBy: s, names }: { sortBy: typeof sortBy, names: string[] }) => {
      if (s) setSortBy(s);
      setFilterNames(Array.isArray(names) ? names : []);
    });
    return () => sub.remove();
  }, []);

  // Rating
  React.useEffect(() => {
    if (groupedPackages.length === 0) return;

    (async () => {
      try {
        const entries = await Promise.all(
          groupedPackages.map(async (g) => {
            const data = await fetchRatingsByPackageName(g.name, { page: 1, limit: 50 });
            const list = data?.results ?? [];
            const count = list.length;
            const avg = count ? list.reduce((s, r) => s + Number(r.star || 0), 0) / count : 0;
            return [g.name, { avg, count }] as const;
          })
        );
        setRatingsMap(Object.fromEntries(entries));
      } catch {
        // noop
      }
    })();
  }, [groupedPackages, fetchRatingsByPackageName]);

  // Favourites
  const openFavModalForGroup = React.useCallback((group: { name: string; ids: string[] }) => {
    const groupPkgs = packages.filter((p: any) => group.ids.includes(p.id));
    setFavModalItems(groupPkgs);
    setFavModalTitle(group.name);

    const init = new Set<string>();
    if (userId) {
      groupPkgs.forEach((p: any) => {
        const arr = Array.isArray(p?.isFav) ? p.isFav : [];
        if (arr.includes(userId)) init.add(p.id);
      });
    }
    setLocalFavIds(init);
    setFavModalVisible(true);
    console.log('[FavModal] open for group:', group.name, 'ids:', group.ids);
  }, [packages, userId]);

  const onToggleFavourite = React.useCallback(async (pkgId: string) => {
    try {
      setPendingFavId(pkgId);
      const res = await togglePackageFavourite(pkgId);
      const isFav = !!res?.isFav;

      setLocalFavIds(prev => {
        const next = new Set(prev);
        isFav ? next.add(pkgId) : next.delete(pkgId);
        return next;
      });

      setPackages(prev =>
        prev.map((p: any) => {
          if (p.id !== pkgId || !userId) return p;
          const arr = Array.isArray(p?.isFav) ? [...p.isFav] : [];
          const i = arr.indexOf(userId);
          if (isFav && i < 0) arr.push(userId);
          if (!isFav && i >= 0) arr.splice(i, 1);
          return { ...p, isFav: arr };
        })
      );

      if (userId) DeviceEventEmitter.emit('FAV_CHANGED', { packageId: pkgId, isFav, userId });
    } catch (e) {
      console.log('[Favourite] ERROR for package:', pkgId, e);
    } finally {
      setPendingFavId(null);
    }
  }, [togglePackageFavourite, userId]);

  React.useEffect(() => {
    if (!userId) return;
    const sub = DeviceEventEmitter.addListener('FAV_CHANGED', ({ packageId, isFav, userId: emitterUid }) => {
      if (emitterUid !== userId) return;

      setPackages(prev =>
        prev.map((p: any) => {
          if (p.id !== packageId) return p;
          const arr = Array.isArray(p?.isFav) ? [...p.isFav] : [];
          const i = arr.indexOf(userId);
          if (isFav && i < 0) arr.push(userId);
          if (!isFav && i >= 0) arr.splice(i, 1);
          return { ...p, isFav: arr };
        })
      );

      setLocalFavIds(prev => {
        const next = new Set(prev);
        isFav ? next.add(packageId) : next.delete(packageId);
        return next;
      });
    });
    return () => sub.remove();
  }, [userId]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 mt-3">
        <View className="px-5">
          <SearchInput
            placeholder={t('home.searchPlaceholder')}
          />
        </View>

        <View className="px-5 mt-6">
          <DealCard />
        </View>

        <View className="pl-5 mt-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {servicesLoading && services.length === 0 ? (
              <View className="justify-center items-center pr-3">
                <ActivityIndicator />
              </View>
            ) : (
              services.map((s: any) => (
                <ServiceCard
                  key={s.id}
                  item={s}
                  active={selectedServiceId === s.id}
                  onPress={async () => {
                    setSelectedServiceId(s.id);
                    await loadPackages(s.id, selectedVehicleType?.id);
                  }}
                />
              ))
            )}
          </ScrollView>
        </View>

        <View className="px-5 mt-6 w-full flex justify-center items-center">
          <HomeButtons
            onVehicleChange={(id, label) => setSelectedVehicleType({ id, label })}
          />
        </View>

        <View className="px-5 mt-6 w-full">
          {packagesLoading ? (
            <ActivityIndicator />
          ) : packages.length === 0 ? (
            <Text className="text-black/60" style={{ textAlign: isAr ? 'right' : 'left' }}>
              {t('home.services.noPackages')}
            </Text>
          ) : (
            sortedGroups.map((g) => {
              const p = g.sample;
              return (
                <TouchableOpacity
                  key={p.id || g.name}
                  className="bg-[#fff] rounded-[10px] px-4 py-5 mb-3"
                  style={{ elevation: 2 }}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('PrePackage', {
                      packageIds: g.ids,
                      name: g.name,
                      packages: packages.filter((p: any) => g.ids.includes(p.id)),
                    })
                  }
                >
                  <View className="flex flex-row justify-between items-start gap-3">
                    <View className="flex-1 flex-row items-start">
                      <View className="w-[84px] h-[76px] bg-[#231F20] rounded-[5px] justify-center items-center">
                        <PackageCardImg width={72} height={32} />
                      </View>

                      <View className="flex-1 flex flex-col justify-start items-start gap-2 pl-2">
                        {/* Name */}
                        <Text className="text-black text-[16px] font-medium">
                          {g.name}
                        </Text>

                        {/* rating + count */}
                        <View className="flex-row items-center">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const r = ratingsMap[g.name];
                            const avg = Math.round(r?.avg ?? 0);
                            return (
                              <Ionicons
                                key={i}
                                name={i < avg ? 'star' : 'star-outline'}
                                size={16}
                                color={i < avg ? '#FACC15' : '#9CA3AF'}
                                style={{ marginRight: 2 }}
                              />
                            );
                          })}
                          <Text className="text-black ml-1">
                            ({ratingsMap[g.name]?.count ?? 0})
                          </Text>
                        </View>

                        {/* Certified pill */}
                        <View className="mt-1 bg-[#2E9E00] rounded-full px-3 py-1 self-start">
                          <Text className="text-white text-[12px] font-semibold">{t('home.card.certified')}</Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => openFavModalForGroup(g)}
                      className="w-8 h-8 rounded-full items-center justify-center"
                      style={{ borderWidth: 1, borderColor: '#9CA3AF' }}
                    >
                      <Ionicons name="heart-outline" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <View className='w-full justify-center items-center h-[1px] bg-[#EAE5E5] rounded-full mt-5 mb-4' />

                  <View className='flex flex-row items-center justify-between'>
                    <View>
                      <Text className='text-black text-[14px] font-medium' style={{ textAlign: isAr ? 'right' : 'left' }}>
                        {t('home.card.packagesLabel')}
                      </Text>
                    </View>

                    <View className='flex flex-col justify-start items-start gap-1' style={{ width: '50%' }}>
                      {g.types.length > 0 ? (
                        g.types.map((t) => (
                          <Text key={t} className='text-[#232323] text-[11px] font-light' style={{ textAlign: isAr ? 'right' : 'left' }}>{t}</Text>
                        ))
                      ) : (
                        <Text className='text-[#232323] text-[11px] font-light'>—</Text>
                      )}
                    </View>
                  </View>

                  <View className='w-full justify-center items-center h-[1px] bg-[#EAE5E5] rounded-full mt-5 mb-4' />

                  <View className='flex flex-row items-center justify-between'>
                    <View>
                      <Text className='text-black text-[14px] font-medium' style={{ textAlign: isAr ? 'right' : 'left' }}>{g.name}</Text>
                    </View>

                    <View className='pr-2'>
                      <Text className='text-[#000] text-[14px] font-medium' style={{ textAlign: isAr ? 'left' : 'right' }}>{`${g.minPrice} SAR`}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })
          )}
        </View>
      </ScrollView>

      {/* Favourite Modal */}
      <Modal
        visible={favModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFavModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '90%', maxWidth: 480, maxHeight: '70%', backgroundColor: '#fff', borderRadius: 14, padding: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>
                {favModalTitle} — {t('home.fav.titleSuffix')}
              </Text>
              <TouchableOpacity onPress={() => setFavModalVisible(false)} style={{ padding: 6 }}>
                <Ionicons name="close" size={20} color="#111" />
              </TouchableOpacity>
            </View>

            {favModalItems.length === 0 ? (
              <Text style={{ color: '#555' }}>{t('home.fav.noPackages')}</Text>
            ) : (
              <ScrollView>
                {favModalItems.map((pkg: any) => {
                  const isFav = localFavIds.has(pkg.id);
                  return (
                    <View
                      key={pkg.id}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 8,
                        borderTopWidth: 1,
                        borderColor: '#eee',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text style={{ color: '#111', fontWeight: '600' }}>{pkg.type || '—'}</Text>
                        <Text style={{ color: '#666', marginTop: 2, textAlign: isAr ? 'right' : 'left' }}>
                          {`${pkg.pricing ?? 0} SAR`}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => onToggleFavourite(pkg.id)}
                        disabled={favLoading || pendingFavId === pkg.id}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: localFavIds.has(pkg.id) ? '#EF4444' : '#9CA3AF',
                        }}
                      >
                        {pendingFavId === pkg.id ? (
                          <ActivityIndicator size="small" />
                        ) : (
                          <Ionicons
                            name={localFavIds.has(pkg.id) ? 'heart' : 'heart-outline'}
                            size={18}
                            color={localFavIds.has(pkg.id) ? '#EF4444' : '#9CA3AF'}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

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
              }}>
              <Ionicons name="close" size={18} color="#00163B" />
            </TouchableOpacity>

            <View style={{ paddingVertical: 14, alignItems: 'center' }}>
              <HomePageAd width={220} height={200} />
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

const ServiceCard = ({
  item,
  onPress,
  active,
}: {
  item: { id: string; name: string; mediaPath?: string };
  onPress?: () => void;
  active?: boolean;
}) => {
  const uri = item.mediaPath ? `${BACKEND_URL}${item.mediaPath}` : undefined;
  return (
    <TouchableOpacity className="pr-5" onPress={onPress}>
      <View className="w-[132px] h-[88px] rounded-[10px] overflow-hidden">
        <ImageBackground
          source={uri ? { uri } : Rectangle}
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10 }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0, right: 0, bottom: 0, left: 0,
              backgroundColor: active ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.35)',
            }}
          />
          <Text
            className="text-[16px] font-bold text-center px-2"
            style={{ color: active ? '#fff' : '#fff' }}
          >
            {item.name}
          </Text>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const HomeButtons = ({ onVehicleChange }: { onVehicleChange?: (id: string, label: string) => void }) => {
  const { t } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const [vehicleName, setVehicleName] = React.useState<string>('Sedan');
  const { fetchEnumById, fetchEnumsByType } = useEnums();
  const [showVehicleModal, setShowVehicleModal] = React.useState(false);
  const [vehicleTypes, setVehicleTypes] = React.useState<any[]>([]);
  const [vtLoading, setVtLoading] = React.useState(false);

  // slots
  const { loading: slotsLoading, fetchAvailableSlots } = useSlots();
  const [showPicker, setShowPicker] = React.useState(false);
  const [slots, setSlots] = React.useState<SlotItem[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const [selectedSlot, setSelectedSlot] = React.useState<SlotItem | null>(null);
  const [showSlotModal, setShowSlotModal] = React.useState(false);

  const dayLabel = (d: Date) => {
    const today = new Date();
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = (dd.getTime() - t.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return d.toLocaleDateString(undefined, { weekday: 'long' });
  };

  React.useEffect(() => {
    (async () => {
      const car = await getCarProfile();
      // console.log('car: ', car);
      const typeId = car?.type || car?.vehicleType;
      if (typeId) {
        try {
          const en = await fetchEnumById(String(typeId));
          const label = en?.displayName || en?.name;
          setVehicleName(label || 'Sedan');
          onVehicleChange?.(String(typeId), label || 'Sedan');
          return;
        } catch { }
      }
      setVehicleName('Sedan');
    })();
  }, []);

  const fmtDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;

  const onPickDate = async (_: any, date?: Date) => {
    setShowPicker(false);
    if (!date) return;
    setSelectedDate(date);
    try {
      const res = await fetchAvailableSlots({ date: fmtDate(date) });
      setSlots(res?.slots ?? []);
      setShowSlotModal(true);
    } catch (e) {
      setSlots([]);
      setShowSlotModal(false);
    }
  };

  return (
    <View className="w-full" style={{ position: 'relative' }}>
      {/* Row of 2 cards */}
      <View className="flex flex-row items-center w-full" style={{ columnGap: 16 }}>
        <TouchableOpacity
          style={{ elevation: 5, minWidth: 0 }}
          className="bg-white h-[70px] flex-1 flex-col justify-center items-center rounded-[10px] px-3"
          onPress={() => {
            setShowVehicleModal(true);
            if (vehicleTypes.length === 0) {
              (async () => {
                setVtLoading(true);
                try {
                  const res = await fetchEnumsByType('VEHICLE_TYPE', { limit: 50 });
                  setVehicleTypes(res?.results ?? []);
                } finally {
                  setVtLoading(false);
                }
              })();
            }
          }}
        >
          <Text className="text-[15px] text-black font-normal" style={{ textAlign: isAr ? 'right' : 'left' }}>
            {t('home.vehicle.label')}
          </Text>
          <Text className="text-[15px] text-black font-medium">{vehicleName}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ elevation: 5, minWidth: 0 }}
          className="flex-1 h-[70px] rounded-[10px] overflow-hidden"
          onPress={() => {
            if (selectedDate && slots.length > 0) setShowSlotModal(true);
            else setShowPicker(true);
          }}
        >
          <LinearGradient
            colors={['#000000', '#2C4694']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flex: 1,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 12,
            }}
          >
            <Text className="text-white text-[14px] font-semibold text-center">
              {t('home.slots.availability')}
            </Text>
            <Text className="text-white text-[14px] text-center">
              {selectedDate
                ? `${dayLabel(selectedDate)}${selectedSlot ? `, ${selectedSlot.displayTime}` : `, ${t('home.slots.selectSlot')}`}`
                : t('home.slots.selectSlot')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Date picker */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={onPickDate}
          minimumDate={new Date()}
        />
      )}

      {/* Slots modal */}
      <Modal
        visible={showSlotModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSlotModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '90%', maxWidth: 480, maxHeight: '70%', backgroundColor: '#fff', borderRadius: 14, padding: 12, elevation: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111' }}>
                {selectedDate ? `${dayLabel(selectedDate)} — ${t('home.slots.pickTime')}` : t('home.slots.pickTime')}
              </Text>
              <TouchableOpacity onPress={() => setShowSlotModal(false)} style={{ padding: 6 }}>
                <Ionicons name="close" size={20} color="#111" />
              </TouchableOpacity>
            </View>
            {slotsLoading ? (
              <ActivityIndicator />
            ) : slots.length === 0 ? (
              <Text style={{ color: '#555', paddingVertical: 10 }}>{t('home.slots.noSlots')}</Text>
            ) : (
              <ScrollView>
                {slots.map((s, i) => {
                  const disabled = !s.isAvailable;
                  const active = selectedSlot?.startTime === s.startTime && selectedSlot?.endTime === s.endTime;
                  return (
                    <TouchableOpacity
                      key={`${s.startTime}-${s.endTime}-${i}`}
                      disabled={disabled}
                      onPress={() => { setSelectedSlot(s); setShowSlotModal(false); }}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        backgroundColor: active ? '#F1F5F9' : '#fff',
                        opacity: disabled ? 0.5 : 1,
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderColor: '#eee',
                      }}
                    >
                      <Text style={{ color: '#111' }}>{s.displayTime}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Vehicle type modal */}
      <Modal
        visible={showVehicleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVehicleModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '90%', maxWidth: 480, maxHeight: '70%', backgroundColor: '#fff', borderRadius: 14, padding: 12, elevation: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111' }}>
                {t('home.vehicle.modalTitle')}
              </Text>
              <TouchableOpacity onPress={() => setShowVehicleModal(false)} style={{ padding: 6 }}>
                <Ionicons name="close" size={20} color="#111" />
              </TouchableOpacity>
            </View>
            {vtLoading ? (
              <ActivityIndicator />
            ) : (
              <ScrollView>
                {vehicleTypes.map((vt: any) => {
                  const label = vt.displayName || vt.name;
                  const selected = label === vehicleName;
                  return (
                    <TouchableOpacity
                      key={vt.id || label}
                      onPress={() => {
                        setVehicleName(label || 'Sedan');
                        onVehicleChange?.(String(vt.id), label || 'Sedan');
                        setShowVehicleModal(false);
                      }}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTopWidth: 1,
                        borderColor: '#eee',
                      }}
                    >
                      <Text style={{ color: '#111' }}>{label}</Text>
                      {selected ? <Ionicons name="checkmark" size={18} color="#2C4694" /> : null}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
