---
layout: post
title: Online Experiments
permalink: online_experiments.html
author:
  display_name: Emma Tosch
---

Wherein we discuss field experiments, controlled experiments, and online experiments. Includes a discussion of infrastructure for online experiments.

<!-- summary -->

I've had a few previous posts on experiments: when we first started the SurveyMan work, I wrote about [observational studies vs. surveys vs. quasi-experiments vs. experiments]({{ base.url }}/obs_survey_quasi_ex.html) and [mused about the differences between experiments and surveys]({{ base.url }}/experiments_vs_surveys.html) (insofar as SurveyMan is concerned). Those prior posts informally discussed qualitative aspects of experiments. They talked about exploratory vs. confirmatory data analysis, testing hypotheses, and the degree of control of confounders that the researcher has.

Although these informal aspects of experimentation are interesting and give insight when contrasted with other methods for gathering data, they do not formally define an experiment. An experiment is an assignment procedure that has three important properties:

1. The assignment procedure itself is not correlated with the outcome.
2. We have sufficient information in our model of the world to estimate the causal effect.
3. There is no interaction between units that may affect the outcome. 

There are many "tests" we might colloquially refer to as experiments that violate these assumptions. Suppose I am a polical canvasser who thinks she has found a better way to pitch her candidate to the residents of a neighborhood. I test my theory by working my way down the list of houses to vist and alternating between the provided script and the improvised one. It might be the case that alternating corresponds to asking one side of the street one version and the other other side the other version. The properties on one side of the street may be more desirable, and thus more expensive, attracting more affluent residents. The phrasing of my improvised pitch may be recieved differently by members of different social classes. The results I observe are simply invalid.

Now suppose that instead I flip a coin at each house to determine which variant to ask. Things start to look better. Even if the coin is biased, so long as we get *some* samples in each category, we should be fine. Of course, we have other potential issues that threaten stipulations (2) and (3): for example, after speaking with me, that resident coud call their neighbor to give them a heads up about me. Or, we could be measuring features that have nothing to do with the quantity of interest (for example, we could be canvassing in a neighborhood that caters to green card holders. Oops!)

# Field experiments vs. Controlled experiments
The above is an example of [an attempt at] a field experiment in social science. We contrast field experiments with controlled experiments, which typically occur in a laboratory. Laboratory experiments typically give experimentors a high degree of control over the environment. This is desirable in many circumstances, but presents generalization issues for social science experiments. Participants know they are taking part in an experiment, which may affect their behavior. Furthermore, the highly controlled environment of a laboratory isolates the participants from the actual circumstances under which they would exhibit the behavior under study. 

Operationally, an experiment is *an assignment of conditions to units*. This assignment procedure is very important. In field experiments, we may not have control over the sources of randomness.

## What are online experiments?
Online ecosystems give a high degree of control over the environment. Although in some ways, researchers have less control (I was looking for a citation on this, since I know it's been an issue for AMT research. I was going to put the AMT citations here, but then I found this intersesting [book](https://books.google.com/books?hl=en&lr=&id=sw4NHyThFFkC&oi=fnd&pg=PP2&dq=web+experiments&ots=KZlzLlVj94&sig=vpScCcWJmj9ytRwqhlhL68Iompw#v=onepage&q=web%20experiments&f=false), which I've now requested from the library). In any case, although it might seem obvious that researchers have less control over the environment, since they are not physically present and cannot prevent subjects from, say, answering their phones, responding to email, or otherwise engaging in other activities, we also know that immersive virtual environments are shockingly good maintaining user attention. When I was at [ICT](http://ict.usc.edu/), I saw a lot of work done on these immersive technologies. We also know that people experience their lives on the internet with the same intensity as interpersonal interactions (I would like a citation for this, but I'm not sure how to search for it. In particular, I am thinking about all the news stories about online bullying and how threats experienced only online are still threats -- the first time I remember seeing this discussed was when a teenaged girl killed herself in response to a peer's mother bullying her online. The mother ended up being convicted of something...I don't remember what...but it was shocking to many people because it was the first time the internet was highlighted as a legitimate space for interpersonal interactions, in need of regulation).

In any case, online experiments qualitatively lie in between field experiments and controlled experiments. They tend to have a higher degree of control than field experiments, but have less probe effect than controlled experiments. In the online context, the subjects of experiments are assigned "conditions," which are typically sets of parameters. Note that although we may be interested in studying people, there is no guarantee that we are assigning units to a single person. Since the entire assignment process is performed in software, the software has no knowledge of what entity is interacting with the system. Typically we are forced to use proxies -- e.g., account ids instead of poeple -- and hope that they map correctly. So, for example, we would like for Facebook users and Facebook accounts to have a 1:1 mapping. This is clearly not the case, since many people maintain separate professional and personal accounts, but generally it is not the case that multiple people use the same account (we hope). We assume that individuals who share accounts comprise a very small proportion of the total Facebook population and are equally represented in subgroups (i.e., there is no bias).

## Risks/Problems with online experiments
Online experiments sound like a great alternative to either field experiments or controlled experimets -- they increase generalization by reducing probe effect and situating experiments in "real" contexts. They offer a high degree of control over the virtual environment. When designed with experimentation in mind, online ecosystems allow rapid deployment of experiments. However, principled design is crucial. Many things can go wrong when designing and deploying experiments.

# Randomization errors
Suppose we have designed our online ecosystem in a very modular way (note that although this should be the standard way of doing things, this is actually our best-case scenario). This modular design allows us to set parameters that the user will see. There exists some dictionary that maps parameter names to parameter values and the rendering engine uses this dictionary to show users the appropriate conditions. For stable features, these conditions will be static. For parameters we wish to play around with, we will need to select some group of users for experimentation.

Now suppose we have an engine for playing users into treatment groups. There is a [series](http://www.exp-platform.com/Documents/puzzlingOutcomesInControlledExperiments.pdf) [of](http://www.exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf) [papers](http://www.exp-platform.com/Documents/2014%20experimentersRulesOfThumb.pdf) that appeared at KDD over the course of a few years, that described heuristics, observations, and tenants for online experiments. [Past work on designing experimentation systems](http://static.googleusercontent.com/media/research.google.com/en//pubs/archive/36500.pdf) has addressed how to allocate users to experiments. Now suppose we have two flags on users: (1) whether they are qualified to be in an experiment and (2) whether they are actually selected to be in an experiment. (2) *should be* a subset of (1), if we have implemented our experimentation infrastructure correctly. If we are simply running an A/B test, we show users in (2) the experimental conditions and log all users in (1).

A major problem with this approach is that (a) all assignments are decided _a priori_, which may be inefficient or buggy. Interventions such as stopping the experiment early, or modifying the experiment are difficult. Furthermore, audits are required to ensure that the system is running correctly, and this can be costly. 

We also have the potential for mistakenly believing that an assignment is an experiment when in fact it is not. If the random selection disappears into the ether, we have no way of knowing whether an assignment of users to a conditions is an experiment, or the result of an experiment. We would need to dig through past logs of requests for experimental and control groups, and infer the status of saved assignments. 


# Logging errors
Logging is a property of the system that exists downstream from assignment. Sometimes there are technical problems with logging: when running mobile experiments, connectivity issues may have an impact on sending data back. Apps, browers, and hardware all crash, and if this happens in a way that is not uniform over the covariates in the experiment, we may end up inferring erroneous results.

Logging can also be used to remove participants from the experiment and consequently analysis. A mechanism for aborting logging can be important for validating experiments _in vivo_, but a poorly implemented (or absent) logging system makes this impossible.

Since experimentation systems are typically a series of silohed software components that may have bugs and/or fail with a known probability, if we don't have a sane logging system, we end up with a blind spot in the experimentation pipeline, and have no way of validating the experiment. We have no ability to test the experimentation system in the absence of a logging system.

It isn't just failed logging that can cause issues -- unnecessary logging can cause problems. Unncessarily logging may inject data that doesn't belong into a data set. Even when it's removable in post-processing, this unncessary data set can be very large (on the order of terabytes) and cost the researcher/company large sums of money in storage and bandwidth.

# Erroneously using experimentation systems as configuration systems.
[Eytan]() has enumerated the major issues with people using experimentation systems to set/store launched values:

1. unnecessary logging
2. poor performance
3. code cruft
4. makes it difficult to analyze experimental results because start/end date are not explicit, especially when analyses are automated

Although the above may not seem as serious as, say, correctness issues, they actually incur a huge cost for the company. Not only are there the obvious issues with data storage and compute time, but since experimentation systems must carefully manage the allocation of users to experiments, there is the potential of effectively blocking users who have been allocated to a dead experiment from being reallocated to a new experiment.

# General costs when experiments are buggy

In general, errors in experiments have a cascading effect. There are financial costs, associated with ad revenue (a necessary consideration, since for many online ecosystems, this is their primary source of funding). There are human-costs, such as poor user experiences. There is also the cost of time -- time wasted by analysts and engineers on data and experimental setups that that are flaws.

