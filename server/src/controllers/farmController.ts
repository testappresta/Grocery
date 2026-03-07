import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import {
  Farm,
  Reward,
  Redemption,
  DEFAULT_REWARDS,
  CROP_TYPES,
  GROWTH_TIMES,
  HARVEST_POINTS,
  CropType
} from '../models/Farm';

function updatePlotsReadiness(farm: any): void {
  const now = Date.now();
  for (const plot of farm.plots) {
    if (!plot.isEmpty && plot.plantedAt && !plot.isReady) {
      const elapsed = (now - new Date(plot.plantedAt).getTime()) / 1000;
      if (elapsed >= plot.growthTime) {
        plot.isReady = true;
      }
    }
  }
}

// 获取或创建农场
export const getFarm = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  let farm = await Farm.findOne({ user: userId });

  if (!farm) {
    farm = await Farm.create({ user: userId });
  }

  updatePlotsReadiness(farm);
  await farm.save();

  res.json({
    success: true,
    data: { farm }
  });
});

// 种植作物
export const plantCrop = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const { plotIndex, cropType } = req.body;

  if (plotIndex === undefined || plotIndex < 0 || plotIndex > 5) {
    return res.status(400).json({
      success: false,
      message: '无效的地块索引（0-5）'
    });
  }

  if (!CROP_TYPES.includes(cropType)) {
    return res.status(400).json({
      success: false,
      message: '无效的作物类型'
    });
  }

  const farm = await Farm.findOne({ user: userId });
  if (!farm) {
    return res.status(404).json({
      success: false,
      message: '农场不存在'
    });
  }

  const plot = farm.plots[plotIndex];
  if (!plot.isEmpty) {
    return res.status(400).json({
      success: false,
      message: '该地块已被占用'
    });
  }

  const seedKey = cropType as CropType;
  if (farm.seeds[seedKey] <= 0) {
    return res.status(400).json({
      success: false,
      message: `没有足够的${cropType}种子`
    });
  }

  farm.seeds[seedKey] -= 1;
  farm.plots[plotIndex] = {
    index: plotIndex,
    crop: cropType,
    plantedAt: new Date(),
    growthTime: GROWTH_TIMES[seedKey],
    isReady: false,
    isEmpty: false
  };

  await farm.save();

  res.json({
    success: true,
    message: `成功种植${cropType}`,
    data: { farm }
  });
});

// 收获单个作物
export const harvestCrop = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const { plotIndex } = req.body;

  if (plotIndex === undefined || plotIndex < 0 || plotIndex > 5) {
    return res.status(400).json({
      success: false,
      message: '无效的地块索引'
    });
  }

  const farm = await Farm.findOne({ user: userId });
  if (!farm) {
    return res.status(404).json({
      success: false,
      message: '农场不存在'
    });
  }

  updatePlotsReadiness(farm);

  const plot = farm.plots[plotIndex];
  if (plot.isEmpty) {
    return res.status(400).json({
      success: false,
      message: '该地块为空'
    });
  }

  if (!plot.isReady) {
    return res.status(400).json({
      success: false,
      message: '作物尚未成熟'
    });
  }

  const cropType = plot.crop as CropType;
  const points = HARVEST_POINTS[cropType];

  farm.points += points;
  farm.totalPointsEarned += points;

  farm.plots[plotIndex] = {
    index: plotIndex,
    crop: null,
    plantedAt: null,
    growthTime: 0,
    isReady: false,
    isEmpty: true
  };

  await farm.save();

  res.json({
    success: true,
    message: `收获${cropType}，获得${points}积分`,
    data: {
      pointsEarned: points,
      farm
    }
  });
});

// 收获所有成熟作物
export const harvestAll = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  const farm = await Farm.findOne({ user: userId });
  if (!farm) {
    return res.status(404).json({
      success: false,
      message: '农场不存在'
    });
  }

  updatePlotsReadiness(farm);

  let totalPoints = 0;
  let harvestedCount = 0;

  for (let i = 0; i < farm.plots.length; i++) {
    const plot = farm.plots[i];
    if (!plot.isEmpty && plot.isReady && plot.crop) {
      const cropType = plot.crop as CropType;
      totalPoints += HARVEST_POINTS[cropType];
      harvestedCount++;

      farm.plots[i] = {
        index: i,
        crop: null,
        plantedAt: null,
        growthTime: 0,
        isReady: false,
        isEmpty: true
      };
    }
  }

  if (harvestedCount === 0) {
    return res.status(400).json({
      success: false,
      message: '没有可收获的作物'
    });
  }

  farm.points += totalPoints;
  farm.totalPointsEarned += totalPoints;
  await farm.save();

  res.json({
    success: true,
    message: `收获了${harvestedCount}个作物，共获得${totalPoints}积分`,
    data: {
      harvestedCount,
      pointsEarned: totalPoints,
      farm
    }
  });
});

// 每日签到
export const dailyCheckIn = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  let farm = await Farm.findOne({ user: userId });
  if (!farm) {
    farm = await Farm.create({ user: userId });
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (farm.dailyCheckIn) {
    const lastCheckIn = new Date(farm.dailyCheckIn);
    const lastCheckInDate = new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate());

    if (lastCheckInDate.getTime() === today.getTime()) {
      return res.status(400).json({
        success: false,
        message: '今日已签到'
      });
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastCheckInDate.getTime() === yesterday.getTime()) {
      farm.checkInStreak += 1;
    } else {
      farm.checkInStreak = 1;
    }
  } else {
    farm.checkInStreak = 1;
  }

  const bonusPoints = Math.min(10 + farm.checkInStreak * 2, 30);
  farm.points += bonusPoints;
  farm.totalPointsEarned += bonusPoints;
  farm.dailyCheckIn = now;

  await farm.save();

  res.json({
    success: true,
    message: `签到成功！获得${bonusPoints}积分`,
    data: {
      pointsEarned: bonusPoints,
      checkInStreak: farm.checkInStreak,
      farm
    }
  });
});

// 初始化默认奖励
async function seedDefaultRewards(): Promise<void> {
  const count = await Reward.countDocuments();
  if (count === 0) {
    await Reward.insertMany(DEFAULT_REWARDS);
  }
}

// 获取奖励列表
export const getRewards = asyncHandler(async (req: Request, res: Response) => {
  await seedDefaultRewards();

  const rewards = await Reward.find({ isActive: true }).sort('pointsCost');

  const farm = await Farm.findOne({ user: req.userId });
  const userPoints = farm?.points || 0;

  res.json({
    success: true,
    data: {
      rewards,
      userPoints
    }
  });
});

// 兑换奖励
export const redeemReward = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const { rewardId } = req.body;

  if (!rewardId) {
    return res.status(400).json({
      success: false,
      message: '请提供奖励ID'
    });
  }

  const reward = await Reward.findById(rewardId);
  if (!reward || !reward.isActive) {
    return res.status(404).json({
      success: false,
      message: '奖励不存在或已下架'
    });
  }

  if (reward.stock <= 0) {
    return res.status(400).json({
      success: false,
      message: '奖励库存不足'
    });
  }

  const farm = await Farm.findOne({ user: userId });
  if (!farm) {
    return res.status(404).json({
      success: false,
      message: '农场不存在'
    });
  }

  if (farm.points < reward.pointsCost) {
    return res.status(400).json({
      success: false,
      message: `积分不足，需要${reward.pointsCost}积分，当前${farm.points}积分`
    });
  }

  farm.points -= reward.pointsCost;
  reward.stock -= 1;

  const redemption = await Redemption.create({
    user: userId,
    reward: {
      name: reward.name,
      description: reward.description,
      type: reward.type,
      value: reward.value,
      pointsCost: reward.pointsCost,
      icon: reward.icon
    },
    pointsSpent: reward.pointsCost,
    redeemedAt: new Date()
  });

  await farm.save();
  await reward.save();

  res.json({
    success: true,
    message: `成功兑换"${reward.name}"`,
    data: {
      redemption,
      remainingPoints: farm.points
    }
  });
});

// 获取兑换历史
export const getRedemptionHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  const redemptions = await Redemption.find({ user: userId })
    .sort('-redeemedAt');

  res.json({
    success: true,
    data: { redemptions }
  });
});
