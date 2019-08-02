const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult }  = require('express-validator');

//@route GET    api/profile/me
//@desc Test    get current user profile
//@access       Private
router.get('/me', auth, async (req, res )=> {

    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }

    } catch(err){
        console.error(err.message);
        res.status(500).send("Server Error")
    }
    
});

//@route        Post api/profile/
//@desc         Create or update user profile
//@access       Private

router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status is required')
                .not()
                .isEmpty(),
                check('location', 'location is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            status,
            bio,
            age,
            height,
            location,
            youtube,
            twitter,
            facebook,
            instagram
        } = req.body
    
        //build profile object
        const profileFields = {}
        profileFields.user = req.user.id;
        if(status) profileFields.status = status;
        if(bio) profileFields.bio = bio;
        if(age) profileFields.age = age;
        if(height) profileFields.height = height;
        if(location) profileFields.location = location;


        //Build social objects
        profileFields.social = {}
        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(facebook) profileFields.social.facebook = facebook;
        if(instagram) profileFields.social.instagram = instagram;



        try {
            let profile = await Profile.findOne({ user: req.user.id })

            if(profile) {
                //Update
                profile = await Profile.findByIdAndUpdate( 
                    { user: req.user.id },
                    { $set: profileFields },
                    {new: true }
                    );

                    return res.json(profile);
            }

            //Create a Profile

            //this is an instance of the model
            profile = new Profile(profileFields);
            
            await profile.save();
            res.json(profile);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }

    }
)


//@route GET    api/profile
//@desc Test    Get all Profiles
//@access       public

router.get('/', async (req, res) => {
    try{
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
})

//@route GET    api/profile/user/:user_id
//@desc Test    Get all Profiles
//@access       public

router.get('/user/:user_id', async (req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
      

        if(!profile) return res.status(400).json({ msg: 'Profile Not Found'})

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile Not Found'})
        }
        res.status(500).send('Server Error');

    }
})

//@route GET    DELETE api/profile
//@desc Test    Get profile, user & posts
//@access       Private

router.delete('/', auth, async (req, res) => {
    try{
        //Removes Profile
        await Profile.findOneAndRemove({ user: req.user.id});

        //remove user
        await Profile.findOneAndRemove({ _id: req.user.id})
        
        res.json({msg: "User Deleted"});
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
})








module.exports = router;