import {
  bigint,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { accounts } from "../goal/schema";

export const transactionTypes = pgEnum("transaction_types", [
  "income",
  "expense",
]);

export const transactions = pgTable("transactions", {
  transaction_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  account_id: uuid().references(() => accounts.account_id, {
    onDelete: "cascade",
  }),
  type: transactionTypes().notNull(),
  amount: bigint({ mode: "number" }).notNull(),
  note: text().notNull(),
  occurred_at: timestamp().notNull().defaultNow(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const budgets = pgTable("budgets", {
  budget_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  account_id: uuid().references(() => accounts.account_id, {
    onDelete: "cascade",
  }),
  budget_amount: bigint({ mode: "number" }).notNull(),
  current_amount: bigint({ mode: "number" }).notNull().default(0),
  name: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const budget_expenses = pgTable("budget_expenses", {
  budget_expense_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  budget_id: bigint({ mode: "number" }).references(() => budgets.budget_id),
  amount: bigint({ mode: "number" }).notNull(),
  note: text().notNull(),
  occurred_at: timestamp().notNull().defaultNow(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
