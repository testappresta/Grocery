import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// 屏幕组件
import DashboardScreen from './screens/DashboardScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProductsScreen from './screens/ProductsScreen';
import StoreScreen from './screens/StoreScreen';
import LoginScreen from './screens/LoginScreen';

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
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: '数据' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{ title: '订单' }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductsScreen} 
        options={{ title: '商品' }}
      />
      <Tab.Screen 
        name="Store" 
        component={StoreScreen} 
        options={{ title: '店铺' }}
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
          name="Login" 
          component={LoginScreen}
          options={{ title: '商家登录', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
