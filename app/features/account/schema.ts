import {
  pgTable,
  text,
  timestamp,
  uuid,
  bigint,
  pgEnum,
  primaryKey,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { profiles } from "../auth/schema";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";
import { sql } from "drizzle-orm";

export const accounts = pgTable(
  "accounts",
  {
    account_id: uuid("account_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    currency: text("currency").notNull().default("KRW"),
    total_income: bigint({ mode: "number" }).notNull().default(0),
    total_expense: bigint({ mode: "number" }).notNull().default(0),
    total_savings: bigint({ mode: "number" }).notNull().default(0),
    total_budget: bigint({ mode: "number" }).notNull().default(0),
    created_by: uuid()
      .references(() => profiles.profile_id, { onDelete: "cascade" })
      .notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy(`account_insert`, {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.created_by}`,
    }),
    pgPolicy(`account_update`, {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.created_by}`,
    }),
    pgPolicy(`account_delete`, {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = created_by`,
    }),
    pgPolicy(`account_select`, {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
  ]
);

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
  (table) => [
    primaryKey({ columns: [table.account_id, table.profile_id] }),
    pgPolicy(`account_member_insert`, {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy(`account_member_delete`, {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} IN (SELECT created_by FROM accounts WHERE account_id = ${table.account_id})`,
    }),
    pgPolicy(`account_member_select`, {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
  ]
);

export const invitationStatus = pgEnum("invitation_status", [
  "pending",
  "consumed",
  "expired",
]);

export type InvitationStatus = (typeof invitationStatus.enumValues)[number];

export const invitations = pgTable(
  "invitations",
  {
    invitation_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    account_id: uuid().references(() => accounts.account_id, {
      onDelete: "cascade",
    }),
    inviter_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    email: text().notNull(),
    token: text().notNull().unique(),
    status: invitationStatus().notNull().default("pending"),
    expires_at: timestamp()
      .notNull()
      .default(sql`now() + interval '7 day'`),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy(`invitations_select`, {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
    pgPolicy(`invitations_insert`, {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.inviter_id}`,
    }),
    pgPolicy(`invitations_delete`, {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.inviter_id}`,
    }),
    pgPolicy(`invitations_update`, {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
  ]
);
