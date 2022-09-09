import express from 'express';
var router = express.Router();

/* POST users listing. */
router.post('/', async function(req, res, next) {
    try{    
        let session = req.session
        // create a new "Post" object
        let user = await req.models.User.findOne({username: session.account.username})
        let user_name = session.account.name
        if (user !== null) {
            user_name = user.name
        }

        const newPost = new req.models.Post({
            username: session.account.username,
            name: user_name,
            contact: req.body.contact,
            housing: req.body.housing,
            zipcode: req.body.zipcode,
            address: req.body.address,
            description: req.body.description,
            price: req.body.price,
            created_date: new Date()
        })

        // save the post to the database.
        await newPost.save()
        res.json({"status": "success"});
    } catch(error){
        console.log("error info:" + error);
        res.status(500).json({"status": "error", "error": error});
    }
});


/* GET users listing. */
router.get('/', async function(req, res, next) {
    // find all Posts in MongoDB database
    let allPost = await req.models.Post.find();
    let usernameChosen = ""

    // use the map function with asynchronous awaits
    let postData = await Promise.all(
        allPost.map(async post => { 
            try {
                return {
                    username: post.username,
                    name: post.name,
                    contact: post.contact,
                    housing: post.housing,
                    zipcode: post.zipcode,
                    address: post.address,
                    description: post.description,
                    price: post.price,
                    created_date: post.created_date,
                    bookmarks: post.bookmarks,
                    id: post._id
                }
            } catch(error) {
                console.log("error info:" + error);
                res.status(500).json({"status": "error", "error": error});
            }
        })
    );

    if (req.query.username) {
        usernameChosen = req.query.username
        postData = postData.filter(post => post.username === usernameChosen)
    }

    res.json(postData);
});

/* DELETE users listing. */
router.delete('/', async function(req, res, next){
  try{
    let session = req.session;
      if(session.isAuthenticated){
            let postID = req.body.postID;
            let userPost = await req.models.Post.findById(postID);
           
          if (userPost.username !== session.account.username) {
            res.status(401).json({
              status: "error",
              error: "you can only delete your own posts"
            })
          }
        //await req.models.Comment.deleteMany({post: postID})
        await req.models.Post.deleteOne({_id: postID})
                
        res.json({"status": "success"})   
  
        } else {
          res.status(401).json({
            status: "error",
            error: "not logged in"
          })
        }
        } catch(error) {
          console.log(error)
          res.status(500).json({"status": "error", "error": error})
        } 
  
  
    })

/* BOOKMARK users listing. */
router.post('/bookmark', async (req, res, next) => {
    try {
        let session = req.session;
        if (session.isAuthenticated) {
            let postID = req.body.postID;
            let curr_post = await req.models.Post.findById(postID);

            let session = req.session;
            let curr_username = session.account.username;
            
            let curr_user = await req.models.User.findOne({username: curr_username});

            if (!curr_post.bookmarks.includes(curr_username)) {
                curr_post.bookmarks.push(curr_username);
                curr_user.myBookmarks.push(curr_post.housing)
            }
        
            await curr_post.save();
            await curr_user.save();

            res.json({"status": "success"});
        } else {
            res.status(401).json({status: "error", error: "not logged in"});
        }
    } catch (error) {
        console.log("error info:", error);
        res.status(500).json({"status": "error", "error": error});
    } 
})

/* UNBOOKMARK users listing. */
router.post('/unbookmark', async (req, res, next) => {
    try {
        let session = req.session;
        if (session.isAuthenticated) {
            let postID = req.body.postID;
            let curr_post = await req.models.Post.findById(postID);

            let session = req.session;
            let curr_username = session.account.username;
            if (curr_post.bookmarks.includes(curr_username)) {
                let index = curr_post.bookmarks.indexOf(curr_username);
                curr_post.bookmarks.splice(index, 1);
            }
            
            let curr_user = await req.models.User.findOne({username: curr_username});
            if (curr_user.myBookmarks.includes(curr_post.housing)) {
            let index = curr_user.myBookmarks.indexOf(curr_post.housing);
            curr_user.myBookmarks.splice(index, 1);
        }

        await curr_post.save();
        await curr_user.save();
        res.json({"status": "success"});
    } else {
        res.status(401).json({status: "error", error: "not logged in"});
    }
    } catch (error) {
        console.log("error info:", error);
        res.status(500).json({"status": "error", "error": error});
    } 
  })

export default router;