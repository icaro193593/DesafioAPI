import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Drawer } from 'expo-router/drawer';
import { MaterialIcons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerType: 'front',
          drawerStyle: {
            width: 250,
            backgroundColor: '#ffffff',
          },
          headerStyle: {
            backgroundColor: '#2563EB',
          },
          headerTintColor: '#ffffff',
          drawerActiveTintColor: '#2563EB',
          drawerInactiveTintColor: '#333333',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Início',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="sobre"
          options={{
            title: 'Sobre',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="info" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="(moedas)"
          options={{
            title: 'Moedas',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="attach-money" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </SafeAreaProvider>
  );
}
