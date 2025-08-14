CREATE TABLE "accounts" (
	"account_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"currency" text DEFAULT 'KRW' NOT NULL,
	"total_income" bigint DEFAULT 0 NOT NULL,
	"total_expense" bigint DEFAULT 0 NOT NULL,
	"total_savings" bigint DEFAULT 0 NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"goal_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "goals_goal_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"account_id" uuid,
	"name" text NOT NULL,
	"goal_amount" bigint NOT NULL,
	"current_amount" bigint DEFAULT 0 NOT NULL,
	"goal_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budget_expenses" (
	"budget_expense_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "budget_expenses_budget_expense_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"budget_id" bigint,
	"amount" bigint NOT NULL,
	"note" text NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budgets" (
	"budget_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "budgets_budget_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"account_id" uuid,
	"budget_amount" bigint NOT NULL,
	"current_amount" bigint DEFAULT 0 NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TYPE "public"."transaction_types" AS ENUM('income', 'expense');

--> statement-breakpoint
CREATE TABLE "transactions" (
	"transaction_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_transaction_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"account_id" uuid,
	"type" "transaction_types" NOT NULL,
	"amount" bigint NOT NULL,
	"note" text NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_created_by_profile_profile_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_account_id_accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_expenses" ADD CONSTRAINT "budget_expenses_budget_id_budgets_budget_id_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("budget_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_account_id_accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE cascade ON UPDATE no action;