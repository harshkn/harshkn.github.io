---
layout: post
title: Valid vs. Invalid Experiments
comments: true
author:
  display_name: Emma Tosch
---
The central component of experiment is the notion of comparing a treatment with a control. In order to do this comparison in a principled way, we need to ensure that the assignment procedure is correct -- that we are not assigning subjects to a treatment or a control in a way that correlates with the outcome. What this usually means is that we want to assign subjects randomly to one group or the other.

This is the most basic

“one of the most basic examples - invalid / no valid estimator - gating check, branching on gating check to do assignments"


    is_android <- gateKeeper(...);

    if (!is_android) {
      foo <- true;
    } else {
      foo <- bernoulliTrial(p=0.5, unit=userid);
    }


foo = 1 vs. foo = 0 is actually only experimental contrast you could have
not valid because foo = true depends on an external operator
(not randomly assigned)
“this is actually a common mistake"
see what proportion of planout experiments are not valid
[here: not valid because foo = true depends on a non-random external operator]
Eytan: “it’s extremely common” / “invalid” — launched experiments
"using planout to deploy parameters and not to randomly assign"
if in the android experiment, they decide foo should be true, it’s not a valid experiment
“putting launched values"

Look at what proportion of planout scripts are not valid experiments
emery’s concern: people may ask: how many of these invalid experiments don’t matter
Emma’s concern: if people are using this for setting variables, does it matter? Doesn’t provenance affect what matters?


problems with putting launched values:
(1) unnecessary logging
(2) poor performance
(3) code cruft
(4) makes it difficult to analyze experimental results because start/end date are not explicit, especially when analyses are automated

if static analysis is integrated w/ data analysis stack, we'd avoid any issues with not analyzing the experiment correctly
time ranges for which you have a valid experiment
“poor metadata makes it difficult to retroactively analyze"
want results to be durable beyond single launch decision

​[11:22]
use static analysis to identify dead code - here?

​[11:23]
“formal aspects of experiment” - are we logging data when there is no valid estimator for a contrast

​[11:24]
- enumeration of use cases — this data cannot be analyzed, or we know we should stop analyzing after this point, or this is code cruft

​[11:24]
only need formal model to determine what’s a valid estimator for the experiment

​[11:25]
other stuff - logical consequences of not having a valid estimator

​[11:25]
we would need to expand the formal model if we wanted to analyze changes to the experiment over time (that are not “breaking changes” - e.g., there are no longer any valid experimental contrasts)

​[11:26]
would become too complicated for scope of this paper — thing like “people in country A get this treatment” and now we want a random assignment for people in country A

​[11:26]
then we could do experimental analysis on subgroups

​[11:31]
great use case - democratic debate

​[11:31]
might not be able to use some

​[11:31]
“in general, FB is not clowny” - but people do incorrect things


costs: “financial costs” - lost ad revenue; “crappy user experiences” * number of users; “time” - wasted data analysis and engineering time — this is main cost.
:eyes:1


​[11:33]
mostly concerned about productivity; excessive logging (lots of terabytes!)

​[11:33]
- enumerate all reasons why people care about this, esp. in terms of costs to the organizations

things with external operators that are correlated with the outcomes
gating functionality (no secret)

reasoning about random operators/external experiments -- reasoning about random vs. nonrandom is sufficient

emma -- look up sql for grabbing planout scripts

emery --
Motivating -- why is this hard, what

is no valid estimator -- gating check
-- something that branches on a gating check and then
