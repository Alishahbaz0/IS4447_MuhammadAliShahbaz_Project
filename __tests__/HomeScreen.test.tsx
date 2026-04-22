{/*
Deliverable 10: Testing
Integration test: Confirming the main habits homescreen renders correctly with sample data
Success Criteria: data is seeded and flows from state to rendered UI.

I learned how to create this HomeScreen.test.tsx file from the following online resources:
- react-native-lab/blob/main/tests/StudentList.test.tsx, Rory Pierce, GitHub Repository, Available at:
https://github.com/rorypierce111/react-native-lab/blob/main/tests/StudentList.test.tsx
*/}

import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import HomeScreen from '../app/(tabs)/index';
import { HabitContext } from '../contexts/HabitContext';

// mock db client
jest.mock('../db/client', () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
    },
}));


// mock expo router
jest.mock('expo-router', () => ({
    useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));


// mock SafeAreaView to a plain view
jest.mock('react-native-safe-area-context', () => {
    const { View } = require('react-native');
    return { SafeAreaView: View };
});


// mock useQuote hook to avoid making real API calls during tests
jest.mock('../hooks/useQuote', () => ({
    useQuote: () => ({ quote: 'Test Quote', author: 'Test' }),
}));


// mock HabitCard
jest.mock('../components/ui/HabitCard', () => {
    const { Text } = require('react-native');
    return function MockHabitCard({ habit }: any) {
        return <Text>{habit.name}</Text>;
    };
});


// mock ThemeContext
jest.mock('../contexts/themeContext', () => ({
    useTheme: () => ({
        colors: {
            primary: '#0D9488',
            primaryLight: '#CCFBF1',
            background: '#F8FAFC',
            surface: '#FFFFFF',
            surfaceAlt: '#F1F5F9',
            text: '#0F172A',
            textSecondary: '#64748B',
            textMuted: '#94A3B8',
            border: '#E2E8F0',
            card: '#FFFFFF',
            cardBorder: '#E2E8F0',
            warning: '#D97706',
            success: '#16A34A',
        },
    }),
}));


// mock AuthContext
jest.mock('../contexts/authContext', () => ({
    useAuth: () => ({
        user: { id: 1, username: 'TestUser', email: 'test@test.com' },
        logout: jest.fn(),
    }),
}));


// mock data matching the seedSampleData function
const mockContextValue = {
    habits: [{
        id: 1,
        userId: 1,
        categoryId: 1,
        name: 'Morning Run',
        frequency: 'Daily',
        notes: '30 minutes run',
        createdAt: new Date(),
    }],
    categories: [{
        id: 1,
        userId: 1,
        name: 'Fitness',
        color: '#EF4444',
        icon: '💪',
    }],
    logs: [],
    targets: [],
    getCategoryById: (id: number) => id === 1 ? { id, name: 'Fitness', color: '#EF4444', icon: '💪' } : undefined,
    isCompletedToday: () => false,
    getLogsForHabit: () => [],
    toggleLog: jest.fn(),
    addHabit: jest.fn(),
    updateHabit: jest.fn(),
    deleteHabit: jest.fn(),
    addCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
    addTarget: jest.fn(),
    updateTarget: jest.fn(),
    deleteTarget: jest.fn(),
    getLogsforDate: jest.fn(),
    getTargetsForHabit: jest.fn(),
    refreshAll: jest.fn(),
};


describe('HomeScreen', () => {
    it('renders the habit name and Create New Habit button', async () => {
        const { getByText } = render(
            <HabitContext.Provider value={mockContextValue as any}>
                <HomeScreen />
            </HabitContext.Provider>
        );
        
        await waitFor(() => {
            // check if habit name from mock data is rendered
            expect(getByText('Morning Run')).toBeTruthy();
            // check if Create New Habit button is rendered
            expect(getByText('Create New Habit')).toBeTruthy();
            // check the welcome header renders with the username
            expect(getByText('Welcome TestUser')).toBeTruthy();
        });
    });
});