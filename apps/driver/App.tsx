import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import EarningsScreen from './screens/EarningsScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import MapScreen from './screens/MapScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#00B578', tabBarInactiveTintColor: '#999', tabBarStyle: { backgroundColor: '#FFFFFF', borderTopWidth: 0, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 8, height: 60, paddingBottom: 8, paddingTop: 4 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }, headerStyle: { backgroundColor: '#00B578', elevation: 0, shadowOpacity: 0 }, headerTintColor: '#FFFFFF', headerTitleStyle: { fontWeight: 'bold', fontSize: 18 } }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '接单', headerTitle: '接单大厅', tabBarIcon: ({ focused }) => <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>🛵</Text> }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: '订单', headerTitle: '我的订单', tabBarIcon: ({ focused }) => <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>📋</Text> }} />
      <Tab.Screen name="Earnings" component={EarningsScreen} options={{ title: '收入', headerTitle: '收入统计', tabBarIcon: ({ focused }) => <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>💰</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '我的', headerShown: false, tabBarIcon: ({ focused }) => <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: '骑手登录', headerShown: false }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: '导航', headerStyle: { backgroundColor: '#00B578' }, headerTintColor: '#FFFFFF' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
