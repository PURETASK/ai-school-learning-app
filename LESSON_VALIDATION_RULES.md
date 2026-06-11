# Lesson Validation Rules

## Required Checks

The validation script must check:

- Required top-level fields exist
- Lesson has academy, academyName, gradeLevel, subject, course, unit
- Lesson ID is unique
- Lesson ID follows canonical pattern
- Standards tags exist and are non-empty
- Thinking skill tags exist and are non-empty
- Lesson flow contains all required sections
- Quiz contains answer keys and explanations
- Retrieval check exists
- Memory Vault items exist
- Reteach path exists
- Challenge path exists
- Mastery bands exist
- Accessibility notes exist
- Safety notes exist

## Duplicate Checks

- No duplicate lesson IDs
- No duplicate quiz IDs inside all lessons
- No duplicate Memory Vault item IDs inside all lessons

## Severity Levels

| Severity | Meaning |
|---|---|
| Error | Blocks import/build |
| Warning | Should fix before production |
| Info | Useful note, does not block |

## MVP Passing Standard

For MVP seed lessons, validation must return:

```txt
0 errors
Warnings allowed only for future features or rubric scoring placeholders
```
