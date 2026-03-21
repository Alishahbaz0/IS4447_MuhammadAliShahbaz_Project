import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import React, { createContext, useContext, useState } from "react";

// defining the shape of the authentication context
export type User = {
    id: number;
    username: string;
    email: string;
};

// all auth-related state and functions will be provided through this context
type AuthContextType = {
    user: User | null;                                                                              // currently authenticated user (null if not logged in)
    isLoading: boolean;                                                                             // indicates if auth state is being determined (e.g., on app startup)
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;      // function to log in a user
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;   // function to register a new user
    logout: () => void;                                                                             // function to log out the current user
    deleteAccount: () => Promise<void>;                                                             // function to delete the current user's account
};

// creating the authentication context with default values
const AuthContext = createContext<AuthContextType | null>(null);

// simple password hashing
function hashPassword(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    return 'h_' + Math.abs(hash).toString(36); // prefix with 'h_' to ensure it starts with a letter (SQLite doesn't allow purely numeric column values)
}

// provider component that wraps the app and provides authentication state and functions
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // registering a new user
    const register = async (username: string, email: string, password: string) => {
        try {
            // validating all fields are provided
            if (!username.trim() || !email.trim() || !password.trim()) {
                return { success: false, error: "All fields are required" };
            }
            
            // check password length
            if (password.length < 6) {
                return { success: false, error: "Password must be at least 6 characters" };
            }

            // check if email is already registered
            const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
            if (existing.length > 0) {
                return { success: false, error: "An account with this email already exists" };
            }
            
            // insert new user into the database
            const [newUser] = await db.insert(users).values({
                username: username.trim(),
                email: email.toLowerCase().trim(),
                passwordHash: hashPassword(password),
            }).returning();

            // set the authenticated user in state
            setUser({ id: newUser.id, username: newUser.username, email: newUser.email });
            return { success: true };
        } catch (e: any) {
            return { success: false, error: "Registration failed: " + e.message };
        }
    };

    // logging in an existing user
    const login = async (email: string, password: string) => {
        try {
            // validating all fields are provided
            if (!email.trim() || !password.trim()) {
                return { success: false, error: "All fields are required" };
            }

            // find user by email
            const [found] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
            if (!found) {
                return { success: false, error: "No account found with this email" };
            }

            // check if password matches
            if (found.passwordHash !== hashPassword(password)) {
                return { success: false, error: "Incorrect password" };
            }

            // set the authenticated user in state            
            setUser({ id: found.id, username: found.username, email: found.email });
            return { success: true };
        } catch (e: any) {
            return { success: false, error: "Login failed: " + e.message };
        }
    };

    // logging out the current user
    const logout = () => {
        setUser(null);
    };

    // deleting the current user's account
    const deleteAccount = async () => {
        if (!user) return;
        await db.delete(users).where(eq(users.id, user.id));
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
}

// custom hook for consuming the authentication context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}