import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function MapScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;

  const storeLocation = { latitude: 40.4168, longitude: -3.7038, title: '取货地点', description: '新鲜蔬果店' };
  const customerLocation = { latitude: 40.4188, longitude: -3.6918, title: '送货地点', description: '客户地址' };
  const initialRegion = { latitude: (storeLocation.latitude + customerLocation.latitude) / 2, longitude: (storeLocation.longitude + customerLocation.longitude) / 2, latitudeDelta: 0.02, longitudeDelta: 0.02 };

  return (
    <View style={styles.screen}><View style={styles.container}>
      <View style={styles.map}><View style={styles.mapContent}><Text style={{ fontSize: 48 }}>🗺️</Text><Text style={styles.mapTitle}>导航地图</Text><Text style={styles.mapSubtitle}>Web模式下地图不可用</Text></View></View>
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}><Text style={styles.infoTitle}>📍 配送导航</Text><View style={styles.orderTag}><Text style={styles.orderTagText}>#{orderId}</Text></View></View>
        <View style={styles.routeSection}>
          <View style={styles.routeItem}><View style={[styles.routeDot, { backgroundColor: '#00B578' }]} /><View><Text style={styles.routeLabel}>取货</Text><Text style={styles.routeName}>{storeLocation.description}</Text></View></View>
          <View style={styles.routeConnector}><View style={styles.routeDash} /><View style={styles.routeDash} /><View style={styles.routeDash} /></View>
          <View style={styles.routeItem}><View style={[styles.routeDot, { backgroundColor: '#FF5722' }]} /><View><Text style={styles.routeLabel}>送货</Text><Text style={styles.routeName}>Gran Vía 78</Text></View></View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={{ fontSize: 18 }}>📏</Text><Text style={styles.statValue}>2.3 km</Text><Text style={styles.statLabel}>距离</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Text style={{ fontSize: 18 }}>⏱️</Text><Text style={styles.statValue}>8 min</Text><Text style={styles.statLabel}>预计时间</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Text style={{ fontSize: 18 }}>💰</Text><Text style={styles.statValue}>€5.0</Text><Text style={styles.statLabel}>配送费</Text></View>
        </View>
        <TouchableOpacity style={styles.completeButton} onPress={() => navigation.goBack()} activeOpacity={0.85}><Text style={styles.completeButtonText}>✅ 确认送达</Text></TouchableOpacity>
      </View>
    </View></View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { flex: 1, maxWidth: 480, width: '100%', alignSelf: 'center' },
  map: { flex: 1, backgroundColor: '#E8ECF0', justifyContent: 'center', alignItems: 'center' },
  mapContent: { alignItems: 'center' },
  mapTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 12 },
  mapSubtitle: { fontSize: 14, color: '#999', marginTop: 4 },
  infoCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 8 },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  infoTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  orderTag: { backgroundColor: '#E8F9F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  orderTagText: { fontSize: 12, fontWeight: '600', color: '#00B578' },
  routeSection: { backgroundColor: '#FAFAFA', borderRadius: 14, padding: 14, marginBottom: 16 },
  routeItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  routeDot: { width: 14, height: 14, borderRadius: 7 },
  routeLabel: { fontSize: 12, color: '#999' },
  routeName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginTop: 2 },
  routeConnector: { flexDirection: 'column', paddingLeft: 5, paddingVertical: 4, gap: 4 },
  routeDash: { width: 3, height: 6, backgroundColor: '#D0D0D0', borderRadius: 2 },
  statsRow: { flexDirection: 'row', backgroundColor: '#FAFAFA', borderRadius: 14, paddingVertical: 14, marginBottom: 16 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginTop: 4 },
  statLabel: { fontSize: 11, color: '#999', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#E0E0E0', marginVertical: 4 },
  completeButton: { backgroundColor: '#00B578', padding: 16, borderRadius: 16, alignItems: 'center' },
  completeButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
});
