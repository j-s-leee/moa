import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "../account/schema";

export const goals = pgTable("goals", {
  goal_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  account_id: uuid().references(() => accounts.account_id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  goal_amount: bigint({ mode: "number" }).notNull(),
  current_amount: bigint({ mode: "number" }).notNull().default(0),
  monthly_savings: bigint({ mode: "number" }).notNull().default(0),
  goal_date: timestamp(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
