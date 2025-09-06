CREATE OR REPLACE VIEW account_budget_list_view
with (security_invoker=on)
AS
SELECT
    accounts.account_id,
    accounts.name,
    accounts.currency,
    accounts.total_income,
    accounts.total_expense,
    accounts.total_savings,
    sum(budgets.current_amount) as current_budget,
    sum(budgets.budget_amount) as budget_amount
FROM accounts
LEFT JOIN budgets USING (account_id)
GROUP BY accounts.account_id;