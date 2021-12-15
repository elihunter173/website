+++
title = "Spreadsheets"
+++

# Fundamental Good
* Extremely widely used and generally fairly approachable
  * "Meet them where they are"
* See results and changes in real time.
* High quality autocomplete.
* The only good implementation of a "non-text" programming language I've ever
  seen.
* Cells are independent statements. Editing one does not change the validity of
  others, unlike with code where editing one line can mess up understanding
  future lines. That can be mitigated by error recovery mechanisms.

# Fundamental Bad
* Re-using existing text-based tools is more difficult.

# Current Bad
* Defining variables is a little annoying.
* No structured data can make representing certain objects more difficult.
* Dynamic typing can cause various errors.
* Testing is difficult.
* Spreadsheets are difficult to "export" into programs or other apps

# My Ideal Spreadsheet
* Easier to define variables.
* Structured data which can either be in one cell or spread across multiple.
* Type system to catch errors.
* Some way to test? Still not sure how.
* User defined functions that can be made from composed cells.
* Spreadsheets stored in text based format so that text-based tools (e.g. git)
  can work and it can be edited by hand in a pinch.
* Some way to "compile" the spreadsheet so it can be used in an app or
  something. Probably compiling with WASM?
* "Native" plugins that allow web requests and various other things.
