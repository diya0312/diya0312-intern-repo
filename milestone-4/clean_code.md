# Understanding Clean Code Principles

**Milestone:** 4  
**Issue Number:** #64  
**Date:** 15/09/2026

## Clean Code Principles

### Simplicity

Keep code as simple as possible and avoid unnecessary complexity.

### Readability

Code should be easy to understand through clear naming, formatting, and structure.

### Maintainability

Code should be easy for future developers to understand, modify, and extend.

### Consistency

Follow consistent naming, formatting, and coding conventions throughout a project.

### Efficiency

Write code that performs well while avoiding unnecessary optimization or premature over-engineering.

## Messy Code Example

I created a small Python example that calculates the sum of even numbers:

`def x(a): t=0 for i in a: if i%2==0: t=t+i print(t)`

The code works, but it is difficult to read because the function and variable names are unclear, the formatting is inconsistent, and the purpose of the code is not immediately obvious.

![Messy code](screenshots/messy-code.png)

## Cleaner Version

I rewrote the code using descriptive names, consistent formatting, and a clearer structure:

`def sum_even_numbers(numbers): total = 0 for number in numbers: if number % 2 == 0: total += number return total`

Both versions produce the same result, but the cleaner version is easier to understand and maintain.

![Clean code](screenshots/clean-code.png)

## What I Learned

Clean code is not only about making code work. Clear naming, simple structure, consistency, and maintainability make code easier for other developers and for myself to understand and modify later.

---

## Code Formatting & Style Guides

**Milestone:** 4    
**Issue Number:** #65    
**Date:** 16/09/2026

### Importance of Consistent Code Style

Consistent code formatting makes code easier to read, review, and maintain. Following a common style also reduces unnecessary differences between files and makes it easier for developers to understand code written by others.

### Airbnb JavaScript Style Guide

I reviewed the Airbnb JavaScript Style Guide to understand commonly recommended JavaScript style practices. The guide provides conventions for areas such as variables, functions, objects, arrays, naming, whitespace, and other JavaScript syntax.

![Airbnb JavaScript Style Guide](screenshots/airbnb-style-guide.png)


### ESLint and Prettier

- **ESLint** is a JavaScript linter that checks code against configured rules and reports potential problems or style violations.
- **Prettier** is a code formatter that automatically applies consistent formatting to supported source files.
- ESLint and Prettier serve different purposes, but they can be used together to improve consistency and code quality.

For this exercise, I installed and configured ESLint and Prettier and ran them on a small JavaScript example created specifically for the activity.

### Linting and Formatting

The original example contained inconsistent formatting and JavaScript style issues. ESLint was used to identify code-quality problems, while Prettier was used to automatically format the code.

![Before formatting and linting](screenshots/formatting-before.png)

After applying the formatter and fixing the reported issues, the code became more consistent and easier to read.

![After formatting and linting](screenshots/formatting-after.png)

### Reflection

Consistent formatting is important because it improves readability and makes code easier to review and maintain. It also reduces distractions caused by inconsistent indentation, spacing, and syntax.

The linter helped identify issues that might otherwise be overlooked, while Prettier automatically handled much of the formatting. After formatting and fixing the issues, the code was easier to read and more consistent.

---

## Naming Variables & Functions

**Milestone:** 4  
**Issue Number:** #66    
**Date:** 15/09/2026

### Best Practices

Good variable and function names should clearly describe what the value represents or what the function does. Names should be meaningful, specific, and easy to understand without needing extra explanation.

For variables, descriptive names such as `total_price`, `student_count`, or `user_name` are easier to understand than names such as `x`, `n`, or `a`.

For functions, the name should describe the action being performed. For example, `calculate_total()` is clearer than `calc()` or `do_task()`.

### Unclear Naming Example

I created a small Python example with unclear variable and function names. The original version used names such as `x`, `a`, `t`, and `i`. The function name did not explain what the function actually did, making the purpose of the code harder to understand.

![Unclear naming example](screenshots/naming-unclear.png)

### Refactored Version

I renamed the function and variables to make their purpose clear. For example, `x` was changed to `sum_even_numbers`, `a` to `numbers`, `t` to `total`, and `i` to `number`.

The functionality remained the same, but the names now make the code easier to understand without needing additional explanation.

![Refactored naming example](screenshots/naming-clear.png)

### Reflection

Poorly named variables and functions can make code confusing and increase the time needed to understand, debug, or modify it. They can also make collaboration harder because another developer may not immediately understand what the code is supposed to do.

Refactoring the names improved readability because the purpose of each variable and function became clear from the name itself. This showed me that meaningful naming is an important part of writing clean and maintainable code.

---

## Writing Small, Focused Functions

**Milestone:** 4  
**Issue Number:** #67      
**Date:** 15/09/2026

### Best Practices

A good function should generally have one clear responsibility. Keeping functions small makes them easier to understand, test, debug, and modify. Functions should have clear names that describe what they do and should avoid handling several unrelated tasks at once.

### Long Function Example

I created an example function called `process_student_marks()` that calculated the total, average, highest mark, lowest mark, grade, and displayed the results. Although the function worked correctly, it handled several different responsibilities in one place.

![Long function example](screenshots/long-function.png)

### Refactored Version

I divided the large function into smaller functions such as `calculate_total()`, `calculate_average()`, `find_highest()`, `find_lowest()`, `calculate_grade()`, and `display_results()`. Each function now has a specific responsibility.

The refactored version produces the same output as the original version, but the structure is easier to understand, test, and maintain.

![Focused functions example](screenshots/focused-functions.png)

### Reflection

Breaking a large function into smaller focused functions makes the code easier to understand and maintain. Each function can be understood and tested independently, and changes to one responsibility are less likely to affect unrelated parts of the code.

The refactoring improved the structure by separating calculations, grade determination, and output into different functions. This made the overall code more organized and showed me why single-purpose functions are useful for clean code.

---

## Avoiding Code Duplication

**Milestone:** 4  
**Issue Number:** #68        
**Date:** 15/09/2026

### DRY Principle

DRY stands for "Don't Repeat Yourself". It means that the same logic should not be unnecessarily repeated in multiple places. Instead, repeated logic can be placed in a reusable function or another suitable structure.

### Duplicated Code Example

I created a small example in the test repository where the same formatting and calculation logic was repeated for two students. The repeated code made the program longer and meant that changes to the same logic would need to be made in multiple places.

![Duplicated code example](screenshots/duplicated-code.png)

### Refactored Version

I refactored the repeated logic into a reusable function. The function can now be called for different students instead of repeating the same code.

The output remains the same, but the code is shorter and easier to maintain because the logic exists in one place.

![Refactored code example](screenshots/dry-refactored.png)

### Reflection

Duplicated code can make a program harder to maintain because the same logic may need to be updated in multiple places. It can also increase the chance of inconsistencies if one copy is changed while another is not.

Refactoring the duplicated code improved maintainability by putting the common logic in one reusable function. If the logic needs to change later, it can be updated in one place instead of several copies.

---

## Refactoring Code for Simplicity

**Milestone:** 4        
**Issue Number:** #69            
**Date:** 16/09/2026

### Common Refactoring Techniques

Common refactoring techniques include simplifying conditional logic, removing unnecessary variables or steps, extracting repeated logic into functions, improving names, and removing unnecessary complexity while keeping the same behaviour.

### Overly Complicated Example

I created a small example that determines whether a number is positive, negative, or zero. The original version used unnecessary variables, nested conditions, and extra steps for a simple decision.

![Overly complicated code](screenshots/complex-code.png)

### Refactored Version

I simplified the logic by removing unnecessary variables and nested conditions while keeping the same functionality. The refactored version is shorter and easier to understand.

![Simplified code](screenshots/simple-code.png)

### Reflection

The original code was more complex than necessary because it used extra variables, unnecessary nesting, and multiple steps to perform a simple decision.

Refactoring improved the code by making the logic more direct and readable. The simplified version is easier to understand and maintain while producing the same results as the original.

---

## Commenting & Documentation

**Milestone:** 4    
**Issue Number:** #70        
**Date:** 16/09/2026

### Best Practices

Comments should explain information that is not obvious from the code, such as why a particular approach was chosen, an important assumption, or a non-obvious piece of logic. Good documentation should help other developers understand how to use or maintain the code.

Comments should be kept clear, concise, and up to date with the code.

### Poorly Commented Example

I created a small Python example containing comments that only describe what the code is already doing. For example, comments such as "add 1 to total" or "loop through numbers" do not provide useful information because the code itself already makes these actions clear.

![Poorly commented code](screenshots/poor-comments.png)

### Improved Comments

I rewrote the comments so that they explain the reason behind the logic rather than simply repeating the code. The improved comments provide useful context while leaving straightforward operations self-explanatory.

![Improved comments](screenshots/useful-comments.png)

### Reflection

Comments are useful when they explain why something is done, provide important context, document assumptions, or clarify non-obvious logic. They can also be useful for explaining constraints or decisions that may not be clear from the code itself.

Comments should be avoided when they simply repeat what the code already says. In those cases, improving the variable names, function names, or structure of the code is usually more useful than adding more comments.

This activity showed me that good comments should add information rather than duplicate the code.

---

## Handling Errors & Edge Cases

**Milestone:** 4      
**Issue Number:** #71          
**Date:** 16/09/2026

### Error Handling and Edge Cases

Robust code should consider invalid inputs and unexpected situations instead of assuming that every input will be valid. Common strategies include validating inputs, using exceptions where appropriate, returning clear error information, and handling important edge cases.

### Guard Clauses

A guard clause checks for an invalid or exceptional condition early and returns or raises an error immediately. This keeps the main logic less nested and easier to read.

### Original Example

I created a small function that performs division without checking for invalid input. The original function could raise an error when the denominator was zero or when invalid values were provided.

![Original error handling example](screenshots/error-handling-before.png)

### Refactored Version

I added input validation and guard clauses to handle invalid values before performing the division. The refactored version provides clear error messages for invalid inputs while allowing valid calculations to continue normally.

![Refactored error handling example](screenshots/error-handling-after.png)

### Reflection

The original code assumed that all inputs were valid, which could cause the program to terminate unexpectedly when an edge case such as division by zero occurred.

Handling errors improves reliability because invalid inputs are handled explicitly instead of causing unexpected failures. The refactored version also makes the expected behavior clearer and gives more useful feedback when an invalid input is provided.

---

## Writing Unit Tests for Clean Code

**Milestone:** 4        
**Issue Number:** #72            
**Date:** 16/09/2026

### Importance of Unit Testing

Unit tests verify that individual functions behave as expected. They help detect regressions when code is changed and provide confidence that existing functionality continues to work.

Unit tests also encourage clear and focused functions because smaller functions are easier to test independently.

### Testing Framework

For this exercise, I used Python's built-in `unittest` framework. I chose it because it is included with Python and provides a simple way to organize and run tests without installing an additional package.

### Unit Test Example

I created a small `calculate_average()` function and wrote unit tests for normal input, a single value, and empty input.

![Unit tests passing](screenshots/unit-tests-passing.png)

### Testing Issues

While testing the function, I identified that an empty list could cause a division-by-zero error. I handled this case explicitly by returning `0` when no values are provided.

I then added a test for the empty-list case to make sure the function behaves correctly for that edge case.

![Unit tests including edge case](screenshots/unit-tests-edge-case.png)

### Reflection

Unit tests help keep code clean by making expected behaviour explicit and making it easier to detect problems after changes. They also encourage functions to have clear responsibilities and predictable outputs.

The main issue I found while testing was the empty-list edge case, which could cause a division-by-zero error. Adding explicit handling and a test for this case made the function more reliable and ensured that the edge case would be checked automatically in the future.