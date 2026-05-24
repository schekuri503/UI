-- Replace owner UUID after creating first user
insert into customers(owner_id, full_name, phone_number, address, notes)
values ('00000000-0000-0000-0000-000000000000', 'Ravi Kumar', '9876543210', 'Vijayawada', 'Pays every Tuesday');
