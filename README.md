# m2_proj_DanHab

# Description

Find the best ski resorts in Europe and book your ski pass.

# User stories

404 - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault.
sign in - signup - As a user I want to see a welcome page that gives me the option to either sign in as an existing user, or sign up with a new account.
landing page - As a user I want to see the main product this page has to offer.
search-results - As a user I want to see the search results with accurate details about the location that I am searching for.
success - As a user I want to see a success message that confirms the booking for the ski pass.
user-profile - As a user I want to check my profile information. Also, to go back to the home page if I don't want to see the profile anymore.

GET /
renders the homepage

GET /auth/signup
redirects to / if user logged in
renders the signup form

POST /auth/signup
redirects to / if user logged in
body:
username
email
password

GET /auth/signin
redirects to / if user logged in
renders the login form

POST /auth/login
redirects to / if user logged in
body:
username
password

POST /auth/logout
body: (empty)

GET /locations
if (req.query), then we filter the list accordingly
renders the locations' list

POST /locations/:userId/create
redirects to / if user is anonymous
body:
name
location
description

GET /locations/:userId
renders all locations of the user

# Views

- layout.hbs
  \*\* AUTH
- signup.hbs
- signin.hbs
  \*\* LOCATIONS
- locations.hbs
- locations-form.hbs
- locations-user.hbs

# Models

User model
username: String
email: String
password: String
isBusiness: Boolean
skiPasses: [String]

Location model
owner: ObjectId<User>
name: String
description: String
location: String
logo: String

# Backlog

Reviews option

# Links

https://trello.com/b/PLQZBkCn/project-2

# Git

https://github.com/habibvadillo/m2_proj_DanHab

[Deploy Link]

# Slides

[Google Slides Link]
