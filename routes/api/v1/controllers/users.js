import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/myIdentity', (req, res, next) => {
    let session = req.session
    if(session.isAuthenticated){
      res.send({
        status: "loggedin", 
        userInfo: {
           name: session.account.name, 
           username: session.account.username
          }
     });
    } else {
      res.send({status: "loggedout"})
    }
});

router.get('/', async (req, res, next) => {
  let allUsers = await req.models.User.find()
  res.json(allUsers)
})

/* GET users bookmarked listing. */
router.get('/myBookmarkedPosts', async function(req, res, next) {
  try {
      let username = req.query.username;
      let users = await req.models.User.find({username: username})
      res.json(users)
  } catch(error){
      console.log("error info:", error);
      res.status(500).json({"status": "error", "error": error});
  }  
});

/* POST user info */
router.post('/', async (req, res, next) => {
  try {
    let session = req.session

    let user = await req.models.User.findOne({username: session.account.username})

    if (user === null) {
      let newUser = new req.models.User({
        username: session.account.username,
        name: req.body.name, 
        email: session.account.username
      })
  
      await newUser.save()
    } else {
      user.name = req.body.name

      await user.save()
    }

    res.json({status: 'success'})
  } catch (error) {
    console.log(error);
    res.type('json');
    res.status(500).json({ "status": "error", "error": error })
  }
});

export default router;