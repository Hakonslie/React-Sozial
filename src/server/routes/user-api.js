const express = require('express');
const passport = require('passport');

const Users = require('../db/users');
const Relations = require('../db/relations');

const router = express.Router();

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(204).send();
});

router.post('/signup', function (req, res) {
    const created = Users.createUser(req.body.userId, req.body.password, req.body.firstName, req.body.lastName, req.body.location);
    if (!created) {
        res.status(400).json("Can not create user, try another username");
        return;
    }
    passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
            if (err) {
                //shouldn't really happen
                res.status(500).send();
            } else {
                res.status(201).send();
            }
        });
    });
});

//  Having huge issues with logout / login. can't log in again after accessing profile page and logging out

router.post('/logout', function (req, res) {
    req.logout();
    res.status(204).send();
});

router.put('/user', function (req, res) {
    if(!req.user) {
        res.status(401).send();
        return;
    }
    if(req.user.id !== req.body.userId) {
        res.status(402).send();
        return;
    }
    let userId = req.user.id;

    if(Users.updateUser(userId, req.body.firstName, req.body.lastName, req.body.location)) res.status(204).send(); else res.status(500).send();

});

// Maybe bad API design: Had to use the /api/users for getting all users
router.get('/users', function (req, res) {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    res.status(200).json( {
        users: Users.getAllUserIds()
    })

});

router.get('/user', function (req, res) {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    res.status(200).json({
            id: req.user.id,
        }
    );
});



router.get('/profile/:profileId', function (req, res) {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    let gotProfileId = req.params.profileId;
    const publicProfile = Users.getPublicProfile(gotProfileId);
    // idea from https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/routes/match-api.js
    if(!publicProfile) {
        res.status(404).json({message: gotProfileId + " not found!"});
        return;
    }
    res.status(200).json(publicProfile);
});

// RELATIONS API




//Get all friends status
router.get('/user/relations', function (req, res) {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    let payloadRelations = Relations.getRelationsForUser(req.user.id);
    let payloadAwaitingRelations = Relations.getAwaitingRelationsForUser(req.user.id);
    res.status(200).json({
        relationsLength: payloadRelations.length,
        awaitingRelationsLength: payloadAwaitingRelations.length,
        relations: payloadRelations,
        awaitingRelations: payloadAwaitingRelations
    });
});
// Get status of one friend
router.get('/user/relations/:relationToUser', function (req, res) {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    let gotRelationId = req.params.relationToUser;
    let userId = req.user.id;

    let userBefriendedMe = false;
    let iBefriendedUser = false;
    if(Relations.getRelationsForUser(gotRelationId).includes(userId)) userBefriendedMe = true;
    if(Relations.getRelationsForUser(userId).includes(gotRelationId)) iBefriendedUser = true;
    res.status(200).json({userHasBefriendedMe: userBefriendedMe, iBefriendedUser: iBefriendedUser});


});
//Remove friend
router.delete('/user/relations', function (req, res) {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    let gotUserId = req.user.id;
    let gotUserRelationId = req.body.userRelationId
    if(!gotUserId || !gotUserRelationId) {
        res.status(404).send();
        return;
    }

        Relations.removeRelation(gotUserId, gotUserRelationId);

    res.status(204).send();
});
//Add friend
router.post('/user/relations', function (req, res) {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    let currentUserId = req.user.id;
    let userRelationId = req.body.userRelationId;
    if(currentUserId === undefined || userRelationId === undefined) {
        res.status(400).send();
        return;
    }

    if(! currentUserId || !userRelationId ) {
        res.status(404).send();
        return;
    }

    Relations.addRelation(currentUserId, userRelationId);

    res.status(204).send();

});

Users.loadDummyData();
Relations.loadDummyData();

module.exports = router;
