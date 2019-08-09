const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/');
const auth = require('../../middleware/auth');
const Climb = require('../../models/Climb');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route      POST api//climbs
//@desc       Create a post
//@access      Public
router.post('/', 
    [
        auth
        , [
            check('location', 'location Is Required').not().isEmpty(),
            check('climbScore', 'climbScore Is Required').not().isEmpty()
        ]
    ], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({})
    }

    try {
    const user = await User.findById(req.user.id).select('-password');

    const newClimb = new Climb({
        location: req.body.location,
        climbScore: req.body.climbScore,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    });

    const climb = await newClimb.save();

    res.json(climb);

    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


module.exports = router;