+++
title = "Building an LSM-backed Database"
date = 2024-07-14
+++

I've been working professionally on a database for 3 years now and I still feel
like I don't really understand how it all works. So I've decided I'm going to
try implementing one myself.

NOTES:
- I think I need to implement DataSource, not ExecutionPlan. It looks like execution plan is all about doing joins and stuff like that.
