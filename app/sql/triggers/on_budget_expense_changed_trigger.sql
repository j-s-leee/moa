create or replace function public.handle_budget_expense_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.budgets set current_amount = current_amount + new.amount where budget_id = new.budget_id;
  elsif tg_op = 'DELETE' then
    update public.budgets set current_amount = current_amount - old.amount where budget_id = old.budget_id;
  end if;
  return new;
end;
$$;

create trigger on_budget_expense_changed
after insert or delete on public.budget_expenses
for each row
execute procedure public.handle_budget_expense_changed();