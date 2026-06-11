# Canonical Naming Conventions

Status: **canonical**

## Academy Names

| Display Name | Slug | Code Prefix |
|---|---|---|
| Foundation Academy | `foundation-academy` | `FA` |
| Bridge Academy | `bridge-academy` | `BA` |
| Scholar Academy | `scholar-academy` | `SA` |

## Grade Names

Use `Grade 3`, `Grade 6`, `Grade 9` in human-facing copy. Use `grade-3`, `grade-6`, `grade-9` in paths.

## MVP Course Names

| Canonical Course | Acceptable Short Label | Avoid |
|---|---|---|
| Grade 3 ELA | G3 ELA | Grade 3 Reading only |
| Grade 3 Math | G3 Math | Math 3 |
| Grade 3 Science | G3 Science | Elementary Science without grade |
| Grade 3 Social Studies | G3 Social Studies | Community Studies only |
| Grade 6 ELA | G6 ELA | Middle ELA without grade |
| Grade 6 Math | G6 Math | Math 6 |
| Grade 6 Science | G6 Science | Earth Science only unless unit-specific |
| Grade 6 Social Studies | G6 Social Studies | Ancient History only unless unit-specific |
| English 9 | English 9 | Grade 9 ELA as course title |
| Algebra I | Algebra I | Grade 9 Math as course title |
| Biology | Biology | Grade 9 Science as course title |
| World History I | World History I | Grade 9 History as course title |

## Lesson ID Pattern

```txt
{ACADEMY_CODE}-G{GRADE}-{SUBJECT_CODE}-U{UNIT_NUMBER}-L{LESSON_NUMBER}
```

Examples:

```txt
FA-G3-MATH-U1-L1
BA-G6-ELA-U2-L1
SA-G9-ALG-U1-L1
```

## Subject Codes

| Subject/Course | Code |
|---|---|
| ELA | `ELA` |
| Math | `MATH` |
| Science | `SCI` |
| Social Studies | `SS` |
| Algebra I | `ALG` |
| English 9 | `ENG` |
| Biology | `BIO` |
| World History I | `WH` |

## Standards Tag Pattern

```txt
{SUBJECT}.G{GRADE}.{DOMAIN}.{SKILL}
```

Examples:

```txt
MATH.G3.OA.EQUAL_GROUPS
ELA.G6.THEME.TEXT_EVIDENCE
SCI.G9.CELLS.SYSTEMS
SS.G9.WORLD_HISTORY.RIVER_VALLEYS
```

## Thinking Skill Tags

Use lowercase tag phrases in content JSON:

```txt
first-principles problem solving
critical thinking
evidence-based reasoning
interpretation
academic discussion
metacognition
retrieval practice
spaced retention
inquiry-based learning
computational thinking
systems thinking
project-based application
adaptive mastery
feedback
```
