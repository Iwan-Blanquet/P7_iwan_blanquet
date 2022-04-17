const db = require('../utils/dbconfig');

// Check if user is admin
function userIsAdmin(userId) {
    return new Promise(function(resolve, reject) {
        db.query('SELECT isAdmin FROM users WHERE id=?', [userId], function(err, userResult) {
            if (err) {
                reject(err);
                return;
            }
            resolve(userResult[0].isAdmin ? true : false);
        });
    });
}

// Check if user is owner of post
async function userAllowedToEditPost(userId, postId) {
    const isAdmin = await userIsAdmin(userId)
    if (isAdmin)
        return true;
    
    return new Promise(function(resolve, reject) {
        db.query('SELECT user_id FROM post WHERE id=?', [postId], function(err, postResult) {
            if (err) {
                reject(err);
                return;
            }
            const post = postResult[0];
            if (!post) {
                resolve(false);
            } else {
                resolve(post.user_id == userId);
            }
        })
    });
};

//check if user is Owner of comment
async function userAllowedToEditComment(userId, commentId) {
    const isAdmin = await userIsAdmin(userId)
    console.log(isAdmin)
    if (isAdmin)
        return true;
    
    return new Promise(function(resolve, reject) {
        db.query('SELECT comment.user_id FROM comment WHERE id=?', [commentId], function(err, commentResult) {
            if (err) {
                reject(err);
                return;
            }
            const comment = commentResult[0];

            if (!comment) {
                resolve(false);
            } else {
                resolve(comment.user_id == userId);
            }
        })
    });
};


module.exports.userIsAdmin = userIsAdmin;

module.exports.userAllowedToEditPost = userAllowedToEditPost;

module.exports.userAllowedToEditComment = userAllowedToEditComment;