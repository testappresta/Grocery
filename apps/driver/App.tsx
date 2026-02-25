import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// 屏幕组件
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import EarningsScreen from './screens/EarningsScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import MapScreen from './screens/MapScreen';

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
        options={{ title: '接单' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{ title: '订单' }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen} 
        options={{ title: '收入' }}
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
          name="Login" 
          component={LoginScreen}
          options={{ title: '骑手登录', headerShown: false }}
        />
        
        <Stack.Screen 
          name="Map" 
          component={MapScreen}
          options={{ title: '导航' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
