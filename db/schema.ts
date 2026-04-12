import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// creating a Users table for storing registered accounts
// features the following attributes: id, email, password, createdAt
export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});


// categories table for storing habit categories (e.g., Health, Learning, etc.)
// stores the categories associated colour and icon
export const categories = sqliteTable("categories", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userID: integer("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    color: text("color").notNull().default("#0D9488"),
    icon: text("icon").notNull().default("📌"),
});

// Habits table for storing user-defined habits
export const habits = sqliteTable("habits", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userID: integer("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    categoryID: integer("category_id").notNull().references(() => categories.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    frequency: text("frequency").notNull(),     // e.g., daily, weekly, or monthly
    notes: text("notes").default(""),           // optional field for additional habit details
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

// Habit logs table for tracking recording habit completion on a given date.
export const habitLogs = sqliteTable("habit_logs", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    habitID: integer("habit_id").notNull().references(() => habits.id, {onDelete: "cascade"}),
    date: text('date').notNull(),                           // storing date as ISO string (e.g., "2024-06-01") for easy querying
    count: integer("count").notNull().default(1),           // for habits that can be completed multiple times a day (e.g., "Drink Water")
    completed: integer("completed").notNull().default(0),   // 0 for incomplete, 1 for completed (for binary habits)
    notes: text("notes").default(""),                       // optional field for additional log details
});

// targets table for storing weekly/monthly targets for habits
export const targets = sqliteTable("targets", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userID: integer("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    habitID: integer("habit_id").references(() => habits.id, {onDelete: "cascade"}),
    categoryID: integer("category_id").references(() => categories.id, {onDelete: "cascade"}),
    type: text("type").notNull().default('weekly'),                   // e.g., "weekly" or "monthly"
    goalValue: integer("goal_value").notNull().default(5),     // e.g., 5 (for "Drink Water" habit, goal is to drink 5 times a week)
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});
