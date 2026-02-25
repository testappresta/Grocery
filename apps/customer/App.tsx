import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// 屏幕组件
import HomeScreen from './screens/HomeScreen';
import StoresScreen from './screens/StoresScreen';
import CartScreen from './screens/CartScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import StoreDetailScreen from './screens/StoreDetailScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import LoginScreen from './screens/LoginScreen';
import AddressesScreen from './screens/AddressesScreen';

// 导航器
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 主标签导航
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: '首页' }}
      />
      <Tab.Screen 
        name="Stores" 
        component={StoresScreen} 
        options={{ title: '商家' }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ title: '购物车' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{ title: '订单' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: '我的' }}
      />
    </Tab.Navigator>
  );
}

// 主应用
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen}
          options={{ title: '商品详情' }}
        />
        <Stack.Screen 
          name="StoreDetail" 
          component={StoreDetailScreen}
          options={{ title: '店铺详情' }}
        />
        
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen}
          options={{ title: '结算' }}
        />
        
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: '登录', headerShown: false }}
        />
        
        <Stack.Screen 
          name="Addresses" 
          component={AddressesScreen}
          options={{ title: '我的地址' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}