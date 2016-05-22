---
layout: page
title: Software
published: true
---


All of my projects are hosted on [GitHub](http://github.com). Below are the public ones, listed in chronological order.

## [SurveyMan-related software](http://surveyman.org)
Surveys can be thought of as programs. Not only do they have control flow, but they also have bugs and composable abstractions. We developed a language that expressed these abstractions and was designed to prevent some bugs and make other bugs easier to diagnose. 

# [SurveyMan programming language](http://github.com/SurveyMan/SurveyMan)
![SurveyMan Tabular Language](/assets/SMTabular.png){:style="float: left; max-width: 350px; margin-right: 20px"}
The abstract SurveyMan programming language is a tabular language with random choice. We have a [Java API](http://surveyman.github.io/SurveyMan/target/site/apidocs/index.html) that includes static analyses of survey programs, as well as a simulator for testing.

The simulator allows the user to test the robustness of a survey against a variety of actors. For example, if there is a correct or highly likely answer for each question in the survey, we can programmatically specify this and create a synthetic population of respondents that choose the correct answer most of the time, and choose randomly a tunable percentage of the time. We can also mix in random respondents and biased respondents, and then classify the mix to see how many bad actors we can tolerate before the survey results are affected. 

# [SurveyMan React frontend](http://github.com/SurveyMan/react-surveyman)
![SurveyMan Front End](/assets/SMFrontEnd.png){:style="float: right; max-width: 350px; margin-left: 20px"} We we fortunate to have a [GSoC 2015](https://developers.google.com/open-source/gsoc/?csw=1) [student](http://prakhar.me/) implement a [visual SurveyMan front end](http://surveyman.cs.umass.edu) in React. The SurveyMan language is meant to be written in a spreadhseet program, but when blocking and branching become sufficiently complex, they may require a more visual interface. Users can upload JSON surveys to the front end and visually inspect survey control flow. Users can also randomize the order of questions to ensure that their intended flow invariants are not violated. The visual frontend does not support all features of the languge. Currently branching and the static analyses are not implemented. 

# [SurveyMan Runtime](http://github.com/SurveyMan/Runner)

# [SurveyMan Debugger](http://github.com/SurveyMan/Debugger)
