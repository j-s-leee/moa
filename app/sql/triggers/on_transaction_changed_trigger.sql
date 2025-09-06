create or replace function public.handle_transaction_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.type = 'income' then
      update public.accounts set total_income = total_income + new.amount where account_id = new.account_id;
    elsif new.type = 'expense' then
      update public.accounts set total_expense = total_expense + new.amount where account_id = new.account_id;
    end if;

  elsif tg_op = 'DELETE' then
    if old.type = 'income' then
      update public.accounts set total_income = total_income - old.amount where account_id = old.account_id;
    elsif old.type = 'expense' then
      update public.accounts set total_expense = total_expense - old.amount where account_id = old.account_id;
    end if;
  end if;
  return new;
end;
$$;

create trigger on_transaction_changed
after insert or delete on public.transactions
for each row
execute procedure public.handle_transaction_changed();