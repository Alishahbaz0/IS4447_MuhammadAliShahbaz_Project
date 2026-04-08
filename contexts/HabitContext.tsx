import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/db/client';
import { categories, habits } from '@/db/schema';
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



// all habit/category-related states and actions for the app
type HabitContextType = {
    categories: Category[];
    habits: Habit[];
    refreshAll: () => Promise<void>;

    // category-related actions
    addCategory: (data: { name: string; color: string; icon: string }) => Promise<void>;
    updateCategory: (id: number, data: { name: string; color: string; icon: string }) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
    getCategoryById: (id: number) => Category | undefined;

    // habit-related actions
    addHabit: (data: { name: string; frequency: string; notes: string | null; categoryID: number }) => Promise<void>;
    updateHabit: (id: number, data: { name: string; frequency: string; notes: string; categoryID: number }) => Promise<void>;
    deleteHabit: (id: number) => Promise<void>;
    getHabitById: (id: number) => Habit | undefined;
    getHabitCountForCategory: (categoryID: number) => number;
};

const HabitContext = createContext<HabitContextType | null>(null);

// Provider component for load and managing habit-related data for the logged-in user.
export function HabitProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [categoryList, setCategories] = useState<Category[]>([]);
    const [habitList, setHabits] = useState<Habit[]>([]);

    // reloading all data from the database for the current user
    const refreshAll = useCallback(async () => {
        if (!user) {
            setCategories([]);
            setHabits([]);
            return;
        }
        const c = await db.select().from(categories).where(eq(categories.userID, user.id));
        setCategories(c);
        const h = await db.select().from(habits).where(eq(habits.userID, user.id));
        setHabits(h as Habit[]);
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

    return (
        <HabitContext.Provider 
        value={{ 
            categories: categoryList,
            habits: habitList, 
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
        }}
    >
        {children}
    </HabitContext.Provider>
    );
}

// Custom hook for consuming the HabitContext
export const useHabit = () => {
    const context = useContext(HabitContext);
    if (!context) throw new Error('useHabit must be used within a HabitProvider');
    return context;
}
