---
layout: post
title: Units of Randomization
permalink: units_of_randomization.html
author:
  display_name: Emma Tosch
---

Last year, before learning about the approach PlanOut takes, I had started tackling the design of an experimental design language from a totally different perspective. It was informed by SurveyMan, and we assumed we'd run it on two different systems: AMT and some kind of general software experimentation platform. PlanOut exposed us to a variety of issues that practitioners face when implementing their experimentation systems in real software, on real data. 

<!--summary-->

I had outlined the general approach as follows:

1. Define valid operators and variables for the scope. When we were framing this as an extension of the SurveyMan tabular language, we thought about factors as being columns in a table. We designed SurveyMan to be written in a spreadsheet, as a DAG. We thought of experiments more like database tables and joins. The data in the "database tables" would represent hypotheses we had about the realtions between factors/columns. Then we would have a higher level scripting language on top of the tables that would describe how to combine the data in the tables. What we were missing was a notion of conditional random assignment. This logic-based approach had no way of representing any kind of sequential ordering and would have eventually required an extension.

2. Express hypotheses in terms of the factors and a well-defined proxy. For a while, I got really caught up in the issue of generalizability/external validity. A motivating example: back in the SurveyMan paper, we ran a survey that was perhaps actually an experiment. Presley wanted to test a idea from psycholinguistics called prototypicality. Prototypicality is the idea that for a particular concept, humans have an idealized notion of that concept, and will grade it according to scale. In the case of the Platonic chair, something like this is what, for example, most Americans will agree is a chair: ![Van Gough's Chair](/assets/vincents-chair-with-his-pipe.jpg). However, people might have greater difficulty deciding whether a recliner is a chair or a bean bag is a chair. All this makes sense for chairs, but Presley was concerned that the idea of prototypicality was being applied in cases where it really didn't make any sense. She was also concerned that the repoted gradations of prototpicalty were actually an artifact of the survey instrument itself. Her hypothesis was that when you give people a scale, they will use, regardless of whether it makes sense to do so. To test this, she devised a survey with variants on both question wording and response wording. The topic of her survey was parity -- she would ask respondents "how even" or "how odd" a number was. Furthermore, she labeled each question as elicitying high prototypicality or low prototypicality. The high prototpypicality quesitons might be worded like, "How good of an example of an odd number is this?" 

Random assignment in PlanOut requires the experimenter to specify a *unit of randomization*. Since an experiment is a mapping from units to conditions, the unit of randomization partitions the conditions. Consider the following 


