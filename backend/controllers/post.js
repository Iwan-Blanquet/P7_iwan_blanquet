const db = require('../utils/dbconfig');
const fs = require('fs');
const check = require('../utils/helper');

// Créer l'objet post dans la base de donnée
exports.createPost = (req, res, next) => {
    let post = { ...req.body, };
    let sql = "INSERT INTO post (users_id, content, imageUrl) VALUES (?,?,?)";
    db.query(sql, [post.userId, post.content, post.imageUrl], function (err, result, fields) {
        if(err) {
            throw err
        }
        res.status(201).json(result)
        //res.status(201).json({ message: 'Objet enregistré !'})
    })
};


// Afficher un post
exports.getOnePost = (req, res, next) => {
    postId = req.params.id;
    let sql = `SELECT * FROM post, users WHERE post.id = ? AND post.users_id = users.id`;
    db.query (sql,[postId], function (err, results,fields){
        if(err){
            throw err
        }
        res.status(200).json (results)
    })
};

// Modifier l'objet post
exports.modifyPost = (req, res, next) => {
    // Vérification de l'userId
    check.userAllowedToEditPost(req.userId, req.params.id)
    .then(function(isAllowed) {
        const content = req.body.content;
        const imageUrl = req.body.imageUrl
        db.query('UPDATE post SET post.content, post.imageUrl WHERE post.id=?', [req.params.id], function(err, result) {
            if (err) {
                return res.status(500).json({error: err.message})
            }
            // Supprimer image
            res.json({message: 'Post modifié.'});
        })
    })
    .catch(function(err) {
        res.status(500).json({message :"L'utilisateur n'est pas identifié comme propriétaire du post"})
    });
};

// Delete a post if userOwner
exports.deletePost = (req, res, next) => {
    check.userAllowedToEditPost(req.userId, req.params.id)
    .then(function(isAllowed) {
        db.query('DELETE post WHERE post.id=?', [req.params.id], function(err, result) {
            if (err) {
                return res.status(500).json({error: err.message})
            }
            // Supprimé image
            res.json({message: 'Post supprimé.'});
        })
    })
    .catch(function(err) {
        res.status(500).json({message :"L'utilisateur n'est pas identifié comme propriétaire du post"})
    });
};

// Like a post
exports.likePost =(req,res,next)=>{
    let userId = req.userId;
    let type = "p";
    let idPost = req.params.post_id;
    // seek if a post already liked
    let sql ="SELECT * FROM likes WHERE likes.user_id = ? AND likes.post_id = ? AND likes.type ='p' "
    let query =db.query(sql,[userId,idPost],function (err, result){
      if(err){
      throw err
      }
      if(result.length === 0){ //if no like by user we create a like
        let sql2 = "INSERT INTO likes (user_id,type,post_id,value) VALUES (?,?,?,1)";
        let query =db.query(sql2,[userId, type,idPost],function (err, result){
          if(err){
            throw err
          }
        res.status(200).json (result) 
      })
  
      }else{ //If note we udpate the value of like 
        (result[0].value === 1) ? result[0].value = 0 : result[0].value = 1;
        let sql3 = `UPDATE likes 
        SET likes.value = ? 
        WHERE likes.user_id = ? 
        AND likes.post_id = ? 
        AND likes.type ='p'`;
        let query =db.query(sql3,[result[0].value,userId,idPost,type],function (err, result){
          if(err){
            throw err
          }
        res.status(200).json (result)   
      })
      }
    })
};

//Number of like on the post

// Display all post
exports.getAllPost =(req,res, next) => {
    let sql = `SELECT * FROM post ORDER BY post.date_creation DESC`;
    let query = db.query (sql, (err,result)=>{
      if(err){
        throw err
      }
      res.status(200).json (result)
    })
};

//Display all post of unique user
exports.getAllUserPost =(req,res,next) =>{
    var idUser = req.userId;
    let sql = `SELECT * FROM post, users 
      WHERE post.users_id = users.id  
      AND users.id = ? 
      ORDER BY post.date_creation DESC`
    let query = db.query (sql,[idUser], function (err, results,fields){
      if(err){
        throw err
      }
      res.status(200).json (results)
    })
};