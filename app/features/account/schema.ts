import {
  pgTable,
  text,
  timestamp,
  uuid,
  bigint,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { profiles } from "../auth/schema";

export const accounts = pgTable("accounts", {
  account_id: uuid("account_id").primaryKey().defaultRandom(),
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

export const accountRoles = pgEnum("account_roles", ["owner", "member"]);

export const account_members = pgTable(
  "account_members",
  {
    account_id: uuid().references(() => accounts.account_id, {
      onDelete: "cascade",
    }),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    role: accountRoles().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.account_id, table.profile_id] })]
);
