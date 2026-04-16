// tab navigator with home and categories tabs
// I learned how to use (tabs) for navigation using the following online resources:

// JavaScript Tabs with Expo Router, Expo Documentation, Available at:
// https://docs.expo.dev/router/advanced/tabs/

// Adding Navigation (Different Tabs), Expo Documentation, Available at:
//https://docs.expo.dev/tutorial/add-navigation/

// Expo Router Tab Navigation, Aaron Saunders, YouTube Tutorial, Available at:
// https://www.youtube.com/watch?v=ZCj85YJZF04


import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';


export default function TabLayout() {
    const { colors } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.tabIconActive,
                tabBarInactiveTintColor: colors.tabIconDefault,
                tabBarStyle: { 
                    backgroundColor: colors.tabBar,
                    borderTopColor: colors.tabBarBorder,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: 'Categories',
                    tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
                }}
            />
            {/* ----- Iteration 7: charts + insights ----- */}
            <Tabs.Screen 
                name="insights"
                options={{
                    title: 'Insights',
                    tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />
                }}
            />
            {/* ----- Iteration 8: Seed data + Profile ----- */}
            <Tabs.Screen 
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
