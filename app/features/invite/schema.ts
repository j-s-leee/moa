import {
  pgTable,
  timestamp,
  uuid,
  text,
  pgEnum,
  integer,
  bigint,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { accounts } from "../account/schema";
import { profiles } from "../auth/schema";

export const invitationStatus = pgEnum("invitation_status", [
  "pending",
  "consumed",
  "expired",
]);

export const invitations = pgTable("invitations", {
  invitation_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity()
    .notNull(),
  account_id: uuid().references(() => accounts.account_id, {
    onDelete: "cascade",
  }),
  inviter_id: uuid().references(() => profiles.profile_id),
  token: text().unique().notNull(),
  status: invitationStatus().notNull().default("pending"),
  max_uses: integer().notNull().default(1),
  used_count: integer().notNull().default(0),
  created_at: timestamp().notNull().defaultNow(),
  expires_at: timestamp()
    .notNull()
    .default(sql`now() + interval '1 day'`),
});

export const invitation_accepts = pgTable("invitation_accepts", {
  invitation_accept_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  invitation_id: bigint({ mode: "number" }).references(
    () => invitations.invitation_id
  ),
  profile_id: uuid().references(() => profiles.profile_id),
  accepted_at: timestamp().notNull().defaultNow(),
});
