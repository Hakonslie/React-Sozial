const express = require('express');

const {loadDummyData, getPost, createPost, getAllPosts, removePost} = require('../db/posts');
const Relations = require('../db/relations');
const router = express.Router();

router.post('/posts', (req, res) => {

    if (!req.user) {
        res.status(401).send();
        return;
    }
    const post = createPost(req.user.id, req.body.postMessage);
    res.status(201).json(post)
});

router.delete('/posts/:postId', (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    let gotPostId = req.params.postId;
    const post = getPost(gotPostId);
    // idea from https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/routes/match-api.js
    if(!post) {
        res.status(404).send();
        return;
    }
    if(post.post_user_id !== req.user.id ) {
        res.status(403).send();
        return;
    }
    removePost(gotPostId);
    res.status(204).send();
});

router.get('/posts', (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    let payload = [];
    let relations = Relations.getRelationsForUser(req.user.id);
    relations.push(req.user.id);
    relations.forEach(userId => {
        (returnPostsForUser(userId).forEach(k => payload.push(k)));
    });
    res.status(200).json({length: payload.length, posts: payload});
});

router.get('/posts/:postsForUser', (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    if(req.user.id !== req.params.postsForUser) {
    if(!Relations.controlRelation(req.user.id, req.params.postsForUser)) {
        res.status(403).send();
    }
    }
    let payload = returnPostsForUser(req.params.postsForUser);
    res.status(200).json({length: payload.length, posts: payload});

});

function returnPostsForUser(userId){
    let postsFromUsers = [];
    let allPosts = getAllPosts();
    // Inspired by https://stackoverflow.com/a/53766576
    for (let [k, v] of allPosts) {
        if(v.post_user_id ===  userId) postsFromUsers.push(v)
    }
    return postsFromUsers
}

loadDummyData();
module.exports = router;
