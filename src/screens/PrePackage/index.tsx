// src/screens/PrePackage/index.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Modal,
    ScrollView,
    DeviceEventEmitter,
    ImageBackground,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRating } from '../../hooks/useRating';
import { useFavourites } from '../../hooks/useFavourites';
import { getUserData } from '../../hooks/useAuthStorage';
import HeaderCover from "../../assets/images/prepackage-header.png";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

type Pkg = { id: string; type?: string; pricing?: number; isFav?: string[] };
type RouteParams = { packageIds?: string[]; name?: string; packages?: Pkg[] };

type ReviewItem = {
    id: string;
    description?: string;
    star: number;
    date: string;
    userId?: { id: string; name?: string; email?: string };
    packageId?: { id: string; name?: string; type?: string; pricing?: number };
};

const PrePackageScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const isAr = i18n.language?.startsWith('ar');
    const { params } = useRoute<any>() as { params: RouteParams };
    const pkgName = params?.name || '';
    const ids = params?.packageIds || [];
    const passedPkgs: Pkg[] = Array.isArray(params?.packages) ? params!.packages! : [];

    // ratings
    const { loading, fetchRatingsByPackageName } = useRating();
    const [avg, setAvg] = React.useState<number>(0);
    const [count, setCount] = React.useState<number>(0);
    const [reviews, setReviews] = React.useState<ReviewItem[]>([]);

    // favourites
    const { togglePackageFavourite, loading: favLoading } = useFavourites();
    const [userId, setUserId] = React.useState<string | null>(null);

    // modal state (same structure as Home)
    const [favModalVisible, setFavModalVisible] = React.useState(false);
    const [favModalTitle, setFavModalTitle] = React.useState('');
    const [favModalItems, setFavModalItems] = React.useState<Pkg[]>([]);
    const [localFavIds, setLocalFavIds] = React.useState<Set<string>>(new Set());
    const [pendingFavId, setPendingFavId] = React.useState<string | null>(null);

    // grab current user
    React.useEffect(() => {
        (async () => {
            const u = await getUserData();
            setUserId(u?.id || null);
        })();
    }, []);

    // seed rating summary + reviews list
    React.useEffect(() => {
        let mounted = true;
        (async () => {
            if (!pkgName) return;
            try {
                const data = await fetchRatingsByPackageName(pkgName, { page: 1, limit: 50 });
                const list = (data?.results || []) as unknown as ReviewItem[];
                const stars = list.map(r => Number(r.star) || 0);
                const c = stars.length;
                const a = c ? stars.reduce((s, v) => s + v, 0) / c : 0;
                if (mounted) {
                    setCount(c);
                    setAvg(a);
                    setReviews(list);
                }
            } catch {
                // noop
            }
        })();
        return () => { mounted = false; };
    }, [pkgName, fetchRatingsByPackageName]);

    // 🔥 seed initial favourite state from packages coming from Home
    React.useEffect(() => {
        if (!userId || !passedPkgs?.length) return;
        const init = new Set<string>();
        passedPkgs.forEach(p => {
            const arr = Array.isArray(p?.isFav) ? p.isFav : [];
            if (arr.includes(userId)) init.add(p.id);
        });
        setLocalFavIds(init);
    }, [userId, passedPkgs]);

    const roundedAvg = Math.round(avg);

    const openFavModal = React.useCallback(() => {
        setFavModalTitle(pkgName);
        setFavModalItems(passedPkgs);

        // ✅ recompute from latest passedPkgs on every open
        const init = new Set<string>();
        if (userId) {
            passedPkgs.forEach(p => {
                const arr = Array.isArray(p?.isFav) ? p.isFav : [];
                if (arr.includes(userId)) init.add(p.id);
            });
        }
        setLocalFavIds(init);

        setFavModalVisible(true);
    }, [pkgName, passedPkgs, userId]);

    const onToggleFavourite = React.useCallback(async (id: string) => {
        try {
            setPendingFavId(id);
            const res = await togglePackageFavourite(id); // { isFav: boolean }
            const isFav = !!res?.isFav;

            setLocalFavIds(prev => {
                const next = new Set(prev);
                isFav ? next.add(id) : next.delete(id);
                return next;
            });

            // keep modal items' isFav arrays in sync (so next open seeds correctly)
            setFavModalItems(prev =>
                prev.map(p => {
                    if (p.id !== id || !userId) return p;
                    const arr = Array.isArray(p.isFav) ? [...p.isFav] : [];
                    const i = arr.indexOf(userId);
                    if (isFav && i < 0) arr.push(userId);
                    if (!isFav && i >= 0) arr.splice(i, 1);
                    return { ...p, isFav: arr };
                })
            );

            // 🔊 broadcast to other screens
            if (userId) DeviceEventEmitter.emit('FAV_CHANGED', { packageId: id, isFav, userId });
        } catch (e) {
            console.log('[PrePackage] Favourite ERR:', e);
        } finally {
            setPendingFavId(null);
        }
    }, [togglePackageFavourite, userId]);

    React.useEffect(() => {
        if (!userId) return;
        const sub = DeviceEventEmitter.addListener('FAV_CHANGED', ({ packageId, isFav, userId: emitterUid }) => {
            if (emitterUid !== userId) return;

            // update modal chips if open
            setLocalFavIds(prev => {
                const next = new Set(prev);
                isFav ? next.add(packageId) : next.delete(packageId);
                return next;
            });

            // also update favModalItems’ isFav arrays so next modal open seeds correctly
            setFavModalItems(prev =>
                prev.map(p => {
                    if (p.id !== packageId) return p;
                    const arr = Array.isArray(p.isFav) ? [...p.isFav] : [];
                    const i = arr.indexOf(userId);
                    if (isFav && i < 0) arr.push(userId);
                    if (!isFav && i >= 0) arr.splice(i, 1);
                    return { ...p, isFav: arr };
                })
            );
        });
        return () => sub.remove();
    }, [userId]);

    const fmtDate = (iso?: string) => {
        if (!iso) return '—';
        try {
            const d = new Date(iso);
            return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }); // e.g., Aug 04, 2023
        } catch { return '—'; }
    };

    const Stars = ({ n }: { n: number }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                    key={i}
                    name={i < n ? 'star' : 'star-outline'}
                    size={14}
                    color={i < n ? '#F59E0B' : '#9CA3AF'}
                    style={{ marginRight: 2 }}
                />
            ))}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
            <ImageBackground
                source={HeaderCover}
                style={{ height: 180, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}
                imageStyle={{ borderRadius: 12 }}
            >
                {/* black overlay */}
                <View
                    style={{
                        position: 'absolute',
                        left: 0, right: 0, top: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                    }}
                />

                {/* content on image */}
                <View style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}>
                    {/* top row: title + heart */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', flex: 1, textAlign: isAr ? 'left' : 'left' }}>
                            {pkgName || t('prePackage.fallbackName')}
                        </Text>
                        <TouchableOpacity
                            onPress={openFavModal}
                            style={{
                                width: 32, height: 32, borderRadius: 16,
                                alignItems: 'center', justifyContent: 'center',
                                borderWidth: 1, borderColor: '#E5E7EB',
                                backgroundColor: 'rgba(255,255,255,0.15)',
                            }}
                        >
                            <Ionicons name="heart-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* bottom: rating summary */}
                    <View>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <View
                                    style={{
                                        flexDirection: isAr ? 'row-reverse' : 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Ionicons
                                            key={i}
                                            name={i < Math.round(avg) ? 'star' : 'star-outline'}
                                            size={20}
                                            color={i < Math.round(avg) ? '#FACC15' : '#E5E7EB'}
                                            style={{ marginHorizontal: 1 }}
                                        />
                                    ))}
                                    <Text
                                        style={{
                                            marginStart: isAr ? 6 : 6,   // RTL/LTR aware spacing
                                            color: '#fff',
                                            textAlign: isAr ? 'right' : 'left',
                                        }}
                                    >
                                        {t('prePackage.reviews', { count })}
                                    </Text>
                                </View>
                                {!!count && (
                                    <Text style={{ marginTop: 4, color: '#F3F4F6' }}>
                                        {t('prePackage.avg', { avg: avg.toFixed(1) })}
                                    </Text>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </ImageBackground>

            {/* Reviews list (replaces the “dummy text”) */}
            <View style={{ flex: 1 }}>
                {loading ? (
                    <ActivityIndicator />
                ) : reviews.length === 0 ? (
                    <Text style={{ color: '#6B7280', marginBottom: 16 }}>
                        {t('prePackage.noReviews')}
                    </Text>
                ) : (
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 16 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {reviews.map((r, idx) => {
                            const name = r?.userId?.name || r?.userId?.email || 'User';
                            const pkgLabel = r?.packageId?.type || r?.packageId?.name || pkgName || 'Package';
                            const dateStr = fmtDate(r?.date);
                            const desc = (r?.description || '').trim();

                            return (
                                <View
                                    key={r.id || `${idx}`}
                                    style={{
                                        paddingVertical: 10,
                                        borderTopWidth: idx === 0 ? 0 : 1,
                                        borderColor: '#E7E7E7',
                                    }}
                                >
                                    {/* Top row: stars + date */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 }}>
                                        <Stars n={Math.round(r.star || 0)} />

                                        <Text style={{ color: '#111' }}>|</Text>

                                        <Text style={{ color: '#223671', fontSize: 14, fontWeight: '400' }}>{dateStr}</Text>
                                    </View>

                                    {/* Description */}
                                    {/* {!!desc && (
                                        <Text style={{ color: '#111', lineHeight: 18, marginBottom: 6 }}>
                                            {desc}
                                        </Text>
                                    )} */}

                                    {/* Footer: Name | Package: Type/Name */}
                                    <Text style={{ color: '#223671', fontWeight: '400' }}>
                                        {name} <Text style={{ color: '#223671' }}>|</Text>{' '}
                                        <Text>{t('prePackage.packageLabel')}: {pkgLabel}</Text>
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                )}
            </View>

            {/* CTA */}
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('Package', {
                        packageIds: ids,
                        name: pkgName,
                    })
                }
                style={{
                    backgroundColor: '#2D5BD1',
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    alignSelf: 'center',
                    marginTop: 8,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text style={{ color: '#fff', fontWeight: '700' }}>
                    {t('prePackage.cta')}
                </Text>
            </TouchableOpacity>

            {/* Favourite Modal — type + price, and reflect existing favourites */}
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
                                {t('prePackage.modalTitle', { name: favModalTitle })}
                            </Text>
                            <TouchableOpacity onPress={() => setFavModalVisible(false)} style={{ padding: 6 }}>
                                <Ionicons name="close" size={20} color="#111" />
                            </TouchableOpacity>
                        </View>

                        {favModalItems.length === 0 ? (
                            <Text style={{ color: '#555' }}>
                                {t('prePackage.noPackages')}
                            </Text>
                        ) : (
                            <ScrollView>
                                {favModalItems.map((pkg, idx) => {
                                    const isFav = localFavIds.has(pkg.id);
                                    return (
                                        <View
                                            key={pkg.id}
                                            style={{
                                                paddingVertical: 12,
                                                paddingHorizontal: 8,
                                                borderTopWidth: idx === 0 ? 0 : 1,
                                                borderColor: '#eee',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <View style={{ flex: 1, paddingRight: 12 }}>
                                                <Text style={{ color: '#111', fontWeight: '600' }}>{pkg.type || '—'}</Text>
                                                <Text style={{ color: '#666', marginTop: 2 }}>{`${pkg.pricing ?? 0} SAR`}</Text>
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
                                                    borderColor: isFav ? '#EF4444' : '#9CA3AF',
                                                }}
                                            >
                                                {pendingFavId === pkg.id ? (
                                                    <ActivityIndicator size="small" />
                                                ) : (
                                                    <Ionicons
                                                        name={isFav ? 'heart' : 'heart-outline'}
                                                        size={18}
                                                        color={isFav ? '#EF4444' : '#9CA3AF'}
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
        </SafeAreaView>
    );
};

export default PrePackageScreen;
