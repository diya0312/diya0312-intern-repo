# NestJS Role-Based Authorization (RBAC)

**Milestone:** 8  
**Issue Number:** #30  
**Date:** 11/10/2026

## Objective

- Implemented Role-Based Access Control (RBAC) in a NestJS application using Auth0.
- Protected the admin endpoint so that access requires a valid access token and the appropriate role.

## Auth0 Configuration

- Created a custom Auth0 API named **Focus Bear NestJS RBAC API**.
- Configured the API audience as `https://focusbear-rbac-api`.
- Created the `admin` role and assigned it to a test user.
- Created a Post-Login Action to add assigned roles to a custom access-token claim.
- Attached the Action to the Auth0 Post-Login flow.

![Auth0 API created](screenshots/auth0-api-created.png)

![Auth0 RBAC settings](screenshots/auth0-rbac-settings.png)

![Admin role assignment](screenshots/auth0-admin-user-assignment.png)

![Auth0 Post-Login Action](screenshots/auth0-post-login-action.png)

![Auth0 Post-Login flow](screenshots/auth0-login-flow.png)

## NestJS Implementation

- Implemented a `Roles` decorator to specify the roles required by an endpoint.
- Implemented an `Auth0RolesGuard` to validate access tokens using Auth0's JWKS, verify the issuer and audience, and check the required role.
- Protected the `/admin` endpoint using the guard and `@Roles('admin')`.

![NestJS RBAC guard](screenshots/nestjs-rbac-guard.png)

![NestJS admin endpoint](screenshots/nestjs-rbac-admin-endpoint.png)

## Testing and Results

The `/admin` endpoint was tested using PowerShell.

- Request without an access token returned `401 Unauthorized`.
- Request with an invalid token returned `401 Unauthorized`.
- Request with a valid Client Credentials token without the required `admin` role returned `403 Forbidden`.
- Request using an Auth0 user access token containing the `admin` role returned `200 OK`.
- The successful response was `{"message":"Welcome, admin!"}`.

![NestJS RBAC test results](screenshots/nestjs-rbac-test-results.png)

![Successful admin-authorized request](screenshots/nestjs-rbac-admin-success.png)

![Auth0 login callback completed](screenshots/nestjs-rbac-login-completed.png)

## Reflection

- Auth0 can manage roles and include role information in access tokens using a Post-Login Action.
- The NestJS guard verifies the access token's signature, issuer, and audience before checking the required role.
- The tests demonstrated the difference between `401 Unauthorized` for missing or invalid authentication and `403 Forbidden` when an authenticated request lacks the required role.
- The Client Credentials token represented an application and did not contain the required `admin` role claim, so access was correctly denied.
- The final user-login test confirmed that an access token containing the `admin` role was accepted and the protected `/admin` endpoint returned `200 OK`.
