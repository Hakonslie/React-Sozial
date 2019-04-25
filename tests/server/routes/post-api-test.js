const request = require('supertest');
const {app} = require('../../../src/server/app');

// Big parts are copied from https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/server/routes/post-api-test.js
// Changes made are naming and plenty of duplication of test functions to test larger amount of code

test("Test create post no auth", async () =>{
    const response = await request(app).post('/api/posts');
    expect(response.statusCode).toBe(401);
});

// Function  added by me
test("Test get post no auth", async () =>{
    const response = await request(app).get('/api/posts');
    expect(response.statusCode).toBe(401);
});
// Function  added by me
test("Test delete post no auth", async () =>{
    const response = await request(app).delete('/api/posts/5');
    expect(response.statusCode).toBe(401);
});

test("Test create post with auth", async () =>{
    const user = request.agent(app);
    const signup = await user.post('/api/signup')
        .send({userId:'post_auth_boo', password:"bar"})
        .set('Content-Type', 'application/json');
    expect(signup.statusCode).toBe(201);

    const response = await user.post('/api/posts')
        .send({user: { id: 5 }, postMessage: 'Hi there'})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);
});

// Functions added by me to test flow of post

test("Test deleting invalid post", async () => {
    const user = request.agent(app);
    const signup = await user.post('/api/signup')
        .send({userId:'post_auth_doo', password:"bar"})
        .set('Content-Type', 'application/json');
    expect(signup.statusCode).toBe(201);

    //deleting one post
    let response = await user.delete('/api/posts/' + 5);
    expect(response.statusCode).toBe(403);
});

test("Trying to delete a post I don't own", async () =>  {
    const user = request.agent(app);
    const signup = await user.post('/api/signup')
        .send({userId:'post_auth_roo', password:"bar"})
        .set('Content-Type', 'application/json');
    expect(signup.statusCode).toBe(201);

    let response;
    // post
    response = await user.post('/api/posts')
        .send({postMessage: 'Hi there'})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    let deletePostId = response.body.id;

    // Log out
    response = await user.post('/api/logout');
    expect(response.statusCode).toBe(204);

    // New user
    response = await user
        .post('/api/signup')
        .send({userId:'Veloptous_Raptor', password:"Hunter123"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    // try to delete previous post created by a different user
    response = await user.delete('/api/posts/' + deletePostId);
    expect(response.statusCode).toBe(403);

});


test("Test create posts with auth, return all posts, delete one post and return all again", async () =>{
    const user = request.agent(app);
    const signup = await user.post('/api/signup')
        .send({userId:'post_auth_foo', password:"bar"})
        .set('Content-Type', 'application/json');
    expect(signup.statusCode).toBe(201);

    let response;
    //How many posts are there?
    response = await user.get('/api/posts');
    let countOfPosts = response.body.length;

    // First post
    response = await user.post('/api/posts')
        .send({postMessage: 'Hi there'})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    // Second post
    response = await user.post('/api/posts')
        .send({ postMessage: 'Me again'})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);

    // Third post
    response = await user.post('/api/posts')
        .send({postMessage: 'Me'})
        .set('Content-Type', 'application/json');
    let deletePostId = response.body.id;
    expect(response.statusCode).toBe(201);

    // Getting all posts
    response = await user.get('/api/posts');
    expect(response.body.length).toBe(countOfPosts + 3) ;

    //deleting one post
    response = await user.delete('/api/posts/' + deletePostId);
    expect(response.statusCode).toBe(204);

    //Getting all posts again
    response = await user.get('/api/posts');
    expect(response.body.length).toBe(countOfPosts + 2) ;

});


