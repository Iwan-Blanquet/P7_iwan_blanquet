const db = require('../utils/dbconfig');
const check = require('../utils/helper');

//Create a comment
exports.createComment =(req,res,next) =>{
    let userId = req.userId
    let sql = "INSERT INTO comment (users_id,post_id,content) VALUES (?, ?, ?)";
    let query = db.query(sql,[userId,req.params.post_id, req.body.content],function (err, results,fields){
      if(err){
        throw err
      }
      res.status(200).json (results)
    })
};

// Display all comments
exports.getAllComment =(req,res,next)=>{
    let postId = req.params.post_id;
    let sql = "SELECT * FROM comment, users, post WHERE comment.post_id = ? AND post.id = comment.post_id AND comment.user_id = users.id ORDER BY comment.date_creation DESC";
    let query =db.query(sql,[postId],function(err, result){
        if(err){
          throw err
        }
        res.status(200).json (result)
      })
};

// Edit or deactivate a post if you are the user or the admin
exports.deleteOneComment = (req,res,next) => {

    check.userAllowedToEditComment(req.userId, req.params.id)
        .then(function(isAllowed) {
            db.query('DELETE FROM comment WHERE post.id=?', [req.params.id], function(err, result) {
                if (err) {
                    return res.status(500).json({error: err.message})
                }
                res.json({message: 'Commentaire supprimé.'});
            })
        })
        .catch(function(err) {
            res.status(500).json({message :"L'utilisateur n'est pas identifié comme propriétaire du commentaire , ni comme admin"})
        })
};

//Display the last comment