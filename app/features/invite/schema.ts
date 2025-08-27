import {
  pgTable,
  timestamp,
  uuid,
  text,
  pgEnum,
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
  inviter_id: uuid().references(() => profiles.profile_id, {
    onDelete: "cascade",
  }),
  email: text().notNull(),
  token: text().unique().notNull(),
  status: invitationStatus().notNull().default("pending"),
  created_at: timestamp().notNull().defaultNow(),
  expires_at: timestamp()
    .notNull()
    .default(sql`now() + interval '7 day'`),
});
