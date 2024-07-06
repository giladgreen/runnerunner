TODO:

- remove balance from user and always join on history table
- add UT
- 
- try to work with a local DB







(select P.phone_number as phone, P.name as name, P.balance as balance, H.sum from players as P join
(select phone_number, sum(change) as sum from history group by phone_number) as H
on P.phone_number = H.phone_number WHERE P.balance != H.sum
)
