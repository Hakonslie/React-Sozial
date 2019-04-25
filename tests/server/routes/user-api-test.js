const request = require('supertest');
const {app} = require('../../../src/server/app');


let counter = 0;


test("Test fail login", async () =>{

    const response = await request(app)
        .post('/api/login')
        .send({userId:'foo_' + (counter++), password:"bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(401);
});


test("Test fail access data of non-existent user", async () =>{

    const response = await request(app)
        .get('/api/user');

    expect(response.statusCode).toBe(401);
});


test("Test create user, but fail get data", async () =>{

    const userId = 'foo_' + (counter++);

    let response = await request(app)
        .post('/api/signup')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);


    //no use of cookies here, so auth fails
    response = await request(app)
        .get('/api/user');

    expect(response.statusCode).toBe(401);
});

test("Test create user and get data", async () =>{

    const userId = 'foo_' + (counter++);

    //use same cookie jar for the HTTP requests
    const agent = request.agent(app);

    let response = await agent
        .post('/api/signup')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);


    //using same cookie got from previous HTTP call
    response = await agent.get('/api/user');

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.password).toBeUndefined();
});


test("Test create user, login in a different session and get data", async () =>{

    const userId = 'foo_' + (counter++);

    //create user, but ignore cookie set with the HTTP response
    let response = await request(app)
        .post('/api/signup')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);


    //use new cookie jar for the HTTP requests
    const agent = request.agent(app);

    //do login, which will get a new cookie
    response = await agent
        .post('/api/login')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);


    //using same cookie got from previous HTTP call
    response = await agent.get('/api/user');

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.password).toBeUndefined();
});

test("Test login after logout", async () =>{

    const userId = 'foo_' + (counter++);

    //use same cookie jar for the HTTP requests
    const agent = request.agent(app);

    //create user
    let response = await agent
        .post('/api/signup')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);


    //can get info
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);


    //now logout
    response = await agent.post('/api/logout');
    expect(response.statusCode).toBe(204);


    //after logout, should fail to get data
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(401);

    //do login
    response = await agent
        .post('/api/login')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);


    //after logging in again, can get info
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);
});

// User profile testing

test("Get profile without auth", async () =>{
    const user = request.agent(app);
    let response;
    response = await user.get('/api/profile/misfoo')
    expect(response.statusCode).toBe(401)
});

test("Create user and get profile", async () => {
    const user = request.agent(app);
    const profile = {userId:'miscahooo', password:"bar", firstName: "Mis", lastName: "Foo", location: "Mars"};
    const signup = await user.post('/api/signup')
        .send(profile)
        .set('Content-Type', 'application/json');
    expect(signup.statusCode).toBe(201);

    let response = await user.get('/api/profile/misfoo')
    expect(response.body.profile === profile)


});

test("Edit user without auth", async () => {
    const user = request.agent(app);
    let response;
    response = await user.put('/api/user')
        .send({})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(401)
});

test("Create and edit user", async () =>
{
    const user = request.agent(app);
    const signup = await user.post('/api/signup')
        .send({userId:'misfoo', password:"bar", firstName: "Mis", lastName: "Foo", location: "Mars"})
        .set('Content-Type', 'application/json');
    expect(signup.statusCode).toBe(201);

    let response;
    response = await user.put('/api/user')
        .send({userId: 'misfoo', firstName: "Mass", lastName: "Faa", location: "Venus"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    //trying to edit another use too

    response = await user.put('/api/user')
        .send({userId: 'jo', firstName: "Mass", lastName: "Faa", location: "Venus"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(402);

});


// Relations testing
test("Adding user empty relation", async () => {
    const user = request.agent(app);
    const signup = await user.post('/api/signup')
        .send({userId:'misterloo', password:"bar"})
        .set('Content-Type', 'application/json');
    expect(signup.statusCode).toBe(201);

    let response;
    response = await user.post('/api/user/relations')
        .send({})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400)
});
test("delete user without userId", async () => {
    const user = request.agent(app);
    const signup = await user.post('/api/signup')
        .send({userId:'misterccooo', password:"bar"})
        .set('Content-Type', 'application/json');
    expect(signup.statusCode).toBe(201);

    let response;
    response = await user.delete('/api/user/relations')
        .send({})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(404)
});

test("delete user without auth", async () => {
    const user = request.agent(app);
    let response;
    response = await user.delete('/api/user/relations')
        .send({})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(401)
});

test("Add user without auth", async () => {
    const user = request.agent(app);
    let response;
    response = await user.post('/api/user/relations')
        .send({})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(401)
});
test("get user without auth", async () => {
    const user = request.agent(app);
    let response;
    response = await user.get('/api/user/relations')
    expect(response.statusCode).toBe(401)
});


test("Adding user relation from new user, check to see if it got added", async () => {
    const user = request.agent(app);
    const signup = await user.post('/api/signup')
        .send({userId:'misterfoo', password:"bar"})
        .set('Content-Type', 'application/json');
    expect(signup.statusCode).toBe(201);

    let response;
    response = await user.post('/api/user/relations')
        .send({userRelationId: "jo"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    response = await user.get('/api/user/relations');
    expect(response.body.relations.includes("jo"));


    // After adding and checking one relation, login other user and check for awaiting relation

    response = await user.post('/api/logout');
    expect(response.statusCode).toBe(204);

    response = await user.post('/api/login')
        .send({userId: "jo", password:"a"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    response = await user.get('/api/user/relations');
    expect(response.body.awaitingRelations.includes("misterfoo"));

    //Specific search
    response = await user.get('/api/user/relations/' + 'misterfoo');
    expect(response.body.userHasBefriendedMe).toBe(true);


    // Now, add the other user from this user
    response = await user.post('/api/user/relations')
        .send({userRelationId: "misterfoo"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

    // Check that the request is gone and it is added to the list

    response = await user.get('/api/user/relations');
    expect(response.body.awaitingRelationsLength === 0);
    expect(response.body.relations.includes("misterfoo"));

    // Delete the relation again
    response = await user.delete('/api/user/relations')
        .send({userRelationId: "misterfoo"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);

});

