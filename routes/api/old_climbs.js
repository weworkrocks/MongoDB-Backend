const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/');
const auth = require('../../middleware/auth');
const Climb = require('../../models/OLD_Climb');
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


//@route     Get api/climbs  Gets ALl CLimbs
//@desc      GET all
//@access    Private

router.get('/', auth,  async (req, res) => {
    try{
        const climbs = await Climb.find().sort({ date: -1});
        res.json(climbs)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


//@route     Get api/climbs/:user  Gets Single CLimb
//@desc      GET all
//@access    Private
router.get('/:user', auth,  async (req, res) => {
    try {
        console.log
        // const climb = await Climb.findById(req.user);
        // console.log('test', req.user)
        // const climb = await Climb.findById(req.user)
        // const climb = await Climb.findById(req.params.user)
        const climb = await Climb.find({'user':req.user.id})
        

        if(!climb){
            return res.status(404).json({msg: 'Climb Not Found 1'});
        }
        
        res.json(climb)
    } catch (err) {
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'CLimb Not Found 2'})
        }
        res.status(500).send('Server Error')
    }
});

//@route     Get api/climbs/:user/:averages
//@desc      GET all
//@access    Private
router.get('/score/:usersum', auth,  async (req, res) => {
    try {
    
        const climb = await Climb.find({'user':req.user.id})
        sum = 0;
        counter = 0;
        climb.map( socre => {
            sum += socre.climbScore;
            counter +=1;
        })
        climbAverage = Math.round(sum/counter);


        if(!climb){
            return res.status(404).json({msg: 'Climb Not Found 1'});
        }
        
        res.json(climbAverage)
    } catch (err) {
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'CLimb Not Found 2'})
        }
        res.status(500).send('Server Error')
    }
});



module.exports = router;