import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Utensils, ClipboardList, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName;
          if (route.name === 'index') {
            iconName = <Home size={20} color={isFocused ? '#8B5E3C' : '#999'} />;
          } else if (route.name === 'explore') {
            iconName = <Utensils size={20} color={isFocused ? '#8B5E3C' : '#999'} />;
          } else if (route.name === 'orders') {
            iconName = <ClipboardList size={20} color={isFocused ? '#8B5E3C' : '#999'} />;
          } else if (route.name === 'profile') {
            iconName = <User size={20} color={isFocused ? '#8B5E3C' : '#999'} />;
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabItem}
            >
              <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                {iconName}
              </View>
              <Text style={[styles.label, { color: isFocused ? '#8B5E3C' : '#999' }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Menu',
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pesanan',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 50, // Increased to avoid device navigation bar
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    marginBottom: 4,
  },
  activeIconContainer: {
    // Optional: Add styling for active icon if needed
  },
  label: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
