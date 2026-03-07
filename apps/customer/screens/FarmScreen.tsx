import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { farmAPI } from '../services/api';

interface CropType {
  type: string;
  emoji: string;
  name: string;
  growthTime: number;
  points: number;
  seedCount: number;
}

interface Plot {
  index: number;
  status: 'empty' | 'growing' | 'ready';
  cropType?: string;
  cropEmoji?: string;
  cropName?: string;
  plantedAt?: string;
  readyAt?: string;
  points?: number;
}

interface FarmData {
  points: number;
  seeds: number;
  plots: Plot[];
  checkedInToday: boolean;
  recentHarvests: { cropName: string; cropEmoji: string; points: number; harvestedAt: string }[];
}

const CROP_CATALOG: CropType[] = [
  { type: 'tomato', emoji: '🍅', name: '番茄', growthTime: 30, points: 50, seedCount: 0 },
  { type: 'apple', emoji: '🍎', name: '苹果', growthTime: 60, points: 80, seedCount: 0 },
  { type: 'carrot', emoji: '🥕', name: '胡萝卜', growthTime: 20, points: 30, seedCount: 0 },
  { type: 'lettuce', emoji: '🥬', name: '生菜', growthTime: 15, points: 20, seedCount: 0 },
  { type: 'strawberry', emoji: '🍓', name: '草莓', growthTime: 45, points: 60, seedCount: 0 },
  { type: 'watermelon', emoji: '🍉', name: '西瓜', growthTime: 90, points: 120, seedCount: 0 },
];

const DEFAULT_FARM: FarmData = {
  points: 200,
  seeds: 12,
  plots: [
    { index: 0, status: 'empty' },
    { index: 1, status: 'empty' },
    { index: 2, status: 'empty' },
    { index: 3, status: 'empty' },
    { index: 4, status: 'empty' },
    { index: 5, status: 'empty' },
  ],
  checkedInToday: false,
  recentHarvests: [],
};

function formatCountdown(readyAt: string): string {
  const diff = new Date(readyAt).getTime() - Date.now();
  if (diff <= 0) return '已成熟';
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  if (mins > 0) return `${mins}分${secs}秒`;
  return `${secs}秒`;
}

function getProgress(plantedAt: string, readyAt: string): number {
  const total = new Date(readyAt).getTime() - new Date(plantedAt).getTime();
  const elapsed = Date.now() - new Date(plantedAt).getTime();
  if (total <= 0) return 1;
  return Math.min(Math.max(elapsed / total, 0), 1);
}

export default function FarmScreen() {
  const navigation = useNavigation();
  const [farm, setFarm] = useState<FarmData>(DEFAULT_FARM);
  const [loading, setLoading] = useState(true);
  const [seedModalVisible, setSeedModalVisible] = useState(false);
  const [selectedPlotIndex, setSelectedPlotIndex] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const bounceAnims = useRef<Animated.Value[]>(
    Array.from({ length: 6 }, () => new Animated.Value(1))
  ).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadFarm = useCallback(async () => {
    try {
      const response = await farmAPI.getFarm();
      const data = response.data?.data || response.data;
      if (data) setFarm(data);
    } catch {
      // use default / current state on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFarm();
    timerRef.current = setInterval(() => {
      setFarm((prev) => {
        const updated = prev.plots.map((p) => {
          if (p.status === 'growing' && p.readyAt && new Date(p.readyAt).getTime() <= Date.now()) {
            return { ...p, status: 'ready' as const };
          }
          return p;
        });
        return { ...prev, plots: updated };
      });
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loadFarm]);

  useEffect(() => {
    farm.plots.forEach((plot, i) => {
      if (plot.status === 'ready') {
        const loop = Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnims[i], { toValue: 1.15, duration: 400, useNativeDriver: true }),
            Animated.timing(bounceAnims[i], { toValue: 1, duration: 400, useNativeDriver: true }),
          ])
        );
        loop.start();
        return () => loop.stop();
      } else {
        bounceAnims[i].setValue(1);
      }
    });
  }, [farm.plots, bounceAnims]);

  const handleCheckIn = async () => {
    if (farm.checkedInToday) {
      Alert.alert('已签到', '今天已经签到过啦，明天再来吧！');
      return;
    }
    setActionLoading(true);
    try {
      await farmAPI.checkIn();
      await loadFarm();
      Alert.alert('签到成功', '🎉 获得积分和种子奖励！');
    } catch {
      setFarm((prev) => ({ ...prev, points: prev.points + 10, seeds: prev.seeds + 2, checkedInToday: true }));
      Alert.alert('签到成功', '🎉 获得 10 积分 + 2 种子！');
    } finally {
      setActionLoading(false);
    }
  };

  const openSeedModal = (plotIndex: number) => {
    setSelectedPlotIndex(plotIndex);
    setSeedModalVisible(true);
  };

  const handlePlant = async (crop: CropType) => {
    if (selectedPlotIndex === null) return;
    setSeedModalVisible(false);
    setActionLoading(true);
    try {
      await farmAPI.plant(selectedPlotIndex, crop.type);
      await loadFarm();
    } catch {
      const now = new Date();
      const readyAt = new Date(now.getTime() + crop.growthTime * 60000).toISOString();
      setFarm((prev) => ({
        ...prev,
        seeds: Math.max(prev.seeds - 1, 0),
        plots: prev.plots.map((p) =>
          p.index === selectedPlotIndex
            ? {
                ...p,
                status: 'growing' as const,
                cropType: crop.type,
                cropEmoji: crop.emoji,
                cropName: crop.name,
                plantedAt: now.toISOString(),
                readyAt,
                points: crop.points,
              }
            : p
        ),
      }));
    } finally {
      setActionLoading(false);
      setSelectedPlotIndex(null);
    }
  };

  const handleHarvest = async (plotIndex: number) => {
    setActionLoading(true);
    try {
      await farmAPI.harvest(plotIndex);
      await loadFarm();
    } catch {
      const plot = farm.plots[plotIndex];
      setFarm((prev) => ({
        ...prev,
        points: prev.points + (plot.points || 0),
        plots: prev.plots.map((p) =>
          p.index === plotIndex ? { index: plotIndex, status: 'empty' as const } : p
        ),
        recentHarvests: [
          { cropName: plot.cropName || '', cropEmoji: plot.cropEmoji || '', points: plot.points || 0, harvestedAt: new Date().toISOString() },
          ...prev.recentHarvests.slice(0, 9),
        ],
      }));
      Alert.alert('收获成功', `${plot.cropEmoji} ${plot.cropName} +${plot.points} 积分`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleHarvestAll = async () => {
    const readyPlots = farm.plots.filter((p) => p.status === 'ready');
    if (readyPlots.length === 0) return;
    setActionLoading(true);
    try {
      await farmAPI.harvestAll();
      await loadFarm();
    } catch {
      let totalPoints = 0;
      const newHarvests: FarmData['recentHarvests'] = [];
      const updatedPlots = farm.plots.map((p) => {
        if (p.status === 'ready') {
          totalPoints += p.points || 0;
          newHarvests.push({
            cropName: p.cropName || '',
            cropEmoji: p.cropEmoji || '',
            points: p.points || 0,
            harvestedAt: new Date().toISOString(),
          });
          return { index: p.index, status: 'empty' as const };
        }
        return p;
      });
      setFarm((prev) => ({
        ...prev,
        points: prev.points + totalPoints,
        plots: updatedPlots,
        recentHarvests: [...newHarvests, ...prev.recentHarvests].slice(0, 10),
      }));
      Alert.alert('一键收获', `🎉 收获了 ${readyPlots.length} 株作物，共 +${totalPoints} 积分！`);
    } finally {
      setActionLoading(false);
    }
  };

  const hasReadyCrops = farm.plots.some((p) => p.status === 'ready');

  const renderPlot = (plot: Plot) => {
    const isReady = plot.status === 'ready';
    const isGrowing = plot.status === 'growing';
    const isEmpty = plot.status === 'empty';

    return (
      <View key={plot.index} style={styles.plotWrapper}>
        <View
          style={[
            styles.plotCard,
            isEmpty && styles.plotEmpty,
            isGrowing && styles.plotGrowing,
            isReady && styles.plotReady,
          ]}
        >
          {isEmpty && (
            <TouchableOpacity style={styles.plotContent} onPress={() => openSeedModal(plot.index)}>
              <Text style={styles.soilEmoji}>🟫</Text>
              <View style={styles.plantButton}>
                <Text style={styles.plantButtonText}>🌱 播种</Text>
              </View>
            </TouchableOpacity>
          )}
          {isGrowing && (
            <View style={styles.plotContent}>
              <Text style={styles.cropEmoji}>{plot.cropEmoji}</Text>
              <Text style={styles.cropName}>{plot.cropName}</Text>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${getProgress(plot.plantedAt!, plot.readyAt!) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.countdownText}>⏳ {formatCountdown(plot.readyAt!)}</Text>
            </View>
          )}
          {isReady && (
            <TouchableOpacity style={styles.plotContent} onPress={() => handleHarvest(plot.index)}>
              <Animated.Text
                style={[styles.cropEmojiLarge, { transform: [{ scale: bounceAnims[plot.index] }] }]}
              >
                {plot.cropEmoji}
              </Animated.Text>
              <Text style={styles.readyLabel}>+{plot.points} 积分</Text>
              <View style={styles.harvestButton}>
                <Text style={styles.harvestButtonText}>✂️ 收获</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00B578" />
          <Text style={styles.loadingText}>加载农场中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🌾 我的农场</Text>
            <Text style={styles.headerSubtitle}>种菜赚积分，兑换配送券</Text>

            <View style={styles.statsRow}>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>💰 {farm.points} 积分</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>🌱 {farm.seeds} 种子</Text>
              </View>
              <TouchableOpacity
                style={[styles.checkInBtn, farm.checkedInToday && styles.checkInBtnDone]}
                onPress={handleCheckIn}
                disabled={actionLoading}
              >
                <Text style={[styles.checkInText, farm.checkedInToday && styles.checkInTextDone]}>
                  {farm.checkedInToday ? '✅ 已签到' : '📅 签到'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Farm Grid */}
          <View style={styles.farmSection}>
            <Text style={styles.sectionTitle}>🌿 我的菜地</Text>
            <View style={styles.farmGrid}>
              {farm.plots.map((plot) => renderPlot(plot))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            {hasReadyCrops && (
              <TouchableOpacity
                style={styles.harvestAllBtn}
                onPress={handleHarvestAll}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.harvestAllText}>🌾 一键收获</Text>
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.rewardsBtn}
              onPress={() => navigation.navigate('Rewards' as never)}
            >
              <Text style={styles.rewardsBtnText}>🎁 积分商城</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Harvests */}
          {farm.recentHarvests.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>📜 最近收获</Text>
              {farm.recentHarvests.slice(0, 5).map((h, i) => (
                <View key={i} style={styles.historyItem}>
                  <Text style={styles.historyEmoji}>{h.cropEmoji}</Text>
                  <Text style={styles.historyName}>{h.cropName}</Text>
                  <Text style={styles.historyPoints}>+{h.points} 积分</Text>
                  <Text style={styles.historyTime}>
                    {new Date(h.harvestedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>

        {/* Seed Selector Modal */}
        <Modal visible={seedModalVisible} transparent animationType="slide">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSeedModalVisible(false)}
          >
            <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>🌱 选择种子</Text>
              <Text style={styles.modalSubtitle}>当前种子：{farm.seeds} 颗</Text>

              <View style={styles.seedGrid}>
                {CROP_CATALOG.map((crop) => (
                  <TouchableOpacity
                    key={crop.type}
                    style={[styles.seedCard, farm.seeds <= 0 && styles.seedCardDisabled]}
                    onPress={() => farm.seeds > 0 && handlePlant(crop)}
                    disabled={farm.seeds <= 0}
                  >
                    <Text style={styles.seedEmoji}>{crop.emoji}</Text>
                    <Text style={styles.seedName}>{crop.name}</Text>
                    <Text style={styles.seedInfo}>⏱ {crop.growthTime}分钟</Text>
                    <Text style={styles.seedReward}>🏆 {crop.points}积分</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.modalClose} onPress={() => setSeedModalVisible(false)}>
                <Text style={styles.modalCloseText}>取消</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },

  // Header
  header: {
    backgroundColor: '#00B578',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  statBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  checkInBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 'auto',
  },
  checkInBtnDone: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  checkInText: {
    color: '#00B578',
    fontSize: 13,
    fontWeight: '700',
  },
  checkInTextDone: {
    color: '#FFFFFF',
  },

  // Farm Grid
  farmSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  farmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  plotWrapper: {
    width: '48.5%',
    marginBottom: 12,
  },
  plotCard: {
    borderRadius: 16,
    padding: 14,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  plotEmpty: {
    backgroundColor: '#FFF8F0',
    borderWidth: 2,
    borderColor: '#E8D5C0',
    borderStyle: 'dashed',
  },
  plotGrowing: {
    backgroundColor: '#F0FFF4',
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  plotReady: {
    backgroundColor: '#FFFFF0',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  plotContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soilEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  plantButton: {
    backgroundColor: '#00B578',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  plantButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cropEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  cropName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 6,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00B578',
    borderRadius: 3,
  },
  countdownText: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '500',
  },
  cropEmojiLarge: {
    fontSize: 40,
    marginBottom: 4,
  },
  readyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 6,
  },
  harvestButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  harvestButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Actions
  actionSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  harvestAllBtn: {
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  harvestAllText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  rewardsBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#00B578',
  },
  rewardsBtnText: {
    color: '#00B578',
    fontSize: 16,
    fontWeight: '700',
  },

  // History
  historySection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historyEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  historyPoints: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B35',
    marginRight: 8,
  },
  historyTime: {
    fontSize: 11,
    color: '#999',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  seedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  seedCard: {
    width: '31%',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  seedCardDisabled: {
    opacity: 0.4,
  },
  seedEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  seedName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  seedInfo: {
    fontSize: 11,
    color: '#718096',
    marginBottom: 2,
  },
  seedReward: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '600',
  },
  modalClose: {
    backgroundColor: '#F5F6FA',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
});
