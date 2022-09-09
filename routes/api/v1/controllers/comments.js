import express from 'express';
var router = express.Router();

// get comments from DB 
router.get('/',  async function(req, res, next) {
    try{
      let postID = req.query.postID;
      let comments = await req.models.Comment.find({post: postID})
      res.json(comments)
    } catch(error) {
        console.log(error)
        res.status(500).json({"status": "error", "error": error})
     }
})

// posting a comment to DB
router.post('/',  async function(req, res, next) {
    try{
        let session = req.session
        if(session.isAuthenticated){
            const newComment = new req.models.Comment({
              username: session.account.username,
              comment: req.body.newComment,
              post: req.body.postID,
              created_date: new Date()
            })
            await newComment.save()
            res.json({"status": "success"})
        
        } else {
          res.status(401).json({
            status: "error",
            error: "not logged in"
          })
        }
      } catch(error){
        console.log(error)
        res.status(500).json({"status": "error", "error": error}) 
      } 
})

export default router;
