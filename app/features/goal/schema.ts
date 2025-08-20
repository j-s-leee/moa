import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../auth/schema";

export const accounts = pgTable("accounts", {
  account_id: uuid().primaryKey(),
  name: text("name").notNull(),
  currency: text("currency").notNull().default("KRW"),
  total_income: bigint({ mode: "number" }).notNull().default(0),
  total_expense: bigint({ mode: "number" }).notNull().default(0),
  total_savings: bigint({ mode: "number" }).notNull().default(0),
  created_by: uuid()
    .references(() => profiles.profile_id, { onDelete: "cascade" })
    .notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const goals = pgTable("goals", {
  goal_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  account_id: uuid().references(() => accounts.account_id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  goal_amount: bigint({ mode: "number" }).notNull(),
  current_amount: bigint({ mode: "number" }).notNull().default(0),
  goal_date: timestamp(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
