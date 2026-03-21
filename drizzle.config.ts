import type { Config } from 'drizzle-kit';

// drizzle kit config file for SQLite database schema
// points to the schema file and output directory for migrations
export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './habit_tracker.db',
  },
} satisfies Config;
