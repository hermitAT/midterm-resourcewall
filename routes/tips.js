/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const tipHelp = require('../db/helpers/tip-help');
// const user = require('./user');

module.exports = (db) => {


  // load tips data for an array of Tip IDs
  router.get("/", (req, res) => {

    const tipIDs = JSON.parse(req.query.tipIDs);
    //const userID = req.query.userID || null;

    tipHelp.getResourceFullData(tipIDs)
      .then(data => res.json(data))
      .catch(err => err);

  });


  // Get list of all Tip IDs in the DB
  router.get("/all", (req, res) => {

    tipHelp.getAllTipIDs()
      .then((tips) => res.json(tips));
  });


  /*
  * render 'tip' EJS page, passing thru the given tipId
  *
  */
  /*
  router.get("/:tip_id", (req, res) => {
    const tip_id = req.params.tip_id;
    const tipQueryString = 'SELECT * , r.id AS resource_id FROM resources AS r JOIN users AS u ON u.id = r.creator_id WHERE r.id = $1;';
    const commentQueryString = 'SELECT * FROM comments AS c JOIN users AS u ON u.id = c.user_id WHERE c.resource_id = $1 ORDER BY created_at DESC;';
    // @TODO Get num_likes and is_liked, is_bookmarked and display

    const tip = db.query(tipQueryString, [tip_id]);
    const comments = db.query(commentQueryString, [tip_id]);

    Promise.all([tip, comments]).then((result) => {
      const tip = result[0].rows[0];
      let comments = result[1].rows;
      if (comments) comments.map(comment => comment.created_at = tipHelp.timeAgo(comment.created_at));
      res.json({ tip_id, tip, comments });
    });
  });
  */

  router.get("/:tip_id", (req, res) => {

    const tip_id = req.params.tip_id;
    const userID = req.query.userID || null;
    Promise.all([
      tipHelp.getResourceFullData([tip_id], userID),
      tipHelp.getResourceComments([tip_id])
    ])
      .then(data => res.json(data))
  })

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bookmark routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /*
  * POST req to mark a tip as bookmarked by the active user
  *
  */
  router.post("/:tip_id/bookmark", (req, res) => {

    const values = [req.body.user_id, req.params.tip_id];

    tipHelp.setBookmark(values)
      .then(data => res.json({ success: true }))
      .catch(err => res.json({ success: false, error: err }));
  });

  /*
  * DELETE req to mark a tip as bookmarked by the active user
  *
  */
  router.delete("/:tip_id/bookmark", (req, res) => {

    const values = [req.body.user_id, req.params.tip_id];

    tipHelp.unsetBookmark(values)
      .then(data => res.json({ success: true }))
      .catch(err => res.json({ success: false, error: err }));
  });

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ like routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /*
  * POST req to add a new like boolean value to the given :tip_id
  * user_id will come from login/cookie mechanism, not hardcoded, once implemented
  */
  router.post("/:tip_id/like", (req, res) => {

    let values = [req.body.user_id, req.params.tip_id];

    tipHelp.setLike(values)
      .then(data => res.json({ success: true }))
      .catch(err => res.json({ success: false, error: err }));
  });

  /*
  * POST req to add a new like boolean value to the given :tip_id
  * user_id will come from login/cookie mechanism, not hardcoded, once implemented
  */
  router.delete("/:tip_id/like", (req, res) => {

    let values = [req.body.user_id, req.params.tip_id];

    tipHelp.unsetLike(values)
      .then(data => res.json({ success: true }))
      .catch(err => res.json({ success: false, error: err }));
  });

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ comment routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /*
  * POST req to add a new comment associated with the given :tip_id
  * user_id will come from login/cookie mechanism, not body, once implemented
  */
  router.post('/:tip_id/comment', (req, res) => {

    const values = [req.body.user_id, req.params.tip_id, req.body.comment];

    tipHelp.addComment(values)
      .then(data => {
        res.json(data)
      })
      .catch(err => res.json({ success: false, error: err }));
  });

  /*
  * (should be DELETE req) POST req to delete a comment with the selected id
  * must add user authentication !!!
  */
  router.delete('/:tip_id/comment/:id', (req, res) => {

    const values = [req.params.id, req.params.tip_id, req.body.user_id];

    tipHelp.deleteComment(values)
      .then(data => res.json({ success: true }))
      .catch(err => res.json({ success: false, error: err }));
  });

  /*
  * (should be PUT req) POST req to edit an existing comment, user can only edit the 'text' of the comment.
  * must add user authentication !!!
  */
  router.put('/:tip_id/comment/:id', (req, res) => {

    const values = [req.body.comment, req.params.id, req.params.tip_id, req.body.user_id];

    tipHelp.editComment(values)
      .then(data => res.json(data))
      .catch(err => res.json({ success: false, error: err }));
  });

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ edit/delete tip routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /*
  * DELETE req to remove a tip from the resources table
  * must add user authentication !!!
  */
  router.delete("/:tip_id", (req, res) => {

    const values = [req.params.tip_id, req.body.user_id];

    tipHelp.deleteTip(values)
      .then(data => res.json({ success: true }))
      .catch(err => res.json({ success: false, error: err }));
  });

  /*
  * PUT request to edit an existing tip, user can only edit title and description
  * must add user authentication !!!
  */
  router.put("/:tip_id", (req, res) => {
    const values = [req.body.title, req.body.description, req.params.tip_id, req.body.user_id];

   tipHelp.editTip(values)
   .then(data => res.json({ data }))
   .catch(err => res.json({ success: false, error: err.message }));
  });

  /*
  * POST request to edit an existing tip, user can only edit title and description
  * must add user authentication !!!
  */
  router.post("/", (req, res) => {
   const values = [req.body.data, req.body.title, req.body.description, req.body.type, req.body.user_id];

   tipHelp.addTip(values)
   .then(data => res.json({ data }))
   .catch(err => res.json({ success: false, error: err.message }));
  });

  return router;
};
