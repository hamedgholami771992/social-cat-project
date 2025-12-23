go to each front/backend dir and read the readme of each
to build the applications.

bussiness logic:

when campain is created 
campain.status=DRAFT

when first submission is created
campaign.status=active
submission.status=pending

when a submission is approved
campaign.status=active
submission.status=approved
ledger.record => hold

when a submission is rejected(approved => rejected)
campain.status=active
submission.status=rejected
ledger.record => release

when a submission is rejected(pending => rejected)
campain.status=active
submission.status=rejected

when a submission is paid(approved => paid)
campain.status=completed
submission.status=paid
ledger.record => release



## 1. How do you prevent duplicate approvals?
by enforcing that only one submission can reach PAID status
- a guard when paying a submission that checks:
  - the campaign is not already `COMPLETED`
  - no other submission for the campaign already has `status = PAID`
- making the campaign.status `COMPLETED` immediately after the first successful payment

## 2. Why did you choose this database structure?
I found this database structure from the bussiness logic and its needs for manipulation and fetching.
I tried to separate entities and recognize each important entity as a database table,
relations between database entities comes from the bussiness logic 




## 3. What would break first at 1,000 campaigns?
the first problems would be performance and data safety
some pages would become slow because the system may load campaigns and their related submissions one by one (N+1 queries). This can be fixed by using better queries(using joins and batch queries), pagination, 
and proper indexes(to make the database to find the records more faster).

another issue is concurrency. 
If two submissions are paid at the same time for the same campaign, it could cause a double payout. That is why a database constraint (only one PAID submission per campaign) is needed.


## 4. What did you intentionally NOT build, and why?
- I did not consider startDate and endDate for campaigns to be active, the campaign will be active by its first submission (for simplicity)
- I did not create a separate Admin panel to change the status of submissions (for simplicity)
- I did not create a separate User panel, which makes creator able to see their submissions and to see active campaigns (for simplicity)


## 5. Where would real payouts (e.g. Stripe) integrate later?
real payouts (like Stripe) would be added during the APPROVED → PAID submission status change.
at that moment, the system would call Stripe to send the money, and only after a successful payment, the submission would be marked as PAID.
