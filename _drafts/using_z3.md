---
layout: post
categories:
- Research
tags: [planout, experiment, pl]
author:
  display_name: Emma Tosch
---

Like many (all?) static analysis tools, our PlanOut analyzer does not have to be complete, but it should always be sound. Therefore, we must ensure that we never return estimators that are incorrect.

Conditional random assignment presents a complication on this front -- in order to reason about conditionally assigned variants, we need to determine what values of variables in a particular guard lead us down a particular path. To solve this problem in the general case, we need an SMT solver.

Previously, I just punted whenever we saw an expression in a guard that evaluted down to a relation, constraining our analysis to only those scripts that used strict boolean expressions in their guards. This meant that programs with conditional random assignment that relied on external boolean variables (like gatekeeper checks) were okay, but those that relied on, for example, ranges of whitelisted or blacklisted versions or identifiers were not okay.

Whitelisting and blacklisting bring up an important issue that we face when we mechanize and formalize processes that have previously been performed entirely by humans: systems need concrete rules to follow and don't have human intuition. First off, we *want* to allow whitelisting and blacklisting: these are important *in vivo* QA features -- while an experiment is running, I may want to test the current version for me and ensure that the control is working for my coworker. My coworker and I technically shoudl not be included in the analysis of the experiment, since our variants were not randomly assigned. However, for a sufficiently large sample, the effect of our non-random assignment would have essentially no impact on the results. It's up to the analyst to decide whether these data make a difference. You may think, why not just exclude the data? It certainly couldn't hurt. However, doing so may be tricky, may require extra computing resources, or may simply lead to difficult-to-read code. When there is no formal reason to include or exclude these data, the analyst may choose the option that leads to the simplist extraction or data processing code. 

Unfortunately, the analyzer does not have any of the analyst's domain knowledge. 
