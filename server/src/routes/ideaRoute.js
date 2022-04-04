const express = require('express');
const router = express.Router();
const IdeaController = require('../controllers/ideaController');
const FileUpload = require('../middlewares/fileUpload');
const SendEmail = require('../middlewares/sendEmail');
const AuthJwt = require('../middlewares/authJwt');
const cmtController = require('../controllers/commentController');
const Idea = require('../models/ideaModel');
const { check, validationResult } = require('express-validator');

router.get('/detail/:id', [AuthJwt.checkLogin], IdeaController.detail);
router.get('/storedIdeas', [AuthJwt.checkLogin], IdeaController.storedIdeas);
router.get('/create', [AuthJwt.checkLogin], IdeaController.create);
router.post(
  '/store',
  AuthJwt.checkLogin,
  FileUpload.single('file'),
  SendEmail.send,
  IdeaController.store,
);
router.get('/:id/update', [AuthJwt.checkLogin], IdeaController.update);
router.put('/:id', [AuthJwt.checkLogin], IdeaController.updateIdea);
router.delete('/:id', [AuthJwt.checkLogin], IdeaController.deleteIdea);
router.delete(
  '/:id/force',
  [AuthJwt.checkLogin],
  IdeaController.forceDeleteIdea,
);
router.post('/:id/comment', cmtController.create);
router.get('/listCategory', IdeaController.listCategory);


//like function
router.put('/detail/:id/like', [AuthJwt.checkLogin], IdeaController.like);
//   try {
//     const idea = await Idea.findById(req.params.id);
//     const currentUser = req.data._id.toString();
//     const idealike = idea.likes;
//     if (
//       idealike.includes(currentUser)
//     ) {
//       return console.log("Idea already liked");
//     }else{
//     idea.likes.unshift( req.data._id );
//     await idea.save();
//     res.json(idea.likes);
//     console.log("Post liked")};
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json("Server Error");
//   }
// });
//dislike funtion
router.put('/detail/:id/dislike',[AuthJwt.checkLogin],IdeaController.dislike)
//   try {
//     const idea = await Idea.findById(req.params.id);
//     const currentUser = req.data._id.toString();
//     const idealike = idea.likes;
//     if (idealike.includes(currentUser).length === 0) {
//       return res.status(400).json({ msg: "Post has not yet been liked" });
//     }
//     const removeIndex = idealike
//       .map((like) => like)
//       .indexOf(currentUser);
//       idealike.splice(removeIndex, 1);
//     await idea.save();
//     res.json(idea.likes);
//     console.log("Post Unliked");
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json("Server Error");
//   }
// });






module.exports = router;
