# Dependency Injection in NestJS

**Milestone:** 6  
**Issue Number:** #43  
**Date:** 28/09/2026

## Dependency Injection in NestJS

Dependency Injection (DI) is a design pattern used by NestJS to provide a class with the dependencies it needs instead of requiring the class to create those dependencies itself.

In this example, `TasksController` depends on `TasksService`. Instead of creating the service manually with `new TasksService()`, NestJS resolves and injects the service through the controller constructor.

## Providers and `@Injectable()`

A provider is a class that NestJS can manage through its dependency injection system. Services are common examples of providers.

The `@Injectable()` decorator marks `TasksService` as a class that can be managed and injected by NestJS.

The service is then registered in the module:

    @Module({
      controllers: [TasksController],
      providers: [TasksService],
    })
    export class TasksModule {}

## How Services Are Injected into Controllers

The `TasksController` receives `TasksService` through constructor injection:

    constructor(private readonly tasksService: TasksService) {}

The controller can then call methods from the injected service:

    return this.tasksService.getTasks();

The controller does not need to create the service itself. NestJS resolves the dependency from the providers registered in the module.

## Provider Scopes

NestJS supports different provider scopes that determine how provider instances are created and reused.

### Singleton / Default Scope

The default provider scope is singleton. NestJS creates one instance of the provider and reuses it throughout the application.

This is appropriate for most services that do not need a separate instance for every request.

### Request Scope

A request-scoped provider creates a new instance for each incoming request.

This can be useful when the provider needs request-specific information or state.

### Transient Scope

A transient provider creates a new instance each time it is injected into another provider or controller.

This can be useful when separate consumers need independent instances of a provider.

## How Dependency Injection Improves Maintainability

Dependency injection separates the responsibilities of different parts of the application.

The controller is responsible for handling requests, while the service contains the task-related logic. This makes the code easier to understand and modify.

It also makes testing easier because dependencies can be replaced with mock implementations when testing a controller or service.

## How NestJS Resolves Dependencies

NestJS uses its dependency injection container to keep track of registered providers.

When a class has a dependency in its constructor, NestJS looks for a matching provider in the module's provider configuration and supplies the required instance.

In this project, the dependency flow is:

    AppModule
        |
        v
    TasksModule
        |
        +--> TasksController
        |
        +--> TasksService
                 |
                 v
           @Injectable()

`TasksController` declares `TasksService` as a constructor dependency, and `TasksModule` registers `TasksService` as a provider. NestJS then resolves and injects the service automatically.

## Reflection

Dependency injection makes NestJS applications easier to maintain because classes can focus on their own responsibilities instead of creating and managing their dependencies.

The `@Injectable()` decorator allows NestJS to manage a provider through its dependency injection system. Constructor injection makes dependencies explicit and keeps the controller loosely coupled to how the service is created.

The different provider scopes provide flexibility depending on whether an application needs shared instances, request-specific instances, or separate instances for different consumers.

## Screenshots

### Dependency Injection Architecture

![NestJS DI architecture](screenshots/nestjs-di-architecture.png)

### Tasks Endpoint

![NestJS Tasks endpoint](screenshots/nestjs-tasks-endpoint.png)