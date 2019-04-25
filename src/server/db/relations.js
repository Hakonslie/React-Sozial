let relationsArray = [];
let awaitingRelationsArray = [];

function getRelationsForUser(userId){
    let gotRelations = relationsArray.filter(r => r.startsWith(userId + "|"));
    return gotRelations.map(l => l.replace((userId + "|"), ""))
}
function controlRelation(userId, requestedUserId) {
    return getRelationsForUser(requestedUserId).includes(userId);
}

function getAwaitingRelationsForUser(userId){
    let gotAwaitingRelations = awaitingRelationsArray.filter(r => r.startsWith(userId + "|"));
    return gotAwaitingRelations.map(l => l.replace((userId + "|"), ""))
}

function addAwaitingRelations(userId, relationUserId){
    if(awaitingRelationsArray.includes(userId + "|" + relationUserId)) return 400;
    // Add
    awaitingRelationsArray.push(userId + "|" +relationUserId);

}
function addRelation(userId, relationUserId){

    // Search if already exists
    if(relationsArray.includes(userId + "|" + relationUserId)) return 400;
        // Add
    relationsArray.push(userId + "|" +relationUserId);

    if(getAwaitingRelationsForUser(userId).includes(relationUserId)) {
        removeAwaitingRelation(userId, relationUserId)
    }

    if(!getRelationsForUser(relationUserId).includes(userId)){
        addAwaitingRelations(relationUserId, userId)
    }
    // Remove awaiting relation

}
function removeAwaitingRelation(firstId, secondId){
    awaitingRelationsArray = awaitingRelationsArray.filter(v => v !== firstId+"|"+secondId && v !== secondId+"|"+firstId);
}
function removeRelation(firstId, secondId){
    relationsArray = relationsArray.filter(v => v !== firstId+"|"+secondId && v !== secondId+"|"+firstId);
}

function loadDummyData(){
    addRelation("jo", "xin");
    addRelation("are", "xin");
    addRelation("xin", "jo");
    addRelation("xin", "are");
    let arrayOfUsers = Array("cap", "ronny", "jo", "are", "xin", "ronny", "pope");
    arrayOfUsers.map(v => addRelation("bunny", v));
}



module.exports = {controlRelation, loadDummyData, addRelation, removeRelation, getRelationsForUser, getAwaitingRelationsForUser};
