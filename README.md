
# Atom Challenge - Frontend
Hello, everybody 👋🏻
This a frontend web application built with Angular 16 for the asked challenge from [Atom](https://atomchat.io/) ([see more](https://github.com/ffedelefrsf/AtomChallenge)). 
To summarize, it's simply a website that will allow you to authenticate and store your own set of Tasks (TO-DO list with title, description and pending/completed status).
Nevertheless, I put all my effort in good practices, I kept the app simple but fulfilling. The only missing thing here is Unit Testing with Karma and Jasmine, but I decided not to do it since the scope of the challenge is already widely exceeded.

## Project structure

So, for this solution - that was completely optional by the way - I came accross with a well responsability separated architecture, using layers once again, so inside the project source (`/src`), you will find these folders:
 - **components**: this one refers to all the global useful components, in this particular case only header and footer. But we could have in here something like a custom built-in table component that we know for sure we are going to use in several different places within the project for example. You will see this folder nested inside screens to define more specific components.
 - **guards**: well, this is self-explainatory lol. In here I have the authentication guard that will affect only to the home page in this app. Because I only have home and login screens, but if I'd have more, those would be affected by this guard as well for sure-
 - **interceptors**: every interceptor you may want to add. In this case I only built an http interceptor in order to add the current session token to headers to every request the user performs.
 - **model**: here we have the objects that affect the whole app I/O, in this particular case we only have the common response interface. But you will see this folder nested inside screens to define more specific models.
 - **screens**: in this one I'll have every single route that I defined within the app, in this case home and login. Inside these, you have their components, model, services (will be explained below), resolvers (will be explained below as well) and finally the core component with its own HTML, SCSS, TS and SPEC.TS (unrelevant in this project as I said at the very beginning).
 - **services**: interfaces to deal with external sources, in this web app I had two external services. One of them, Firebae Auth to authenticate users and the other one, my backend application for Tasks.
 - **resolvers**: sets of data to be preloaded for a certain component. In this particular app, the only use case was the process of getting all the existing tasks for the current user. So, before home component is loaded, this fetch will be executed while a loading spinner is showed to the user.
 - **utils**: useful modules that do not belong to the others. In this app we have two, an enum for all the defined routes, and a common function to show the Angular Material Snackbar, it's preferred to have this centralized in one open/closed module function, so I don't have to repeat several times the same information like the title of the close button or the duration of the snackbar; in this way, the app will be more maintainable.

Besides all this, I want to mention the distributed routes. Explicitily separating authenticated from non-authenticated routes, applying guards and children when it's needed and also defining parent components, creating a controlled and isolated structure.

Also, I made use of the traditional [Angular Material](https://material.angular.io/) for Angular Apps with a custom theme with similar colors as the ones from the requesting company.

Another point that maybe is worth to mention is the fact I didn't need to use global stores like Redux Persist, Redis or similar since Firebase Admin Auth keeps credential tokens in cookies, so the session is kept until token expires; and once I have that in the client side, I got access to every single detail of the current session and user, so no need to save it.

## Distribution

In order to allow the people from Atom to access and actually test my challenge solution, I distributed this web app and the corresponding backend using Firebase Hosting, here is the [link](https://atom-challenge-f2f3d.web.app/).
As you will see, there is no way to register new users, here are two reasons why:

 1. Challenge scope
 2. Blaze plan purchased in Firebase for the project, I don't want it to get flooded with users. Again, it's just a simple challenge.

After that said, here you have two users to access the app:
**User 1**
 - Username: test1@faustofedele.com
 - Password: test1!

**User 2**
 - Username: test2@faustofedele.com
 - Password: test2!