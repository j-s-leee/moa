import {
  bigint,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { accounts } from "../account/schema";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";
import { sql } from "drizzle-orm";

export const goals = pgTable(
  "goals",
  {
    goal_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
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
  },
  (table) => [
    pgPolicy(`goal_full_access`, {
      for: "all",
      to: authenticatedRole,
      as: "permissive",
      using: sql`account_id IN (SELECT am.account_id FROM (account_members am JOIN profiles p ON am.profile_id = p.profile_id) WHERE p.profile_id = ${authUid})`,
    }),
  ]
);
