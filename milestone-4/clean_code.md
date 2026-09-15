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