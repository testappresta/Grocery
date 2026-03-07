import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { farmAPI } from '../services/api';

interface Reward {
  _id: string;
  emoji: string;
  name: string;
  description: string;
  pointsCost: number;
  stock: number;
}

interface RedemptionRecord {
  _id: string;
  rewardName: string;
  rewardEmoji: string;
  pointsCost: number;
  redeemedAt: string;
}

const DEFAULT_REWARDS: Reward[] = [
  { _id: '1', emoji: '🚚', name: '免配送费券', description: '单笔订单免配送费', pointsCost: 100, stock: 99 },
  { _id: '2', emoji: '💰', name: '满30减5券', description: '满30元立减5元', pointsCost: 200, stock: 50 },
  { _id: '3', emoji: '🎫', name: '满50减10券', description: '满50元立减10元', pointsCost: 350, stock: 30 },
  { _id: '4', emoji: '🥗', name: '新鲜沙拉', description: '兑换一份田园沙拉', pointsCost: 500, stock: 20 },
  { _id: '5', emoji: '🧃', name: '鲜榨果汁', description: '兑换一杯鲜榨果汁', pointsCost: 300, stock: 40 },
  { _id: '6', emoji: '🎁', name: '神秘礼包', description: '随机蔬果礼包一份', pointsCost: 800, stock: 10 },
];

export default function RewardsScreen() {
  const navigation = useNavigation();
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>(DEFAULT_REWARDS);
  const [history, setHistory] = useState<RedemptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [farmRes, rewardsRes, historyRes] = await Promise.all([
        farmAPI.getFarm(),
        farmAPI.getRewards(),
        farmAPI.getHistory(),
      ]);
      const farmData = farmRes.data?.data || farmRes.data;
      if (farmData?.points != null) setPoints(farmData.points);
      const rewardsData = rewardsRes.data?.data || rewardsRes.data;
      if (rewardsData?.rewards) setRewards(rewardsData.rewards);
      const historyData = historyRes.data?.data || historyRes.data;
      if (historyData?.history) setHistory(historyData.history);
    } catch {
      // use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleRedeem = (reward: Reward) => {
    if (points < reward.pointsCost) {
      Alert.alert('积分不足', `兑换 ${reward.name} 需要 ${reward.pointsCost} 积分，当前仅有 ${points} 积分。`);
      return;
    }
    if (reward.stock <= 0) {
      Alert.alert('库存不足', `${reward.name} 已兑完。`);
      return;
    }
    Alert.alert(
      '确认兑换',
      `确定要用 ${reward.pointsCost} 积分兑换「${reward.name}」吗？`,
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => confirmRedeem(reward) },
      ]
    );
  };

  const confirmRedeem = async (reward: Reward) => {
    setRedeemingId(reward._id);
    try {
      await farmAPI.redeemReward(reward._id);
      await loadData();
      Alert.alert('兑换成功', `🎉 成功兑换「${reward.name}」！`);
    } catch {
      setPoints((prev) => prev - reward.pointsCost);
      setRewards((prev) =>
        prev.map((r) => (r._id === reward._id ? { ...r, stock: r.stock - 1 } : r))
      );
      setHistory((prev) => [
        {
          _id: Date.now().toString(),
          rewardName: reward.name,
          rewardEmoji: reward.emoji,
          pointsCost: reward.pointsCost,
          redeemedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      Alert.alert('兑换成功', `🎉 成功兑换「${reward.name}」！`);
    } finally {
      setRedeemingId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00B578" />
          <Text style={styles.loadingText}>加载积分商城...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00B578']} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🎁 积分商城</Text>
            <Text style={styles.headerSubtitle}>用农场积分兑换配送优惠</Text>
            <View style={styles.pointsCard}>
              <Text style={styles.pointsLabel}>当前积分</Text>
              <View style={styles.pointsValueRow}>
                <Text style={styles.pointsCoin}>💰</Text>
                <Text style={styles.pointsValue}>{points}</Text>
              </View>
              <TouchableOpacity
                style={styles.backToFarmBtn}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backToFarmText}>🌾 回到农场</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Rewards Grid */}
          <View style={styles.rewardsSection}>
            <Text style={styles.sectionTitle}>🛍 可兑换奖品</Text>
            <View style={styles.rewardsGrid}>
              {rewards.map((reward) => {
                const canAfford = points >= reward.pointsCost;
                const inStock = reward.stock > 0;
                const isRedeeming = redeemingId === reward._id;

                return (
                  <View key={reward._id} style={styles.rewardCardWrapper}>
                    <View style={[styles.rewardCard, !canAfford && styles.rewardCardDimmed]}>
                      <Text style={styles.rewardEmoji}>{reward.emoji}</Text>
                      <Text style={styles.rewardName} numberOfLines={1}>{reward.name}</Text>
                      <Text style={styles.rewardDesc} numberOfLines={2}>{reward.description}</Text>
                      <View style={styles.rewardCostRow}>
                        <Text style={styles.rewardCostIcon}>💰</Text>
                        <Text style={styles.rewardCostValue}>{reward.pointsCost}</Text>
                      </View>
                      <Text style={styles.stockText}>
                        库存: {inStock ? reward.stock : '已兑完'}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.redeemBtn,
                          canAfford && inStock ? styles.redeemBtnActive : styles.redeemBtnDisabled,
                        ]}
                        onPress={() => handleRedeem(reward)}
                        disabled={isRedeeming || !inStock}
                      >
                        {isRedeeming ? (
                          <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                          <Text
                            style={[
                              styles.redeemBtnText,
                              !(canAfford && inStock) && styles.redeemBtnTextDisabled,
                            ]}
                          >
                            兑换
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Redemption History */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>📋 兑换记录</Text>
            {history.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyText}>还没有兑换记录</Text>
                <Text style={styles.emptySubtext}>快去农场种菜赚积分吧！</Text>
              </View>
            ) : (
              history.map((record) => (
                <View key={record._id} style={styles.historyItem}>
                  <Text style={styles.historyEmoji}>{record.rewardEmoji}</Text>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyName}>{record.rewardName}</Text>
                    <Text style={styles.historyDate}>
                      {new Date(record.redeemedAt).toLocaleDateString('zh-CN', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.historyPoints}>-{record.pointsCost} 积分</Text>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
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
    paddingBottom: 28,
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
  pointsCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  pointsValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsCoin: {
    fontSize: 24,
    marginRight: 6,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  backToFarmBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  backToFarmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Rewards
  rewardsSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rewardCardWrapper: {
    width: '48.5%',
    marginBottom: 12,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  rewardCardDimmed: {
    opacity: 0.7,
  },
  rewardEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  rewardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  rewardDesc: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 8,
    minHeight: 32,
  },
  rewardCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rewardCostIcon: {
    fontSize: 14,
    marginRight: 3,
  },
  rewardCostValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B35',
  },
  stockText: {
    fontSize: 11,
    color: '#A0AEC0',
    marginBottom: 8,
  },
  redeemBtn: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  redeemBtnActive: {
    backgroundColor: '#00B578',
  },
  redeemBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  redeemBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  redeemBtnTextDisabled: {
    color: '#A0AEC0',
  },

  // History
  historySection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  emptyHistory: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#A0AEC0',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historyEmoji: {
    fontSize: 26,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  historyPoints: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
});
