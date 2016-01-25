---
layout: post
title: Why PlanOut?
comments: true
author:
  display_name: Emma Tosch
---
When previously discussing [online experiments]({{ base.url }}/online_experiments.html), we talked about randomization errors. In that model, assignment to treatment or control is done by the system that selects user ids. We can think about these assignments as a series of tables. If we want to repeat an experiment, we have re-generate the tables, so we don't end up experimenting on the same exact group every time. It is much more efficient and compact to have a procedure for generating assignments. A procedure also allows us to document the process we used for assignment, and even implies the kind of analyses we intend to do. It can be used for provenance, verification, and program synthesis.

<!-- summary -->

[PlanOut](http://facebook.github.io/planout/) is a domain-specific language with an interpreter specification that provides the compact representation we desire. It has some nice features that facilitate interoperability with the experimental system.

# External Operators
External operators are important. We would love for our expressions to be closed, but the reality is that no one will use the system if they need to specify, annotate, declare, etc. their external operators, since there could be a lot of them, and they may change rapidly.

So what are external operators in this context, and what are they used for? Among other things, external operators are used to manage gating functionality, or the ability of a particular user to see a particular version of the experiment. Facebook has numerous experimental frameworks and uses gating extensively. I might create what we call a "gatekeeper check" to ensure, for example, that my experiment is only run on Americans, or women, or American women.

External operators may also be used to access external experimentation systems. Facebook has multiple such systems, as do Google and other large companies, who all run many many experiments every day. One of the winning features of PlanOut is that it can be used with existing specialized systems, which helps with internal adoption. For example, suppose there is an existing experimentation system that returns a number in response to the query `MyExpVersion(<id>)`. This call will get a hash of a particular experiment implemented in another system. This other system selects participants and sets parameters in a way that (a) does not clash with the parameters of the PlanOut script, and (b) does not alter the randomization of other random assignments within the PlanOut script. 

# Logging
We brought up in the previous post that logging is a major issue for online experiments. The parameters listed in the PlanOut script will be logged, unless the script contains a `return false` statement. Returning from the script short-circuits the experiment, but the boolean value toggles whether we continue logging.

Obviously logging helps us with provenance. We could employ a policy that logs everything. Experimenters would consult the experiment script or table and construct a query to filter the appropriate values. However, logging everything causes several major issues:

1. **Cost.** Logging everything has sizable real-world costs. The benefit of being able to run Internet-scale experiments is the massive sample size an experimenter can acquire with very little turnaround time. The benefit of this sample size is high precision on estimates of population parameters. The cost is the large quantity of data that needs to be transmitted and stored.

2. **Uncertain Experimental Status.** When the logging is decoupled from the experimentation script, the status of the experiment may be unclear. In fact, it may be difficult to tell *what* parameters are part of an experiment: another researcher may not be able to tell the difference between values that are part of an experiment and those that are being deployed.

3. **Potential Failures May be Hidden in Plain Sight.** Failures in exposures happen. The experimentation system is a series of independently operating pieces of software, and data corruption, machine failure, or human error at any point in the pipeline can lead to undetectable failures later on in the experimentation-analysis pipeline. Real world examples include:

    * Improperly configured/programmed sampling and/or assignment procedures[^1]
    * Dropped data connections on mobile phones when conducting experiments on mobile platforms.
	* Analysis scripts that do not account for changes in experiment specification.


One solution to the second issues is to log some metadata to know what parameters are participating in a particular experiment. Of course, if there are failure of the types described in the third issue, that may not help. Furthermore, logging extra metadata adds to our data storage overhead described as the first issue.

Instead, if we have a script that can toggle what to log and when, we can store only the values we need, for the time that we need them. So long as an experimentation script is live, we will know what values to expect. PlanOut gives us this.

[^1]: In case you thought this was a contrived example, there are *definitely* cases of randomization and assignment being improperly programmed or configured. This isn't the sort of thing that gets widely advertised, but think about it this way: [V8 only recently got its random number generator right](http://thenextweb.com/google/2015/12/17/google-chromes-javascript-engine-finally-returns-actual-random-numbers/), and having a [at least a] PRNG is pretty much step zero in running an experiment.




<!--  LocalWords:  PlanOut Tosch metadata PRNG
 -->
