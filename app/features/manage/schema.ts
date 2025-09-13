import {
  bigint,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { accounts } from "../account/schema";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";
import { sql } from "drizzle-orm";

export const transactionTypes = pgEnum("transaction_types", [
  "income",
  "expense",
]);

export type TransactionType = (typeof transactionTypes.enumValues)[number];

export const transactions = pgTable(
  "transactions",
  {
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
  },
  (table) => [
    pgPolicy(`transactions_full_access`, {
      for: "all",
      to: authenticatedRole,
      as: "permissive",
      using: sql`account_id IN (SELECT am.account_id FROM (account_members am JOIN profiles p ON am.profile_id = p.profile_id) WHERE p.profile_id = ${authUid})`,
    }),
  ]
);

export const budgets = pgTable(
  "budgets",
  {
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
  },
  (table) => [
    pgPolicy(`budgets_full_access`, {
      for: "all",
      to: authenticatedRole,
      as: "permissive",
      using: sql`account_id IN (SELECT am.account_id FROM (account_members am JOIN profiles p ON am.profile_id = p.profile_id) WHERE p.profile_id = ${authUid})`,
    }),
  ]
);

export const budget_expenses = pgTable(
  "budget_expenses",
  {
    budget_expense_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    budget_id: bigint({ mode: "number" }).references(() => budgets.budget_id, {
      onDelete: "cascade",
    }),
    amount: bigint({ mode: "number" }).notNull(),
    note: text().notNull(),
    occurred_at: timestamp().notNull().defaultNow(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy(`budget_expenses_full_access`, {
      for: "all",
      to: authenticatedRole,
      as: "permissive",
      using: sql`budget_id IN (
        SELECT b.budget_id 
        FROM budgets b 
        JOIN account_members am ON b.account_id = am.account_id 
        JOIN profiles p ON am.profile_id = p.profile_id 
        WHERE p.profile_id = ${authUid}
      )`,
    }),
  ]
);
