KOREAFARSI

Master Project Context, Product Vision & Working Specification

> NOTE: This document is the long-term vision and philosophy (all future phases of the full ecosystem). It is NOT the current build scope. For what to actually build right now, see PROJECT_BRIEF.md in this same folder — that document is the binding spec for the current phase and takes priority wherever the two differ in scope or detail (see sections 13 and 29 below, which describe the full future architecture, not the current task).

Project Owner: Fateme Salehzadeh (Rose)
Project Name: KoreaFarsi
Project Type: Korean Language Education Ecosystem / EdTech / Educational Publishing / AI-Powered Learning
Primary Audience: Persian-speaking learners of Korean
Primary Market: Persian-speaking market, initially focused on Iran
Project Status: Active development / long-term product ecosystem
Document Purpose: Master context for AI collaborators, product development, educational design, content production, UX/UI design, and strategic decision-making.

---

1. PROJECT OVERVIEW

KoreaFarsi is a Persian–Korean educational ecosystem designed to help Persian-speaking learners learn Korean through a structured, modern, practical, and technology-assisted learning system.

KoreaFarsi is not intended to be only a textbook, only an online course, or only a mobile application.

The long-term vision is to build an integrated ecosystem in which:

Books + Curriculum + Vocabulary System + Practice + Planner + AI + App + Content + Assessment

work together as one coherent learning experience.

The project should gradually evolve from educational content into a recognizable educational brand and eventually into a scalable EdTech platform.

The core philosophy is:

«Build a complete learning system, not a collection of disconnected educational products.»

---

2. PROJECT VISION

The long-term vision of KoreaFarsi is to become a comprehensive Korean-learning ecosystem for Persian speakers.

The ecosystem should allow a learner to enter at almost any appropriate starting point and progressively move through:

Placement → Learning Path → Lessons → Vocabulary → Practice → Speaking → Writing → Review → Assessment → Progression

The system should reduce the fragmentation that many language learners experience when they have to combine:

- textbooks
- vocabulary apps
- notebooks
- random YouTube videos
- grammar references
- flashcards
- speaking partners
- online exercises
- separate planners

KoreaFarsi should connect these components into one coherent learning journey.

---

3. CORE PROBLEM

Many Korean learners struggle not because educational resources do not exist, but because resources are fragmented.

A learner may have:

- a textbook for grammar
- another source for vocabulary
- YouTube for pronunciation
- an app for flashcards
- another app for speaking
- a notebook for writing
- no structured review system
- no clear study plan

The learner therefore has access to information but lacks a coherent system.

KoreaFarsi aims to solve this by connecting learning content, practice, review, planning, and assessment.

---

4. TARGET USERS

Primary Audience

Persian-speaking learners of Korean.

The initial market focus is Iran and Persian-speaking users.

Potential user groups include:

Absolute Beginners

Learners who know little or no Korean.

Needs:

- alphabet
- pronunciation
- writing
- basic vocabulary
- basic grammar
- confidence
- simple structured progression

Beginner Learners

Learners who know Hangul and basic Korean.

Needs:

- structured grammar
- vocabulary expansion
- sentence formation
- listening
- speaking
- writing
- review

Intermediate Learners

Needs:

- richer vocabulary
- collocations
- natural expressions
- reading
- writing
- speaking
- contextual grammar
- higher-level listening

Self-Learners

Learners who want structure and accountability without attending traditional classes.

Students Using KoreaFarsi Books

Learners whose primary interaction is with physical or digital books but who can use the app as a companion.

Future Advanced Users

Potential future learners preparing for:

- TOPIK
- studying in Korea
- work in Korea
- travel
- Korean media
- professional communication
- long-term fluency

These future use cases should be considered in the architecture, but should not unnecessarily complicate the MVP.

---

5. EDUCATIONAL PHILOSOPHY

KoreaFarsi should prioritize active learning over passive exposure.

The learner should not simply:

«see → read → forget»

The desired learning cycle is:

«Learn → Understand → Practice → Retrieve → Produce → Reuse → Review»

The system should encourage repeated exposure to vocabulary and grammar across different contexts.

---

6. CORE EDUCATIONAL PRINCIPLE: VOCABULARY RECYCLING

One of the central concepts of KoreaFarsi is Vocabulary Recycling.

A vocabulary item should not appear only once in a vocabulary list.

It should progressively reappear through:

- definition
- pronunciation
- example sentence
- collocation
- grammar
- sentence transformation
- reading
- writing
- speaking
- review
- later lessons

The objective is to move vocabulary from passive recognition toward active production.

---

7. KOREAKEY PRO

KoreaKey Pro is the vocabulary-learning/planner system associated with the KoreaFarsi ecosystem.

It can exist as:

- physical planner
- digital PDF
- app-based system
- future integrated learning module

The system should be connected to course levels and vocabulary rather than operating independently.

A possible structure is:

01 — 어휘 학습

Vocabulary Learning

02 — 콜로케이션

Collocations

03 — 문장 연습

Sentence Practice

The sentence practice system can follow:

Follow → Transform → Create

This means:

1. Follow the model.
2. Transform the structure.
3. Create an original sentence.

Practice can incorporate:

- synonyms
- antonyms
- sentence formulas
- common errors
- contextual usage

04 — 글쓰기

Writing

05 — 말하기 미션

Speaking Mission

Possible implementation:

- AI conversation
- video-based speaking
- role-play
- guided prompts

06 — 복습 & 연습

Review & Practice

The underlying principle remains:

Vocabulary Recycling.

---

8. CURRICULUM STRUCTURE

The curriculum should be systematic and level-based.

The project uses a structured course architecture inspired by established Korean-learning curricula, but KoreaFarsi must use its own original wording, examples, exercises, explanations, and pedagogical organization.

A course can contain:

- lesson objectives
- vocabulary
- grammar
- pronunciation
- listening
- speaking
- reading
- writing
- exercises
- review
- assessment

The exact curriculum architecture can evolve as the books are developed.

---

9. KOREAN ALPHABET BOOK

One of the foundational KoreaFarsi products is a Korean alphabet book.

The book introduces the learner to:

- Korean writing
- King Sejong
- 집현전
- 훈민정음
- 한글
- Korean consonants
- Korean vowels
- simple vowels
- combined vowels
- syllable blocks
- pronunciation foundations
- writing foundations
- basic practice

The book should explain the logic of Hangul clearly to Persian-speaking learners.

The goal is not merely memorizing symbols.

The learner should understand:

what Hangul is → how it is structured → how letters combine → how syllable blocks work → how Korean writing is read and produced.

---

10. ALPHABET BOOK DESIGN

Preferred visual direction:

- cream / warm white background
- minimal layout
- pastel pink
- soft green
- subtle Korean-inspired visual elements
- clean typography
- generous whitespace
- clear hierarchy
- modern educational aesthetic
- no heavy decorative borders
- no unnecessary visual clutter

The book should feel:

professional + friendly + modern + educational

rather than childish.

The author's name should appear as:

Fateme Salehzadeh

---

11. LANGUAGE OF THE EDUCATIONAL MATERIAL

Primary educational language:

Persian

Target language:

Korean

English may be used when technically useful, particularly in product development or interface specifications, but the learner-facing educational experience should primarily serve Persian-speaking learners.

Korean terminology should be introduced clearly and consistently.

Where useful, Korean terms can appear alongside Persian explanations.

---

12. APP VISION

The KoreaFarsi app is intended to become the digital companion and eventually one of the central components of the KoreaFarsi ecosystem.

The app should connect:

Books + Courses + Vocabulary + Practice + AI + Planner + Progress + Store

---

13. CORE APP AREAS

Potential major areas include:

Home

The learner's central dashboard.

Potential content:

- current course
- current lesson
- daily task
- progress
- XP
- streak
- review
- upcoming mission
- recommended activity

Courses

Structured access to KoreaFarsi lessons.

Books / Library

Digital books and potentially physical-book integration.

Possible features:

- PDF/digital books
- book access
- purchased content
- recommended books
- level-based recommendations

Vocabulary

Vocabulary learning and review.

AI Practice

AI-assisted exercises.

Potentially:

- conversation
- sentence creation
- corrections
- role-play
- pronunciation practice
- contextual practice

Planner

Personalized study planning.

Store

Potential products:

- books
- digital books
- courses
- educational products
- future Korean-learning products

Profile

Potential information:

- level
- XP
- progress
- streak
- achievements
- purchased products
- learning statistics

---

14. FUTURE PLACEMENT TEST

A Placement Test / تعیین سطح is an important future feature.

The system should eventually be able to determine a learner's approximate Korean level and recommend an appropriate starting point.

Potential assessment dimensions:

- vocabulary
- grammar
- reading
- listening
- potentially speaking

The result should connect directly to:

Level → Course → Book → Learning Path

Do not treat the placement test as an isolated quiz.

It should have a practical consequence for the user's learning journey.

---

15. ONBOARDING

Potential onboarding flow:

Step 1

Welcome / brand introduction

Step 2

Learner goal

Examples:

- general Korean
- travel
- study in Korea
- work
- TOPIK
- entertainment/media
- personal interest

Step 3

Current Korean level

Step 4

Study availability

Step 5

Preferred learning approach

Step 6

Learning target

Step 7

Personalized starting recommendation

The onboarding system should be short enough to avoid unnecessary friction.

---

16. PLANNER SYSTEM

The KoreaFarsi planner should be more intelligent than a standard calendar.

It should help answer:

«What should I study, how much, when, and why?»

The planner may collect approximately 5–10 questions.

Potential inputs:

- current level
- goal
- available time
- study frequency
- preferred study times
- weak skills
- target date
- preferred content type
- current course
- consistency level

The system can generate a study plan based on these inputs.

---

17. GAMIFICATION

KoreaFarsi can use gamification, but it should remain mature and professional.

Potential mechanics:

- XP
- levels
- streaks
- badges
- missions
- milestones
- progress bars
- completion states
- achievements

Avoid making the experience childish.

The goal is:

Motivation without sacrificing credibility.

---

18. APP VISUAL DIRECTION

Preferred visual direction:

Overall Style

- modern
- warm
- premium
- playful but mature
- contemporary Korean
- soft
- clean
- intelligent

Visual Mood

A useful conceptual reference is:

"A sophisticated Korean ice-cream shop."

This means:

- lively
- welcoming
- colorful
- clean
- precise
- friendly
- visually memorable

but not childish.

Preferred Palette

Possible palette direction:

- warm cream
- beige
- muted sage
- muted teal
- blush pink
- soft neutral tones
- navy / charcoal text

Avoid overly cold blue-white interfaces.

---

19. MORPHISM DIRECTION

The UI may use:

- soft glass-like layers
- subtle translucency
- soft shadows
- rounded cards
- layered surfaces
- subtle neumorphism

However:

Do not make the entire interface glassmorphic.

The design should use morphism as an accent and interaction language rather than turning every surface into transparent glass.

---

20. BOOK + APP CONNECTION

One of the important strategic advantages of KoreaFarsi is the ability to connect physical learning with digital interaction.

For example:

Book → QR / Digital Access → Video / Audio / AI Practice → App → Progress

A learner could study from the physical book and then continue practicing in the app.

This creates a blended learning ecosystem.

---

21. AI IN KOREAFARSI

AI should eventually become an important component of KoreaFarsi.

Potential AI features include:

AI Conversation

Learners practice Korean with an AI conversation partner.

AI Correction

AI identifies:

- grammar errors
- unnatural phrasing
- vocabulary issues
- sentence structure problems

AI Writing Practice

Learners write Korean and receive structured feedback.

AI Speaking

Potential future features:

- pronunciation feedback
- role-play
- conversation
- fluency practice

AI Lesson Generation

AI may help create supplementary exercises based on the learner's level.

AI Personalized Review

The system can recommend what the learner should review based on:

- errors
- performance
- forgetting patterns
- vocabulary history
- lesson progress

---

22. AI-GENERATED LESSON VIDEOS

KoreaFarsi may use AI-generated lesson videos instead of requiring the project owner to record every lesson personally.

This can potentially include:

- instructor-style videos
- animated explanations
- vocabulary demonstrations
- pronunciation demonstrations
- scenario-based learning
- visual storytelling

The purpose is to make the content scalable while maintaining consistency.

---

23. CONTENT SYSTEM

Content should be modular.

A single educational concept should ideally be reusable across:

- textbook
- app
- planner
- video
- social media
- AI practice
- assessment
- review

For example:

A vocabulary item can become:

Book Entry → App Card → Collocation → Sentence Exercise → Speaking Mission → Review Question → Social Content

This is an important principle for content scalability.

---

24. CONTENT REUSABILITY

Whenever designing educational content, consider:

«Can this content be reused across multiple products?»

Avoid creating the same information independently for:

- book
- app
- video
- website
- social media

Instead, whenever practical, design a structured content source that can feed multiple outputs.

---

25. BRAND POSITIONING

KoreaFarsi should feel like a serious educational brand rather than a personal teaching page.

The brand should communicate:

- expertise
- trust
- clarity
- modern education
- Korean culture
- technology
- warmth
- accessibility

It should not feel overly academic or intimidating.

It should also not look like a generic language-learning startup.

---

26. CONTENT BRAND VOICE

The educational voice should be:

- clear
- friendly
- intelligent
- encouraging
- practical
- modern
- culturally aware

Avoid:

- excessive childishness
- excessive slang
- empty motivational language
- unnecessary complexity
- overly academic explanations when a simpler explanation works

---

27. SOCIAL CONTENT

Social media can support KoreaFarsi by creating an ecosystem around the educational products.

Potential content categories:

- Korean vocabulary
- Korean grammar
- pronunciation
- cultural information
- common mistakes
- Korean expressions
- mini lessons
- study tips
- learner challenges
- behind-the-scenes book development
- app development
- AI learning experiments
- product announcements

Social media should ultimately support the broader ecosystem rather than becoming the entire business model.

---

28. BUSINESS MODEL

Potential revenue streams include:

Educational Books

- physical books
- digital books
- bundles

Courses

- structured courses
- premium courses
- future specialized courses

App

Potential models:

- freemium
- subscription
- paid modules
- premium AI features

Planner

- physical
- PDF
- digital/app version

AI Features

Potential premium AI usage or subscription.

Bundles

Examples:

Book + App + Planner

or:

Course + Book + AI Practice

The exact pricing model should be validated before implementation.

---

29. PRODUCT STRATEGY

Do not attempt to build the entire ecosystem simultaneously.

A sensible development philosophy is:

Phase 1 — Core Educational IP

Build:

- alphabet book
- foundational curriculum
- vocabulary system
- core educational structure

Phase 2 — Productization

Build:

- planner
- digital materials
- structured course system

Phase 3 — App MVP

Build the smallest useful application:

- authentication
- profile
- course
- book/library
- progress
- basic vocabulary
- basic planner

Phase 4 — AI

Add:

- AI practice
- speaking
- writing correction
- personalized review

Phase 5 — Ecosystem

Connect:

- books
- app
- courses
- planner
- AI
- store
- assessment
- community/content

This is a strategic framework, not a rigid final roadmap. Reassess based on user feedback, resources, technology, and business validation.

---

30. MVP PRINCIPLE

The MVP should answer one question:

«What is the smallest version of KoreaFarsi that delivers meaningful learning value?»

Do not build sophisticated infrastructure simply because it is technically interesting.

Every feature should be evaluated based on:

- learner value
- development cost
- maintenance cost
- complexity
- scalability
- revenue potential
- strategic importance

---

31. DESIGN SYSTEM

KoreaFarsi should eventually have a reusable design system.

It may include:

Colors

- primary
- secondary
- accent
- background
- surface
- text
- semantic states

Typography

- Persian typography
- Korean typography
- English typography where needed

Components

- buttons
- cards
- tabs
- navigation
- progress indicators
- lesson cards
- vocabulary cards
- quiz components
- badges
- modal dialogs
- input fields
- navigation bars

States

Every important component should consider:

- default
- hover
- active
- disabled
- loading
- error
- success
- empty

---

32. MULTILINGUAL DESIGN

Because KoreaFarsi involves Persian and Korean, multilingual UX is critical.

Consider:

- RTL Persian
- LTR Korean
- mixed-script content
- typography differences
- number formatting
- punctuation
- alignment
- text expansion
- line height
- pronunciation notation

Do not assume that simply switching direction is sufficient.

---

33. TECHNICAL PRINCIPLES

The exact technology stack is not permanently fixed.

Technology decisions should be based on:

- speed
- reliability
- maintainability
- cost
- scalability
- developer availability
- integration capability
- AI support
- deployment simplicity

Avoid technology choices based purely on hype.

---

34. DATA ARCHITECTURE

The long-term system may need entities such as:

- User
- Profile
- Level
- Course
- Unit
- Lesson
- Vocabulary
- Grammar
- Exercise
- Question
- Book
- Planner
- Study Plan
- Learning Session
- Progress
- Review Item
- Assessment
- Placement Test
- AI Session
- Subscription
- Purchase
- Product
- Achievement

The exact schema should evolve with the product.

---

35. CONTENT ARCHITECTURE

Educational content should ideally be structured in a way that allows the same underlying content to be rendered into:

- web
- mobile app
- book
- PDF
- video
- AI prompts
- quizzes
- review systems

Avoid hardcoding educational content into a single interface whenever possible.

---

36. ANALYTICS

Future analytics should help answer:

- Where do learners stop?
- Which lessons cause difficulty?
- Which vocabulary is frequently forgotten?
- Which exercises are too easy?
- Which exercises are too difficult?
- How often do users practice?
- What causes churn?
- Which features create meaningful learning?
- Which content produces the most improvement?

Analytics should serve both:

business decisions + educational decisions.

---

37. ASSESSMENT

Assessment should eventually exist at multiple levels:

Micro Assessment

After a lesson.

Unit Assessment

After a group of lessons.

Course Assessment

At the end of a course.

Semester / Level Assessment

To determine readiness for progression.

Placement Assessment

Before starting.

Assessment should measure actual learning rather than merely completion.

---

38. LEARNING PROGRESS

Progress should not be represented only by:

«"You completed 70%."»

Meaningful progress may include:

- vocabulary mastered
- grammar mastered
- speaking performance
- writing performance
- listening performance
- reading performance
- review consistency
- assessment results
- learning streak
- course progression

The system should eventually distinguish activity from learning.

---

39. FUTURE EXPANSION

Potential future expansion:

- TOPIK preparation
- Korean culture courses
- pronunciation specialization
- business Korean
- travel Korean
- Korean for work
- Korean for university
- advanced speaking
- AI tutors
- community learning
- teacher dashboards
- institutional licensing
- B2B educational licensing
- schools and language institutes
- international expansion

These are future possibilities, not current requirements.

Do not let future features unnecessarily complicate current development.

---

40. COMPETITIVE POSITIONING

When analyzing competitors, do not copy them blindly.

Study:

- what they do well
- what learners like
- what learners dislike
- where their UX fails
- what their business model is
- what their educational methodology is
- what their technology enables
- what KoreaFarsi can do differently

Potential reference categories include:

- Korean-learning apps
- general language-learning apps
- Korean textbooks
- online Korean academies
- vocabulary apps
- AI language tutors
- educational planners

The objective is differentiation through system design, not imitation.

---

41. IMPORTANT DIFFERENTIATOR

A potentially important KoreaFarsi advantage is the integration of:

Persian-native explanation + Korean-native target language + structured curriculum + vocabulary recycling + physical/digital products + AI practice + personalized planning.

The combination matters more than any single feature.

---

42. QUALITY STANDARD

Everything created for KoreaFarsi should be evaluated against four dimensions:

Educational Quality

Is it pedagogically useful?

User Experience

Is it easy and pleasant to use?

Brand Quality

Does it feel like KoreaFarsi?

Product Quality

Can it function as part of a scalable ecosystem?

An output that succeeds in only one dimension is not sufficient.

---

43. DECISION-MAKING FRAMEWORK

When making a recommendation for KoreaFarsi, consider:

1. Learner value
2. Educational validity
3. Product usability
4. Technical feasibility
5. Cost
6. Development time
7. Maintainability
8. Scalability
9. Brand consistency
10. Revenue potential
11. Future compatibility

When trade-offs exist, explicitly explain them.

---

44. OPEN DECISIONS

The following should NOT automatically be treated as finalized:

- Exact technology stack
- Final app architecture
- Final pricing
- Subscription model
- Exact placement-test methodology
- Final AI provider
- Final database architecture
- Final course count
- Final curriculum sequencing
- Final brand palette
- Final logo
- Final typography
- Final gamification mechanics
- Final launch timeline

These should be treated as decisions to validate, not assumptions.

---

45. NON-NEGOTIABLE PRINCIPLES

Unless explicitly changed by the project owner:

1.

KoreaFarsi is an ecosystem, not a single product.

2.

Educational quality comes before superficial gamification.

3.

The learner experience should remain understandable and human.

4.

AI should solve real problems rather than exist merely because it is fashionable.

5.

Content should be reusable across products whenever practical.

6.

The product should be designed for Persian-speaking Korean learners first.

7.

The interface should be modern and premium without becoming cold or corporate.

8.

The educational experience should feel mature rather than childish.

9.

The system should be scalable, but MVP development should remain practical.

10.

Do not confuse feature quantity with product quality.

---

46. HOW CLAUDE SHOULD WORK ON THIS PROJECT

When working on KoreaFarsi, Claude should behave as a multidisciplinary project collaborator.

Relevant roles include:

- Educational Designer
- Curriculum Architect
- Korean Language Content Editor
- Product Strategist
- UX Researcher
- UI/UX Designer
- Product Manager
- Technical Architect
- AI Product Designer
- Researcher
- Business Analyst
- Copywriter
- Editor
- Project Planner

Do not assume every task requires all of these roles.

Use the roles relevant to the problem.

---

47. WORKING RULES FOR CLAUDE

When a task is ambiguous:

- First infer the most likely intent from the existing project context.
- If the ambiguity materially changes the outcome, ask a concise clarification question.
- Do not ask unnecessary questions merely to avoid making decisions.

When a decision has already been made:

- Preserve it.
- Do not casually replace it.

When proposing a new direction:

- Label it as a proposal.
- Explain why it may be better.
- Identify what would change.

When information is uncertain:

- Say so.
- Separate facts from assumptions.

When current external information matters:

- Verify it using reliable current sources.

When researching competitors or technology:

- Prefer primary sources.
- Use current information.
- Do not rely on outdated assumptions.

---

48. OUTPUT EXPECTATIONS

For complex project work, useful output formats include:

- tables
- structured plans
- checklists
- decision matrices
- architecture diagrams
- user flows
- product requirements
- feature specifications
- content structures
- implementation steps
- technical specifications
- acceptance criteria
- risk analysis

Do not create complexity merely for presentation.

The output should help move the project forward.

---

49. CRITICAL THINKING STANDARD

Do not agree with an idea simply because it came from the project owner.

If something is weak, explain:

What is wrong → Why it matters → What could happen → How to fix it

If something is strong, explain why it is strong in concrete terms.

Avoid generic praise.

---

50. PROJECT NORTH STAR

The ultimate goal is to build a Korean-learning ecosystem in which a Persian-speaking learner can move through a coherent journey:

Discover KoreaFarsi
↓
Assess Level
↓
Receive Learning Path
↓
Study with KoreaFarsi Content
↓
Learn Vocabulary
↓
Practice Grammar
↓
Read / Listen / Write / Speak
↓
Use AI for Practice
↓
Review Intelligently
↓
Track Progress
↓
Take Assessments
↓
Advance to the Next Level

The system should progressively become more personalized, intelligent, and useful.

---

51. FINAL PROJECT PRINCIPLE

KoreaFarsi should not become:

«"another Korean-learning app."»

It should become a coherent educational system designed specifically for Persian-speaking learners of Korean.

The long-term value should come from the combination of:

Educational IP + Curriculum + Content + Vocabulary System + Books + Planner + App + AI + Personalization + Brand

The project should always move toward this principle:

«One learner. One connected learning ecosystem. One coherent educational experience.»

---

END OF MASTER PROJECT CONTEXT