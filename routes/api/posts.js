const express = require('express');
const router = express.Router();
const { check, validationResult }  = require('express-validator');
const auth = require('../../middleware/auth')
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route GET    api/post
//@desc Test    route
//@access       Public
router.post("/", [auth, [
    check('text', 'Text is required').not().isEmpty()
] ], 
    async (req, res ) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post ({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })

            const post = await newPost.save();
            res.json(post);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }


});


//@route        Get api/post
//@desc Test    route
//@access       Private
router.get('/', auth, async (req, res) => {
    try{
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


//@route        Get api/posts/:id
//@desc Test    route
//@access       Private
router.get('/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ msg: 'Post Not Found'});
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
})



//@route        DELETE api/post
//@desc Test    route
//@access       Private
router.delete('/:id', auth, async (req, res) => {
    try{
        const posts = await Post.findById(req.params.id);

        //check if post exists

        if(!post){
            return res.status(404).json({ msg: 'Post Not Found' });
        }

        //check user
        if(post.user.toString !== req.user.id) {
            return res.status(401).json({ msg: 'User Not Authorized'})
        }

        await post.remove();

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
});

//@route GET    api/post
//@desc Test    route
//@access       Public
router.post("/", [auth, [
    check('text', 'Text is required').not().isEmpty()
] ], 
    async (req, res ) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post ({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })

            const post = await newPost.save();
            res.json(post);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }


});

//@route GET    api/post/comment/:id
//@desc Test    route
//@access       Public
router.post("/comment/:id", [auth, [
    check('text', 'Text is required').not().isEmpty()
] ], 
    async (req, res ) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }

            post.comments.unshift(newComment);

            await post.save();
            res.json(post.comments);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }


});

//@route GET    DELETE/post/comment/:id/:commit_id
//@desc Test    route
//@access       Public
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);

        //Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        if(!comment){
            return res.status(404).json({ msg: 'comment does not exist'})
        }

        //Check User
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'User not Authorized' });
        }

        //Get remove index
        const removeIndex = post.comments
            .map(comment  => comment.user.toString())
            .indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save()

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
            res.status(500).send("Server Error")
    }
})



module.exports = router;