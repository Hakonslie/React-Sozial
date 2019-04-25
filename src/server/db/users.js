const users = new Map();

function getUser(id){
    return users.get(id.toLowerCase());
}

function verifyUser(id, password){
    const user = getUser(id.toLowerCase());
    if(user === undefined){
        return false;
    }
    return user.password === password;
}


//ADDED by me: @Param firstName, lastName and location added by me
//ADDED by me: Also added to user objects
function createUser(id, password, firstName, lastName, location){
    if(getUser(id.toLowerCase()) !== undefined ){
        return false;
    }
    const user = {
        id: id.toLowerCase(),
        password: password,
        user_name_first: firstName,
        user_name_last: lastName,
        user_location: location,
    };
    users.set(id.toLowerCase(), user);
    return true;
}

// ADDED by me: For presentation on profile page
function getPublicProfile(userId) {
    const user = getUser(userId.toLowerCase());
    return { id: userId, user_name_first: user.user_name_first, user_name_last: user.user_name_last, user_location: user.user_location};
}

// ADDED by me: updateUser() method added
function updateUser(updateUserId, firstName, lastName, location) {
    let updateUserObject = users.get(updateUserId);
    updateUserObject.user_name_first = firstName;
    updateUserObject.user_name_last = lastName;
    updateUserObject.user_location = location;
    users.set(updateUserId, updateUserObject);

    let updatedUser = getUser(updateUserId);

    return updatedUser.user_name_first === firstName && updateUserObject.user_name_last === lastName && updateUserObject.user_location === location;
}

function resetAllUsers(){
    users.clear();
}

// ADDED by me: getAllUsers()
function getAllUsers() {
    return users
}
// For search engine
function getAllUserIds() {
    let arrayOfKeys = [];
    for(keys of users.keys()) {
        arrayOfKeys.push(keys)
    }
    console.log(arrayOfKeys);
    return arrayOfKeys
}


// ADDED by me: Dummy data
function loadDummyData(){
    createUser("Jo", "a", "Johnny", "Bravo", "New York");
    createUser("Are", "a", "Are", "Kvalmø", "Oslo");
    createUser("Xin", "a", "Xinao", "Donkey", "Tokyo");
    createUser("Bunny", "a", "Bun", "hun", "Tokyo");
    createUser("Cap", "a", "sda", "Punk", "Cph");
    createUser("Ronny", "a", "Ton", "Donkey", "Tokyo");
    createUser("Pope", "a", "Dert", "Vra", "Teyg");
}

module.exports = {loadDummyData, getPublicProfile, getUser, verifyUser, createUser, resetAllUsers, updateUser, getAllUserIds};
