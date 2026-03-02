import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'RATED_PACKAGES_V1';

type MapType = Record<string /* userId */, string[] /* packageNames */>;

/** Return a Set of package names the user already rated */
export const getRatedPackages = async (userId: string) => {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return new Set<string>();
    const map: MapType = JSON.parse(raw);
    return new Set(map[userId] || []);
};

/** Mark a package name as rated for this user */
export const markPackageRated = async (userId: string, packageName: string) => {
    const raw = await AsyncStorage.getItem(KEY);
    const map: MapType = raw ? JSON.parse(raw) : {};
    const set = new Set(map[userId] || []);
    set.add(packageName);
    map[userId] = Array.from(set);
    await AsyncStorage.setItem(KEY, JSON.stringify(map));
};
