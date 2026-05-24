create extension if not exists pgcrypto;

create table if not exists profiles (id uuid primary key references auth.users(id), business_name text default 'Vyapara Ledger', default_currency text default 'INR', default_bc_term_weeks int default 10, default_apr numeric default 24, created_at timestamptz default now());

create table customers (id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), full_name text not null, phone_number text not null, address text, notes text, status text default 'ACTIVE', archived boolean default false, created_at timestamptz default now(), updated_at timestamptz default now());
create table accounts (id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), customer_id uuid references customers(id), account_type text not null check (account_type in ('BC_WEEKLY','MONTHLY_INTEREST')), status text default 'ACTIVE' check (status in ('ACTIVE','CLOSED','DEFAULTED')), principal_amount numeric, amount_given numeric, total_repayment_amount numeric, profit_amount numeric, apr numeric, term_weeks int, start_date date not null, due_day text, notes text, archived boolean default false, created_at timestamptz default now(), updated_at timestamptz default now());
create table installments (id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), account_id uuid references accounts(id), installment_number int, due_date date not null, due_amount numeric not null, paid_amount numeric default 0, status text default 'PENDING' check (status in ('PENDING','PAID','PARTIAL','OVERDUE','WAIVED')), paid_date date, notes text, created_at timestamptz default now(), updated_at timestamptz default now());
create table payments (id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), account_id uuid references accounts(id), installment_id uuid references installments(id), customer_id uuid references customers(id), amount numeric not null, payment_date date not null, payment_method text check (payment_method in ('CASH','UPI','PHONEPE','PAYTM','GPAY','BANK','OTHER')), reference_number text, confirmed_by text, notes text, created_at timestamptz default now());
create table reminders (id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), customer_id uuid references customers(id), account_id uuid references accounts(id), installment_id uuid references installments(id), reminder_type text, scheduled_date date, status text default 'PENDING', channel text default 'IN_APP', message text, created_at timestamptz default now(), updated_at timestamptz default now());
create table audit_logs (id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), entity_type text, entity_id uuid, action text, old_value jsonb, new_value jsonb, created_by text, created_at timestamptz default now());

alter table customers enable row level security; alter table accounts enable row level security; alter table installments enable row level security; alter table payments enable row level security; alter table reminders enable row level security; alter table audit_logs enable row level security;

create policy "owner access customers" on customers using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner access accounts" on accounts using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner access installments" on installments using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner access payments" on payments using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner access reminders" on reminders using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner access audit_logs" on audit_logs using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create or replace function generate_bc_installments(p_owner uuid, p_account uuid, p_total numeric, p_weeks int, p_first_due date)
returns void language plpgsql as $$
begin
  insert into installments(owner_id, account_id, installment_number, due_date, due_amount)
  select p_owner, p_account, gs, p_first_due + ((gs-1) * interval '7 day'), round((p_total/p_weeks)::numeric,2)
  from generate_series(1, p_weeks) gs;
end $$;
