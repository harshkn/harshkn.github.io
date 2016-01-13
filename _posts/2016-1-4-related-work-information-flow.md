---
layout: post
title: Information Flow
author:
  display_name: Emma Tosch
---

When I was chatting with Emery about the effect of the [unit of randomization]({{ base.url }}/units_of_randomization.html)) on [inference of causal estimators]({{ base.url }}/estimator_inference.html), he suggested I look into the information flow literature, since randomization parallels secure information. He initially suggested I look at [Jif](http://www.cs.cornell.edu/jif/), but while perusing [Stephen Chong's publications](http://people.seas.harvard.edu/~chong/publications.html), I came across a different paper that appears to have some important features and properties that we can build on.

This appears to be an older paper (published in 2006). What follows is part summary, part running commentary/reactions.

<!-- First of all, though, I want to note that it should be unsurprising that there is significant related work in secuity and privacy for modeling experimentation. [Recent work]() has shown that properties from differential privacy can be ported to questions of data reuse and testing multiple hypotheses.  -->

## [Information-Flow Security for Interactive Programs](https://ecommons.cornell.edu/handle/1813/5721)

# Abstract

This paper tackles the information-flow security for interactive (imperative) programs. The authors point out that current models for inforation-flow security that are secure for non-interactive programs may become insecure for interactive programs.

The start the abstract thusly:

    Interactive programs allow users to engage in input and
    output throughout execution. The ubiquity of such programs
    motivates the development of models for reasoning
    about their information-flow security, yet no such models
    seem to exist for imperative programming languages. Further,
    existing language-based security conditions founded
    on noninteractive models permit insecure information flows
    in interactive imperative programs.

What's interesting to me is the conflation of interactive and imperative programs. Okay, so it's not fully conflated, but it does make me wonder: what makes a program interactive? Is a REPL interactive? I have the sense that, although they both have a user providing input in a step-wise fashion, the Scheme REPL and a Javascript GUI are not really the same thing. I think about it this way: for *truly* interactive programs, each command is a state, and each action taken by the user is a transition. The *person* executing the commands *is* `eval`. When the user executes commands in the Scheme REPL, all they can really do is evaluate assignments (save immutable state) or expressions (which disappear into the abyss). That is, you could record all of your actions in the REPL and export it as a giant `let`, and it would be as if the program were non-interactive. The sense I have with truely interactive programs is that, if you were to attempt to export the user's actions, you would not have functions, but smaller fragments of expressions or procedures. I am not aware of much literature on interactive programs, or if my intuition is correct. In any case, I do wonder if there is a formal definition for what makes an interactive program, since it's something I took for granted when I started writing this paragraph!

# Introduction

Anyway, they specify in the introduction that most information-flow analysis treats programs as batch jobs and only models initial values when determining the security of a computation. They don't consider intermediate values. Maybe the Scheme REPL is not safe after all? For example, if some value is aliased with a new value of a different classification, would it change the classification of the entire computation? I think I know where they are going with this: we need an operational semantics!

They say they have a "strategy-based information flow". A strategy appears to be a formalism for describeing "how agents interact with their environments." There are no citations here, so perhaps this is a security-specific term? It reminds me of "policies" in reinforcement learning, but there is no citation to RL here. "User strategies" are apparently related to commmunicating processies, from the concurrency literature.

__Nondeducibility on strategies__: property to "ensure that confidential information cannot flow from high-confidentiality users to low-confidentiality users".

They adapt some type system (Volpano, Smith, & Irvine) "to an interactive setting.

__CONTRIBUTION__: synthesizing (1) trace-based definitions of information flow and (2) ??? something security related? They don't make it super clear to me what the two things they're synthesizing are. They also make the case that their framework is a better model for _in vivo_ programs than the formal models of the past (Will they prove this? We shall see...). They model nondeterminism and probabilistic choice and use this to "rule out refinement attacts" and give a security condition "that rules out probabilistic information flows in randomized interactive programs." I am not sure what randomized interactive programs are, but I guess we'll find out!

__Nondeterminism__: they differentiate between probabilistic nondeterminism and just-don't-know nondeterminism. I am very interested in where this part is going, since we need to reason about several variations on nondeterminism in PlanOut. They do differentiate between probailistic choice and nondeterministic choice.

# User Strategies

The authors provide an example of a program where a high-confidentiatity users may transmit information to a low-confidentiality user through their choice of inputs. Although the low-confidentiality user cannot actively do anything to elicit information from the high-confidentiality user, there exists a particular action (input) that the high-confidentitality user may take that will allow the low-confidentiality user to learn something about high's inputs.

The authors employ user strategies to describe how users may base new inputs on old outputs. Users could employ a constant (memoryless) strategy. They provide a straightforward small-step semantics for communicating across channels according to a set of strategies. This semantics is used to prove that neither party can leak information, via the assertion that

    ...a program is secure if, for every initial state $$sigma$$, any trace of events seen on channel $$L$$ is consistent with every possible user strategy for channel $$H$$.

They note that this condition "does not protect the secrecy of the initial values of variables," so that there is nothing protecting a user from communicating their input to a high security channel and then outputs that input to a low security channel.

Proving a program secure does not require that variables contain security type information (although they say some of their static analyses will compute this).

The model is **not timing sensitive** -- there is blocking on input channels, and the observational model is asynchronous. They state that they could incorporate temporal information into the model to make it timing-sensitive.

The model is **termination sensitive** "when low events follow commands that may not terminate." Although users cannot observe nontermination, with knowledge of the program, they can assume that some programs can enter a nonterminating state. They note that a termination event/signal could be added to transmit that information to users.

# Nondeterministic Programs

They model "true" nondeterminsim (i.e., not randomization) as an underspecification. This is similar to how we view nondeterminism in PlanOut -- we typically know the codomain of nondeterministic operators and just treat their assignment as something we have insufficient information to infer.

They use "refinement lists" (a list of arbitrary, binary values) to resolve nondeterminism. I don't quite get what this is and will need to read the related literature.

In any case, each security type gets its own refinement list, so information isn't leaked between channels. They say that the number of choices per security channel can become a covert channel, so to siloh the channels. They define a function called a _refiner_ that associates refinement lists with security types. Commands (and thus configurations) are now parameterized by refiners. By moving all nondeterminism logic to the refiner function, they isolate the nondeterministic and the deterministic parts of the program.

Importantly, refiners cannot model behavior that depends on dynamic factors. They operator by making all choices look like they were made before program execution. The authors point out that this means the model can only capture compile-time nondeterminism, and not runtime nondeterminism (so maybe they can't handle the kind of interactive program I was talking about above?).

# Probabilistic Programs

The authors model probabilistic choice as a refinement (i.e., a less under-specified version) of nondeterministic choice. They define a measure space on program trees and specify a Borel set for rays (i.e., maximal execution sequences of programs). Equivalence of traces depends only on pointwise equivalence of configurations and measures.

TODO: GO THROUGH THIS SECTION MORE CAREFULLY

# A Sound Type System

Noninterference is often intractable!

"Noninterference is enfornced provided there exists some variable typing under which the program is well-typed"

Soundness theorem.

TODO: GO THROUGH THIS SECTION MORE CAREFULLY

# Related Work

Denning defines information-flow security for imperative programs, but most followup work assume the batch-job model.

Models of nondeterminism in concurrency work have looked at information flow and have produced new definitions of noninterference.

Process algebras are very similar to the user strategies described.

It appears that the two different approaches this paper is trying to unify are models that handle uncertainty and models that use strategies?

Bisimulation is useless in the face of nondeterminsim -- we need trace-based inference for this. Apparently bisimulation allow users to observe internal state, but this program does not? I think that's kind of weird, since I thought it was implied that the user can see the program. Maybe I am misinterpreting this statement -- maybe what they're saying is that the bisimulation can observe _choices made while the are happening_.

Interative systems are similar to message passing between threads. Again, this line of work uses bisimulation. The authors point out that modeling users as processes doesn't make sense, since user behavior is unknown, and that the security condition can only apply if the entire program is known (but I thought the entire program *was* known?).

The authors also cite reactive programs, but say that reactibity requires locality. 

# Other comments

I think this paper would also serve as interesting related work and inspiration for a SurveyMan testing paper.
