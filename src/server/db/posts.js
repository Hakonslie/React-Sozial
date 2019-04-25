const posts = new Map();

let postsIdCounter = 0;

function getPost(id){
    return posts.get(parseInt(id));
}

function createPost(userId, postMessage){
    const id = postsIdCounter;
    postsIdCounter++;

    const post = {
        id: id,
        post_user_id: userId.toLowerCase(),
        post_message: postMessage,
        post_date_time: Date.now()
    };
    posts.set(id, post);
    return post;
}

function removePost(postId){
        posts.delete(parseInt(postId));
}

function resetAllPosts(){
    posts.clear();
}

function getAllPosts() {
    return posts
}

function loadDummyData(){
    const arrayOfUsers = ["are", "jo", "xin", "bunny", "cap", "ronny", "pope"];
    let arrayOfMessages = [
        "I'm chilling in Oslo now, so nice!",
        "Getting sick of all the memes here, this page actually used to be good",
        "Had a nice day at work :)",
        "Someone kicked my door in last night.",
        "Apparently I'm moving to Bangladesh",
        "Gotta love that new episode from PewDiePie."
    ];

    // https://stackoverflow.com/questions/9035627/elegant-method-to-generate-array-of-random-dates-within-two-dates
    for(let i = 0; i < 30; i++) {

        const id = postsIdCounter;
        postsIdCounter++;
        const post = {
            id: id,
            post_user_id: arrayOfUsers[Math.floor(Math.random()*arrayOfUsers.length)],
            post_message: arrayOfMessages[Math.floor(Math.random()*arrayOfMessages.length)],
            post_date_time: new Date(+(new Date()) - Math.floor(Math.random()*10000000000))
        };
        posts.set(id, post);
    }
}

module.exports = {loadDummyData, getPost, createPost, resetAllPosts, getAllPosts, removePost};
