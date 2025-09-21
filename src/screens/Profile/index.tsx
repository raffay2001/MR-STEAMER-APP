import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUserData } from '../../hooks/useAuthStorage';
import ProfileImage from '../../assets/images/profile.png';

const Profile: React.FC = () => {
    const [user, setUser] = React.useState<any>(null);
    React.useEffect(() => { (async () => setUser(await getUserData()))(); }, []);

    const pts = Number(user?.pts ?? 0);
    const balance = Number(user?.balance ?? 0);
    const email = user?.email || '—';
    const name = user?.name || 'Guest';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#2D4795' }}>
            <View style={{ backgroundColor: '#2D4795', height: 180 }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 16, marginTop: 20 }}>
                    <Image
                        source={ProfileImage}
                        style={{ width: 80, height: 80, borderRadius: 40 }}
                    />
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20 }}>
                        {name}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>
                        {email}
                    </Text>
                </View>
            </View>

            {/* White section */}
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: 36,
                    borderTopRightRadius: 36,
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    marginTop: -20,
                    overflow: 'hidden',
                }}
            >
                {/* Card 1: Wallet / Username / Change Password */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#ECECEC',
                        padding: 16,
                        shadowColor: '#000',
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 2,
                        marginTop: 12,
                    }}
                >
                    {/* Wallet row */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 16, fontWeight: '500' }}>Wallet</Text>
                        <Text style={{ color: '#000', fontSize: 14, fontWeight: '400' }}>{pts}pts</Text>
                    </View>

                    <View style={{ height: 1, backgroundColor: '#E7E7E7', marginVertical: 12 }} />

                    {/* Username row */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 14, fontWeight: '400' }}>Username</Text>
                        <Text className='text-black opacity-50 text-[12px] font-normal'>{email}</Text>
                    </View>

                    {/* Change password */}
                    <TouchableOpacity
                        onPress={() => Alert.alert('Change Password', 'Coming soon')}
                        className='mt-5 flex justify-center items-center w-full'
                    >
                        <Text className='text-black opacity-70 text-[14px] font-normal underline'>Change Password</Text>
                    </TouchableOpacity>
                </View>

                {/* Card 2: Remaining Balance */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#ECECEC',
                        padding: 16,
                        marginTop: 14,
                        shadowColor: '#000',
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 2,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 14, fontWeight: '500' }}>Remaining Balance</Text>
                        <Text style={{ color: '#000', fontSize: 14, fontWeight: '500' }}>${balance.toFixed(0)}</Text>
                    </View>

                    <View style={{ height: 1, backgroundColor: '#EAEAEA', marginVertical: 12 }} />

                    <TouchableOpacity
                        onPress={() => Alert.alert('Send gifts', 'Coming soon')}
                        style={{
                            alignSelf: 'center',
                            backgroundColor: '#16A34A',
                            paddingHorizontal: 18,
                            height: 34,
                            borderRadius: 17,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '700' }}>Send gifts</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => Alert.alert('Share App', 'Coming soon')}
                    style={{
                        backgroundColor: '#2D4795',
                        height: 52,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        marginTop: 30,
                    }}
                >
                    <Ionicons name="share-social-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Share App</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Profile;
