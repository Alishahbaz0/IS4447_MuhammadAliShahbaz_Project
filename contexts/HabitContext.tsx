import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/db/client';
import { categories, habitLogs, habits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';


// Define the shape of category records
export type Category = {
  id: number;
  name: string;
  userID: number;
  color: string;
  icon: string;
};

// ----- Iteration 4: Habits CRUD -----
// setting the shape of Habit records.
export type Habit = {
    id: number;
    userID: number;
    categoryID: number;
    name: string;
    frequency: string;
    notes: string | null;
    createdAt: Date | number;
};

// ----- Iteration 5: Habit Logging -----
// Shape of a habit log entry
export type HabitLog = {
    id: number;
    habitID: number;
    date: string;
    count: number;
    completed: number;
    notes: string | null;
};


// writing a helper function to return today's date as YYYY-MM-DD string
// I used the following online resources to learn how to use date functions:
// Date Global Objects, Mozilla, Official JS Documentation, Available at:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
function todayString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}



// all habit/category-related states and actions for the app
type HabitContextType = {
    categories: Category[];
    habits: Habit[];
    logs: HabitLog[];
    refreshAll: () => Promise<void>;

    // ----- Iteration 3: Categories CRUD -----
    // category-related actions
    addCategory: (data: { name: string; color: string; icon: string }) => Promise<void>;
    updateCategory: (id: number, data: { name: string; color: string; icon: string }) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
    getCategoryById: (id: number) => Category | undefined;

    // ----- Iteration 4: Habits CRUD -----
    // habit-related actions
    addHabit: (data: { name: string; frequency: string; notes: string | null; categoryID: number }) => Promise<void>;
    updateHabit: (id: number, data: { name: string; frequency: string; notes: string; categoryID: number }) => Promise<void>;
    deleteHabit: (id: number) => Promise<void>;
    getHabitById: (id: number) => Habit | undefined;
    getHabitCountForCategory: (categoryID: number) => number;

    // ----- Iteration 5: Habit Logging -----
    // Log actions
    toggleHabitToday: (habitId: number) => Promise<void>;
    isCompletedToday: (habitId: number) => boolean;
    getStreak: (habitId: number) => number;
    getLogsForHabit: (habitId: number) => HabitLog[];
};

const HabitContext = createContext<HabitContextType | null>(null);

// Provider component for load and managing habit-related data for the logged-in user.
export function HabitProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [categoryList, setCategories] = useState<Category[]>([]);
    const [habitList, setHabits] = useState<Habit[]>([]);
    const [logList, setLogs] = useState<HabitLog[]>([]);

    // reloading all data from the database for the current user
    const refreshAll = useCallback(async () => {
        if (!user) {
            setCategories([]);
            setHabits([]);
            setLogs([]);
            return;
        }
        // ----- Iteration 3: Categories CRUD -----
        const c = await db.select().from(categories).where(eq(categories.userID, user.id));
        setCategories(c);
        
        // ----- Iteration 4: Habits CRUD -----
        const h = await db.select().from(habits).where(eq(habits.userID, user.id));
        setHabits(h as Habit[]);
        
        // ----- Iteration 5: Habit Logging -----
        const habitIds = h.map((hh) => hh.id);
        if (habitIds.length === 0) {
            setLogs([]);
        } else {
            const allLogs = await db.select().from(habitLogs);
            const userLogs = allLogs.filter((log) => habitIds.includes(log.habitID));
            setLogs(userLogs as HabitLog[]);
        }
        }, [user]);

    // refreshing data when the user changes (login/logout)
    useEffect(() => {
      void refreshAll();
    }, [refreshAll]);
    

    // ----- Category-related actions -----
    // inserting a new category and refreshing
    const addCategory = async (data: { name: string; color: string; icon: string }) => {
        if (!user) return;
        await db.insert(categories).values({ ...data, userID: user!.id });
        await refreshAll();
    };

    // updating an existing category and refreshing
    const updateCategory = async (id: number, data: { name: string; color: string; icon: string }) => {
        await db.update(categories).set(data).where(eq(categories.id, id));
        await refreshAll();
    };

    // deleting a category and refreshing
    const deleteCategory = async (id: number) => {
        await db.delete(categories).where(eq(categories.id, id));
        await refreshAll();
    };

    // looking up a category by its ID from the current state
    const getCategoryById = (id: number) => categoryList.find((c) => c.id === id);


    // ----- Habit-related actions -----
    // inserting a new habit and refreshing
    const addHabit = async (data: { name: string; frequency: string; notes: string | null; categoryID: number }) => {
        if (!user) return;
        await db.insert(habits).values({ ...data, userID: user!.id });
        await refreshAll();
    }

    // updating an existing habit and refreshing
    const updateHabit = async (id: number, data: { name: string; frequency: string; notes: string | null; categoryID: number }) => {
        await db.update(habits).set(data).where(eq(habits.id, id));
        await refreshAll();
    };

    // deleting a habit and refreshing
    const deleteHabit = async (id: number) => {
        await db.delete(habits).where(eq(habits.id, id));
        await refreshAll();
    };

    // looking up a habit by its ID from the current state
    const getHabitById = (id: number) => habitList.find((h) => h.id === id);

    // counting how many habits belong to a given category (for display on the category cards)
    const getHabitCountForCategory = (categoryID: number) => 
        habitList.filter((h) => h.categoryID === categoryID).length;


    // ----- Log Actions -----
    // Toggling today's completion for a habit
    const toggleHabitToday = async (habitId: number) => {
        const today = todayString();
        const existing = logList.find((log) => log.habitID === habitId && log.date === today);

        if (existing) {
            // already logged today - remove the log
            await db.delete(habitLogs).where(eq(habitLogs.id, existing.id));
        } else {
            // not logged today - inset new completion
            await db.insert(habitLogs).values({
                habitID: habitId,
                date: today,
                count: 1,
                completed: 1,
                notes: '', 
            });
        }
        await refreshAll();
    };

    // checking if habit has been completed today
    const isCompletedToday = (habitId: number) => {
        const today = todayString();
        return logList.some((log) => log.habitID === habitId && log.date === today && log.completed === 1);
    };


    // calculating current streak - how many consecutive days has the log been completed.
    // I learned how to do this using the following online resources:
    // Streak Tracking, Harshit Masiwal's Workout Tracker, Mintlify Documentation, Available at:
    // https://www.mintlify.com/harshitmasiwal/WorkoutTracker/guide/streak-tracking

    // main/hooks/use-streaks.ts, Streak-app-react-native, ShamilWorkspace, GitHub Repository, Available at:
    // https://github.com/shamilworkspace/streak-app-react-native/blob/main/hooks/use-streaks.ts


    const getStreak = (habitID: number) => {
        const habitLogsForHabit = logList
        .filter((log) => log.habitID === habitID && log.completed === 1)
        .map((log) => log.date)
        .sort()
        .reverse();

        if (habitLogsForHabit.length === 0) return 0;

        // building a set for 0(1) lookups
        const logSet = new Set(habitLogsForHabit);

        let streak = 0;
        const d = new Date();

        // if today isn't logged, start counting from yesterday
        const todayStr = todayString();
        if (!logSet.has(todayStr)) {
            d.setDate(d.getDate() - 1);
        } 

        // going back day-by-day to find a gap
        while (true) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const key = `${y}-${m}-${day}`;

            if (logSet.has(key)) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    };

    // getting all logs for a specific habit (used in the habit detail screen)
    const getLogsForHabit = (habitId: number) =>
        logList.filter((log) => log.habitID === habitId).sort((a, b) => b.date.localeCompare(a.date));

    return (
        <HabitContext.Provider 
        value={{ 
            categories: categoryList,
            habits: habitList, 
            logs: logList,
            refreshAll, 
            addCategory, 
            updateCategory, 
            deleteCategory, 
            getCategoryById,
            addHabit,
            updateHabit,
            deleteHabit,
            getHabitById,
            getHabitCountForCategory,
            toggleHabitToday,
            isCompletedToday,
            getStreak,
            getLogsForHabit, 
        }}
    >
        {children}
    </HabitContext.Provider>
    );
}

// Custom hook for consuming the HabitContext
export function useHabits() {
    const context = useContext(HabitContext);
    if (!context) throw new Error('useHabit must be used within a HabitProvider');
    return context;
}
