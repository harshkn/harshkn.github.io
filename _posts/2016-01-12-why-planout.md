---
layout: post
title: Why PlanOut?
author:
- display_name: Emma Tosch
---
When previously discussing [online experiments]({{ base.url }}/online_experiments.html), we talked about randomization errors. In that model, assgnment to treatment or control is done by the system that selects user ids. We can think about these assignments as a series of tables. If we want to repeat an experiment, we have re-generate the tables, so we don't end up experimenting on the same exact group every time. It is much more efficient and compact to have a procedure for generating assignments. A procedure also allows us to document the process we used for assignment, and even implies the kind of analyses we intend to do. It can be used for provenance, verification, and program systhesis.

[PlanOut]() is a domain-specific language with an interpreter specification that provides the compact representation we desire. It has some nice features that facilitate interoperability with the experimental system.

# External Operators
External operators are important. In PL we like our expressions to be closed, but the reality is that no one will use the system if they need to specify, annotate, declare, etc. their external operators, since there could be a lot of them, and they may change rapidly.

So what are external operators in this context, and what are they used for? Among other things, external operators are used to manage gating functionality, or the ability of a particular user to see a particular verison of the experiment. Facebook has numerous experimental frameworks and uses gating extensively. I might create what we call a "gatekeeper check" to ensure, for example, that my experiment is only run on Americans, or women, or American women.

External operators may also be used to access external experimentation systems. Facebook has multiple such systems, as do Google and other large companies, who all run many many experiments every day. One of the winning features of PlanOut is that it can be used with existing specialized systems, which helps with internal adoption. For example, suppose there is an existing experimentation system that returns a number in response to the query `MyExpVersion(<id>)`. This call will get a hash of a particular experiment implemented in another system. This other system selects participants and sets parameters in a way that (a) does not clash with the parameters of the PlanOut script, and (b) does not alter the randomization of other random assignments within the PlanOut script. 

# Loggging
We brought up in the previous post that logging is a major issue for online experiments. The parameters listed in the PlanOut script will be logged, unless the script contains a `return false` statement. Returning from the script short-circuits the experiment, but 

​[11:11]
“why is this hard? what does planout give you?"

​[11:12]
good to have a strong motivating example to use throughout the paper

​[11:13]
“one of the most basic examples - invalid / no valid estimator - gating check, branching on gating check to do assignments"

​[11:14]
is_android <- gateKeeper(...);

if (!is_android) {
foo <- true;
} else {
foo <- bernoulliTrial(p=0.5, unit=userid);
}

​[11:14]
not correct

​[11:15]
foo = 1 vs. foo = 0 is actually only experimental contrast you could have

​[11:15]
not valid because foo = true depends on an external operator

​[11:15]
(not randomly assigned)

​[11:15]
“this is actually a common mistake"

​[11:16]
see what proportion of planout experiments are not valid

​[11:16]
[here: not valid because foo = true depends on a non-random external operator]

​[11:17]
Eytan: “it’s extremely common” / “invalid” — launched experiments

​[11:17]
"using planout to deploy parameters and not to randomly assign"

​[11:17]
if in the android experiment, they decide foo should be true, it’s not a valid experiment

​[11:18]
“putting launched values"

​[11:19]
problems with putting launched values:
(1) unnecessary logging
(2) poor performance
(3) code cruft
(4) makes it difficult to analyze experimental results because start/end date are not explicit, especially when analyses are automated

​[11:19]
if static analysis is integrated w/ data analysis stack, we'd avoid any issues with not analyzing the experiment correctly

​[11:19]
is_android <- gateKeeper(...);

if (!is_android) {
foo <- true;
} else {
foo <- bernoulliTrial(p=0.5, unit=userid);
}
foo=1 vs foo=0
not valid because foo = true depends on a non-random external operator
foo = true;
problems with putting launched values:
(1) unnecessary logging
(2) poor performance
(3) code cruft
(4) makes it difficult to analyze experimental results because start/end date are not explicit, especially when analyses are automated
if static analysis is integrated w/ data analysis stack, we'd avoid any issues with not analyzing the experiment correctly
time ranges for which you have a valid experiment

​[11:21]
“poor metadata makes it difficult"

​[11:21]
“to retroactively analyze"

​[11:21]
want results to be durable beyond single launch decision

​[11:22]
use static analysis to identify dead code - here?

​[11:22]
logging overhead (logging exposures)

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

​[11:32]
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

Eytan’s example of incorrect experiment:

is_android <- gateKeeper(...);
if (!is_android) {
foo <- true;
} else {
foo <- bernoulliTrial(p=0.5, unit=userid);
}
Eytan says: only contrast you could have is

foo=1 vs foo=0

but that’s not valid because foo=true depends on an external operator

Look at what proportion of planout scripts are not valid experiments
emery’s concern: people may ask: how many of these invalid experiments don’t matter
Emma’s concern: if people are using this for setting variables, does it matter? Doesn’t provenance affect what matters?

Eytan’s answer:
problems with putting launched values:
(1) unnecessary logging
(2) poor performance
(3) code cruft
(4) makes it difficult to analyze experimental results because start/end date are not explicit, especially when analyses are automated

if static analysis is integrated w/ data analysis stack, we'd avoid any issues with not analyzing the experiment correctly
time ranges for which you have a valid experiment
when not an experiment,

only need a formal model for arguments for valid estimators
issues of logging data, etc., don’t need a formal model -- decisions fall out as a consequence
need a formal model in order to analyze the experiment over time

Useful for Emery:
Actual PlanOut scripts

For Emma To Do:
Finish feature completeness

Indexing, array/map
OCaml ATE estimator


To Dos -- send to emery and Eytan by the end of today

Cost function?
financial (ads revenue lost)
crappy user experiences
time costs -- wasted data analysis and engineering
unnecessary logging has data costs

Emma to do:
get dev machine
