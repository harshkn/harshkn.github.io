---
layout: post
title: What is an Experiment?
published: false
status: draft
autor:
  display_name: Emma Tosch
---

What is an experiment? What do we mean when we say we are performing one? My first thought when asked to define an experiment is to think about it in the context of the scientific method. If you search for the scientific method under Google Images or Bing Images, you'll find some variant of this image:

<!--summary-->

[!Scientific Method](assets/scientific_method.png)

I like the whole "colors of the rainbow" thing about it. I made this one myself so I could move the pieces around in talks.

In any case, in this framework, an experiment is a repeatable procedure designed to test a hypothesis. It appears as one of the middle steps in the scientific method and is generally defined in terms of the other steps: a procedure is not an experiment if it (at least implicitly) does not test a hypothesis. [Many people](http://andrewgelman.com/2014/01/23/discussion-preregistration-research-studies/) are starting to argue that you must have a hypothesis and some pre-defined analyses in mind before conducting an experiment (or at least before analyzing the data in a so-called "natural experiment"). Without hypotheses and analyses, an experiment is just a procedure. Drawing on the scientific method, falsifiability, and statistical analyses, we can come up with a definition that capture both the intrisic properties of an experiment and its relation to the scientific method.

> An experiment is a reproducible procedure that assigns units to conditions and is designed to test a hypothesis. A particular experiment implies a statistically identifiable analysis to evaluate the hypothesis it was designed for.

While I'm sure that someone somewhere has defined an experiment similarly, I haven't yet found a better single definition that actually captures the ideas I want to address. This definition is an amalgamation of some others, but I think it's roughly along the lines of what people think of when they think of experiments. The main takeaway is that this definition is fairly operational. I wanted a definition that would allow us to define a function that can take a procedure, a hypothesis, and an analysis and answer whether this 3-tuple was in the relation `is-experiment`.

One of the things I've found interesting in literature is that there's not a ton of time spent defining what an experiment is. The [OED](http://oed.com) lists [6 main definitions](http://www.oed.com/view/Entry/66530?rskey=yKvAYM&result=1&isAdvanced=false#eid). Two are most relelvant:

> 3. An action or operation undertaken in order to discover something unknown, to test a hypothesis, or establish or illustrate some known truth.
>
> a. in science.
> 1362   Langland Piers Plowman A. xi. 157   Experimentis of Alconomye Of Alberdes makynge, Nigromancye and perimancie.
> c1400   Lanfranc's Cirurg. (MS. A.) 7   Confermynge my wordis..wiþ experiment þat I have longe tyme used.
> 1471   G. Ripley Compound of Alchymy in E. Ashmole Theatrum Chem. Britannicum (1652) 189   Many Experyments I have had in hond.
> 1594   Plat (title) ,   Diverse new and conceited Experiments from which there may be sundrie both pleasing and profitable uses drawne.
> 1690   J. Locke Ess. Humane Understanding iv. xii. 326   A Man accustomed to rational and regular Experiments, shall be able [etc.].
> 1717   J. Keill Ess. Animal Oecon. (ed. 2) 82   An Observation or Experiment carefully made..leads us with greater Certainty to the Solution.
> 1846   W. R. Grove On Correlation Physical Forces 25   If the experiment be performed in a close vessel..the substance forming the electrodes is condensed.

> 4. 
> a. The process or practice of conducting such operations; experimentation.
> 1678   R. Russel tr. Jabir ibn Haiyan Wks. Geber iii. ii. i. viii. 161   This is proved by Experiment.
> 1741   I. Watts Improvem. Mind i. ii. 31   This Sort of Observation is call'd Experiment.
> 1794   J. Hutton Diss. Philos. Light 117   Experiment is the wise design of a scientific mind, inquiring after the order of events.
> 1830   J. F. W. Herschel Prelim. Disc. Study Nat. Philos. 76   By putting in action causes and agents over which we have control, and purposely varying their combinations, and noticing what effect takes place; this is experiment.
> a1862   H. T. Buckle Hist. Civilisation Eng. (1869) III. v. 462   Experiment..is merely experience artificially modified.

Prior to the early modern period, *experiment* had a bit different meaning. However, the OED supports the idea that experiments exist to test hypotheses, at least from the fourteenth century onward. I had assumed that Fisher or Popper had defined what it means to be an experiment, but without more dedicated scouring of primary texts, I can't say for sure. In general, it surprises me that the OED doesn't cite any of the greats of the philosophy of science. It's my understanding that they try to look for the earliest known citations for using a word according to each meaning. It just surprises me that someone like Popper hadn't written a crisp definition of what we mean by "experiment."


I then looked at what some more modern methodologists had to say about experiments. Gerber and Green begin [their book](https://www.amazon.co.uk/Field-Experiments-Design-Analysis-Interpretation/dp/0393979954) on field experiments with the motivation of answering causal questions. They then talk about how you could try doing data analysis on exisiting data, but that you're pretty much limited to analyzing correlations. They discuss natural experiments and quasi-experiments, and end up saying that the only way to reliably determine causality is through randomized experimentation. They define what they mean by randomized, but not what they mean by experiment.

On the other hand, [Morgan and Winship](https://www.amazon.com/Counterfactuals-Causal-Inference-Principles-Analytical/dp/0521671930) do devote a section of their introduction to exploring what it means to conduct an experiment:

> Although the word experiment has a very broad definition, in the social sciences it is most closely associated with randomized experimental designs, such as the double-blind clinical trials that have revolutionized the biomedical sciences and the routine small=sclae expeirments that psychology professors perform on their own students.

Morgan and Winship cite [Cox and Reid](https://www.amazon.com/Experiments-Chapman-Monographs-Statistics-Probability/dp/158488195X):

> The word **experiment** is used in a quite precise sense to mean an investigationw here the system under study is under the control of the investigator. This means that the individuals or material investigated, the nature of the treatments or manipulations under study and the measurement procedures used are all selected, int ehir important features at leas,t bu thte investifator.
>
> By contrast in an observational study some of the se features, and in particular the allocation of indibiduals to treatment gorups, are outside the investigator's control.

They cite several other dicussions of experimental language in the context of observational studies, but are otherwise not concerned with defining what an experiment is. I also flipped through my copy of [Causality](https://www.amazon.com/Causality-Reasoning-Inference-Judea-Pearl/dp/052189560X), since Pearl is pretty big on the theory and defining terms crisply, but I didn't come across anything (note: there is no entry for "experiment" in the index of Causality).

Consequently, I drafted my own definition. 

# Reproducibility
An experiment needs to be a procedure with steps that someone else can execute. If we are running a randomzied experiment, then the data we collect will be a single instance of that experiment -- that is, the randomized design describes aggregated behavior over a distribution. It's essential that others be able to re-run that experiment. If there's a step that's impractical or impossible (e.g., acquire soil sample from Ceti Alpha 5), or missing (e.g., ambient temperature must be within some bound), then we have a problem. 

# Assignment
It's important to understand the assignment of conditions to units. If this assignment procedure is random, then we will be able to perform one set of analyses on the outcome data. If the assignment is not random, then that changes the analyses we can do. A procedure that neglects to describe how conditions are assigned to units may be hiding the fact that the procedure does not actually test the stated hypotheses.

# Testing hypotheses
When we say we are testing a hypothesis, what we mean is that we will test $$N$$ hypotheses, where $$N-1$$ offer alternate explanations to our hypothesis of interest. The other $$N$$ hypotheses are implied by some other $$N-1$$ allocations of conditions to units. We must have some non-zezro probability of assigning these $$N-1$$ alternative hypotheses' conditions to units. This is related to falisifiability, and empirical methods.

# Statistically Identifiable Analyses
The analyses that check hypotheses must be statistically identifiable -- that is, we need to be able to tell, from the data, the difference between two hypotheses. If we cannot identify the difference between two hypotheses (models), then our experiment cannot really test the hypothesis of interest. We might not be collecting or logging the data we need for our analysis, or our model may rely on more parameters than the size of our data set. 


# Problems linking hypotheses, experimental procedures, and analyses

Of course, you could have a hypothesis and analysis and an experiment (or, experimental procedure) and still get the process wrong. The experiment must actually test the hypothesis and the the analyses must be implied by the experiment. Consider this: when I was in elementary school, in order to learn about the scientific method, we would do toy experiments. We might try to compare the absorbancy of Brawny brand paper towels with Shop Rite brand paper towels. Our hypothesis is that Brawny is all marketing and the absorbancies are the same. Suppose we had the following procedure for testing this hypothesis: tear off a unit of paper towel from each, stretch over a bowl, and pour equal amounts of liquid onto each towel. Collect the liquid that falls into the bowels and measure their differences.

## Problems with Hypotheses
Now, there are a few problems with the hypothesis itself. For example, it is highly unlikely that any two Brawny paper towels absorb the exact same amount of liquid, due to variation in manufacturing, as well as grade-schooler pouring technique. A single experiment will not tell us much about Brawny towels vs. Shop Rite towels. It would be better to find out of in the average of the class results has any difference. If we find that Brawny towels absorb 1mL more per towel, this is hardly a remarkable difference. Even better than this would be to quantify the amount of difference we care about: If they absorb twice as much liquid as the Shop Rite brand, that is really something. What we need to note is that each of these changes to the hypothesis is a *refinement* of the original hypothesis: we are still working with the original set of variables of interest.

Now, suppose we were to find that there was no difference in absorbancy between the two brands of paper towels, but we observed that one of the brands seemed to break more often during experimentation. We might be tempted to instead ask about the tensile strength of the paper towels. Although this make seem like a harmless *post hoc* modification to our hypotheses, it would not be a sound thing to do. The reason is because the variables that determine absorbancy may not be the same set that determine strength. In expanding our hypothesis to include additional variables, we increase the likelihood that we will find a false positive result. Although this is unlikely to occur in the case of this experiment (paper towels are quality-controlled, have low variance in the properties we are testing, we are only testing two hypotheses here, etc.), it would not be correct to treat the two hypotheses equally. This problem of multiple hypotheses becomes much more pronounced in the social sciences, where variances on measurements and variables of interest are quite a bit higher. It illustrates the need for ``preregistration,'' where all hypotheses, analyses, and procedures are declared  ahead of time. This works similarly for natural experiments, where we state our hypotheses before conducting data analysis. If we use the data set from the natural experiment to perform exploratory analysis, then we would need to conduct a new experiment for each of the hypotheses we wish to confirm.


## Problems with Analyses
Clearly the dependent variable in our analyses needs to match the hypothesis: in our paper towel brand example, we cannot have a hypothesis about absorbancy but then do our analysis over tensile strength. Okay, maybe we could, if we had some way of converting tensile strength into absorbancy, or had a reasonable argument for why tensile strength is a good proxy for absorbancy. In any case, we want to make sure that we have a reasonable alignment of the hypotheses with the analyses. Furthermore, we want to make sure that the data we collect according to our experimental procedure aligns with the analyses we are doing. In our paper towel experiment, we did not specify how large the example paper towels had to be. If the two towel samples have different sizes, it would be reasonable to expect them to have different capcities for absorbing liquid! We would either want to standardize the size (e.g., trim the larger paper towel) or standardize our measurements (e.g., absorbancy per square inch, rather than per towel). 
