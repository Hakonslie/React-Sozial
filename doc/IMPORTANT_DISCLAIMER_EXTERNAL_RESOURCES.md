# Important disclaimer external resources

_This markdown file informs which parts of the project are fetched from external resources not created by me, 
in all files comments will inform which parts are written by me_

### Web Development and Api Design
All files mentioned below are copied from this repository (all code added by me is specifically commented):
https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10

#### Sign up and Login
Generic sign up and login functionality is in its entirety copied from these pages:
- `src/client/signup.jsx` _(Sign up page in frontend, further implemented in Headerbar)_
- `src/client/login.jsx` _(Login page in frontend, further implemented in Headerbar)_
- `src/client/headerbar.jsx` _(Headerbar includes login and sign up forms, login status and requests to backend)_
- `src/client/index.jsx` _(Index page checks user authentication before providing content)_
- `src/server/routes/auth-api.js` _(Name changed to user-api.js Authentication implementation, allowing auth from frontend to backend)_
- `src/server/db/users.js` _(in memory database for user storage)_
- `src/server/app.js` _(passport implementation on all api endpoints)_

#### nodeJs server
- `src/client/server.js` _(Generic server functionality for listening on port 8080)_
- `src/client/app.js` _(Provides files for frontend or routes api requests to backend, endpoints written by me are added to this)_

#### Websocket handler
- `src/server/ws-handler.js` _(Generic websocket handler impelementation copied, provides a connection and a count on active connections)_

#### React-Router Index switch
- `src/client/index.jsx` _(Index page includes a Generic react-router which routes to different parts of the page, also provides error pages on wrong URL-s)_

#### Generic blank content page
- `src/client/match.jsx` _(A lot of code has been removed and file has been renamed to content for applicability, includes a basic content page)_

#### Tests
###### Set up and Utils
- `tests/jest-setup.js` _(Creates a headless html for Jest to test frontend)_
- `tests/mytest-utils.js` _(Functionality for providing fetch methods during testing as it is only available in browser)_
###### Server tests
- `test/server/ws-handler-test.js` _(testing websocket connection, making sure counter is increased upon new connection)_
- `test/server/routes/user-api-test.js` _(testing authentication api; creating users, loggign in and out and some failing scenarios in the same context)_
###### Client tests
- `test/client/headerbar-test.jsx` _(Tests not logged in, logged in, and logging out state on Headerbar)_
- `test/client/home-test.jsx` _(Tests not logged in and logged in state on Home)_
- `test/client/login-test.jsx` _(Tests failing login and successful login)_
- `test/client/signup-test.jsx` _(Tests not logged in and logged in state on Home)_

### Other resources
Other resources like stackoverflow and react docs are used and linked to as a comment next to the code in such case.