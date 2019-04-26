# Readme

##### External resources disclaimer
_Please make sure you have seen [External resources disclaimer](doc/IMPORTANT_DISCLAIMER_EXTERNAL_RESOURCES.md)_

### How to run

* `yarn install`
* `yarn build`
* `yarn start`

You will find the server at http://localhost:8080

### Dummy data included:
- Program has 7 users: Are, Xin, Jo, Bunny, Cap, Ronny, Pope
- All users passwords are "a"
- Xin is friends with Are and Jo
- Bunny has sent friend requests to everyone, but has no friends
- All 7 users have a random number of posts. There are total of 6 premade posts that are randomly distributed 30 times, duplicated might occur


### Tasks done for exam
- **Test Coverage: 52.09%**

- **Core functionality missing: Chat and auto-updated posts**

1. ~~When the application starts, you must have some existing fake/test data representing valid users~~
2. ~~Should be possible to register new users.~~
3. ~~Each user should have a page displaying his/her information (e.g., name, surname, date of birth and location).~~
4. ~~A user should be able to post new messages on his/her “timeline”, which should be displayed in chronological order together in the same page with the user’s info~~.
5. ~~Should be possible to search for existing users.~~ 
6. ~~Users can send “friendship” requests to other users. This latter will decide whether to accept it or not.~~ 
7. ~~Two friends can see each other timeline / user-details, but not the ones of the other users they are not friend with~~
8. ~~The home of a user will be the merged timeline of all of his/her friends, in chronological order,~~ updated in real-time (e.g., using WebSockets).
9. Should have a live-chat (using WebSockets) for friends.  
10. When a message contains a URL (e.g., link to an external web page), that should be displayed as an actual clickable link. Pay particular attention to the security aspects of having such a functionality. 

### Struggles:
- I struggled with case-sensitivitiy in routing with parameters, and had to save userIds as lowercase because of this.
- I struggled a lot with componentWillReceiveProps() as the function did not properly update page as I wanted it to. (this is also a consequence of the next struggle)
- I rushed through the project too fast and should have spent more time defining Components and Child Components to have control of the state flow, after a while I totally lost control of this. And when I got the the point where I wanted to implement websockets I didnt have time
- I had fun implementing bonus functionality before I had finished the core functionality, e.g ability to delete posts on profile page, ability to edit profile
- I probably spend too much time on design
- I have not implemented any extra libraries other than what we have used in class, if I had been better prepared this might have eased big parts of the task for me.
- I struggled a lot with logging out and in, in the process of trying not to share the user's password I was deleting the locally stored password. I figured it out though

### Grade prediction
As I have not been able to implement Websockets for chat or posts I could expect to get a C, however I do have websockets for counting current connections. I time on other functionality. 
If the importance of the chat and auto-updated post functionality is not as critical then I should get a B; considering I have more functionality, tests, UI and a good restful API.

---

## Structure, Implementation and Technology

### Implementation and Technology

#### Websocket
Websockets is used to present total users connected at any time

##### Passport
The project uses passport for login and user authentication, it is easy to implement and combine with other technologies. Plus it works absolutely amazing next to express

##### Express Node.js
Express node.js is an amazing backend for handling static React files and API-s at the same time. It is predictable and fun to use. Many things are self explanatory and resources online are easily found.

##### React
React is used as a SPA on the frontend, React is also comfortable and predictable, I have far from exploited the potential of react in this project, but scraped upon it. This project itself has specific potential on creation of components and child components.

##### Concurrently and nodemon
These are two amazing libraries for allowing fast development as it will listen to changes in both frontend and backend and restart the server if necessary

##### Enzyme and Jest
Enzyme and Jest provides a headless browser that allows easy testing of frontend applications

##### Deployment
Project is deployed on http://sozial-media.herokuapp.com/

### Structure

##### Frontend
The page is built at **Index** with a headerBar that handles login, signup and logout. Furthermore it uses react router to load components depending on the URI sent.
It passes the user.id of the passport-validated user downwards through the components. There are not any deeper levels than that

**Profile page** reads the paramater from the url and presents the profile of the user, depending on the relation between the visiting
user and the owner of the page the posts will be display. There is a small text on the bottom right to see friend status and potentially change it. At profile page user can also
change personal information and write new posts

**Home page** is loaded first and gets all the posts available to the logged in user (depending on which users have befriended him). The homepage
also has a list of users on the page and a search field to find users. 

##### Backend
At backend `app.js` handles the basic passport implementation and routes api requests onwards to **post-api.js** and **user-api.js**.
user.api.js further provides user creation, login, changes to api and opens API to get public profiles of all users. It also provides all userIds
for the searchbar at homepage. user-api.js also provides API-s to configure relations between users. post-api.js provides API-s for reading, creating and deleting posts.

**Handling relations**

Relations are stored in an array as a String: "{userId}"|"{relationalUserId}. So I can find all relations for one user by matching with "userId|". I have another array in the
same context called awaitingRelations which contains all friend requests. When profile page is loaded both are fetched to be able to show correct posts and
also to be able to show friend requests

**Handling posts and users**

Posts and Users are stored in Maps with Key being id and value being respective object.

**Restful API**

User-specific:
- `/api/login`
- `/api/logout`
- `/api/signup`
- `/api/user` (PUT, GET) - change or get specific user
- `/api/users `(GET) - get all usersIds
- `/api/user/relations` (GET, DELETE, POST)
- `/api/user/relations/{relationToUserId}` (getRelation between current user and relationToUserId)
- `/api/profile/{profileId}` (get public profile of user for profile page)

Post-specific:
- `/api/posts` (GET, POST) GET returns all available posts for user, POST creates new user
- `/api/posts/{postId}` (DELETE) Delete post
- `/api/posts/{postsForUser}` (GET) - provides posts from specific user if available to requesting user
