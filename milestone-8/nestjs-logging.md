# Logging and Error Handling in NestJS

**Milestone:** 8  
**Issue Number:** #27  
**Date:** 12/10/2026

## Implementation

- Installed `nestjs-pino` and `pino-http` for structured logging.
- Configured `LoggerModule.forRoot()` to enable Pino HTTP logging.
- Configured log levels based on the environment and redaction of authorization and cookie headers to reduce the risk of exposing sensitive information.
- Registered the Pino logger with the NestJS application.
- Created a custom `HttpExceptionFilter` to handle HTTP exceptions and unexpected errors.
- Registered the exception filter globally so API errors use a consistent JSON response format.
- Preserved the existing validation pipe, logging interceptor, and application modules.

![Pino logging configuration](screenshots/nestjs-logging-pino-config.png)

![Global logger and exception filter registration](screenshots/nestjs-logging-global-setup.png)

## How does `nestjs-pino` help with structured logging?

- `nestjs-pino` integrates Pino logging with NestJS and supports structured log entries.
- Structured logs record information in fields, making them easier to search, filter, and analyse.
- HTTP logging helps capture request information and investigate application behaviour.
- Configurable log levels help control the amount of logging in development and production.
- Redacting authorization and cookie headers helps reduce the risk of sensitive information appearing in logs.

![Successful request logs](screenshots/nestjs-logging-success-logs.png)

## How does global exception handling improve API consistency?

- A global exception filter handles exceptions from a central location.
- The custom filter returns a consistent JSON response containing `statusCode`, `timestamp`, `path`, and `message`.
- HTTP exceptions use their corresponding status codes.
- Unexpected exceptions return an internal server error response without exposing internal exception details to the API client.
- A consistent response format makes it easier for API clients to handle errors.

![Custom global exception filter](screenshots/nestjs-logging-exception-filter.png)

![Formatted API error response](screenshots/nestjs-logging-error-response.png)

## What is the difference between a logging interceptor and an exception filter?

- A logging interceptor runs around request handling and can record request and response information.
- An exception filter handles exceptions and controls the error response returned to the client.
- The interceptor and exception filter have different responsibilities and can be used together.
- Combining request logging with centralized exception handling helps developers investigate failed requests and understand application behaviour.

![Structured error logs](screenshots/nestjs-logging-error-logs.png)

## How does structured logging make debugging easier?

- Structured logs contain named fields such as the HTTP method, request path, status code, and error details.
- Developers can filter log entries using these fields instead of searching through unstructured text.
- Request and error information helps identify failures and investigate problems more efficiently.
- Log levels help distinguish routine application activity from errors that need attention.

## Testing and Verification

- Built the NestJS project to check for compilation errors.
- Sent a request to the root endpoint to check successful request handling.
- Sent a request to the protected `/admin` endpoint without an authorization token to test error handling.
- Inspected the server logs for request information and structured error details.

**Test results:** Replace this line with the actual build and HTTP test results before committing the report.

![Successful build](screenshots/nestjs-logging-build.png)

![NestJS server startup](screenshots/nestjs-logging-server-start.png)

![Successful API response](screenshots/nestjs-logging-success-response.png)

![Installed logging dependencies](screenshots/nestjs-logging-dependencies.png)

## Reflection

This issue helped me understand how structured logging and global exception handling improve the maintainability and debugging of a NestJS application. I learned how `nestjs-pino` provides structured logs that are easier to search and analyse, and how configurable log levels help manage application logging.

I also learned the difference between a logging interceptor and an exception filter. An interceptor can record request and response information, whereas an exception filter handles errors and returns a consistent response to the API client. Using both helps with troubleshooting while keeping error responses predictable.

Finally, implementing a global exception filter helped me understand how HTTP exceptions and unexpected errors can be handled centrally. Returning a consistent JSON response makes API behaviour easier for clients to manage, while structured error logs help developers investigate failures without exposing internal exception details to users.
