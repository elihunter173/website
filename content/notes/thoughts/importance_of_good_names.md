+++
title = "Importance of Good Names"
+++

More than comments, good names help explain code.

# `dirbuf.nvim` Lessons

For example, in `dirbuf.nvim` when writing the new synchronization algorithm, I
referred to things as "old" `$THING` and "new" `$THING`. However, when the
algorithm was running "old" was still the current state, so I found myself
getting mixed up when I was taking action on "old" stuff. I renamed it to
"current" `$THING` and "new" `$THING` in the planning algorithm and then in
execution I named it "source" `$THING` and "destination" `$THING`.
