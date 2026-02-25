# 蔬菜水果配送 App - Grocery Delivery App

## 项目概述
一个全功能的蔬菜水果配送应用，包含用户端、商家端和配送端。

## 技术栈
- **前端**: React Native (跨平台 iOS/Android)
- **后端**: Node.js + Express
- **数据库**: MongoDB
- **支付**: Stripe / 支付宝 / 微信支付
- **地图**: Google Maps / 高德地图
- **推送**: Firebase Cloud Messaging

## 功能模块

### 1. 用户端 (Customer App)
- [x] 用户注册/登录
- [x] 浏览商品分类
- [x] 购物车管理
- [x] 订单管理
- [x] 地址管理
- [x] 支付集成
- [x] 订单追踪
- [x] 评价系统

### 2. 商家端 (Merchant App)
- [x] 店铺管理
- [x] 商品管理
- [x] 订单处理
- [x] 库存管理
- [x] 数据分析
- [x] 营销活动

### 3. 配送端 (Driver App)
- [x] 接单管理
- [x] 路线导航
- [x] 订单状态更新
- [x] 收入统计

### 4. 管理后台 (Admin Dashboard)
- [x] 用户管理
- [x] 商家管理
- [x] 订单管理
- [x] 配送员管理
- [x] 数据统计
- [x] 系统设置

## 项目结构
```
grocery-delivery-app/
├── apps/
│   ├── customer/          # 用户端 React Native
│   ├── merchant/          # 商家端 React Native
│   ├── driver/            # 配送端 React Native
│   └── admin/             # 管理后台 React
├── server/                # 后端 API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── shared/                # 共享代码
│   ├── types/
│   └── constants/
└── docs/                  # 文档
```

## 快速开始

### 环境要求
- Node.js >= 18
- MongoDB >= 5.0
- React Native 开发环境

### 安装依赖
```bash
cd server && npm install
cd apps/customer && npm install
```

### 启动开发服务器
```bash
# 后端
cd server && npm run dev

# 用户端
cd apps/customer && npx react-native run-android
# 或
cd apps/customer && npx react-native run-ios
```

## API 文档
详见 `docs/api.md`

## 数据库设计
详见 `docs/database.md`

## 部署指南
详见 `docs/deployment.md`
