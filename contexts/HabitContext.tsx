import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { db } from '@/db/client';
import { useAuth } from '@/contexts/AuthContext';
import { eq } from 'drizzle-orm';
import { categories } from '@/db/schema';


// Define the shape of category records
export type Category = {
  id: number;
  name: string;
  userId: number;
  color: string;
  icon: string;
};

// all category-related states and actions for the app
type HabitContextType = {
    categories: Category[];
    refreshAll: () => Promise<void>;
    addCategory: (data: { name: string; color: string; icon: string }) => Promise<void>;
    updateCategory: (id: number, data: { name: string; color: string; icon: string }) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
    getCategoryById: (id: number) => Category | undefined;
};

const HabitContext = createContext<HabitContextType | null>(null);

// Provider component for load and managing habit-related data for the logged-in user.
export function HabitProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [categoryList, setCategories] = useState<Category[]>([]);

    // reloading all data from the database for the current user
    const refreshAll = useCallback(async () => {
        if (!user) {
            setCategories([]);
            return;
        }
        const c = await db.select().from(categories).where(eq(categories.userID, user.id));
        setCategories(c.map(cat => ({ ...cat, userId: cat.userID })));
    }, [user]);

    // refreshing data when the user changes (login/logout)
    useEffect(() => {
      void refreshAll();
    }, [refreshAll]);
    
    // inserting a new category and refreshing
    const addCategory = async (data: { name: string; color: string; icon: string }) => {
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

    return (
        <HabitContext.Provider 
        value={{ 
            categories: categoryList, 
            refreshAll, 
            addCategory, 
            updateCategory, 
            deleteCategory, 
            getCategoryById 
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
