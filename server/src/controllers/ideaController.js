const Comment = require('../models/cmtModel');
const Idea = require('../models/ideaModel');
const Category = require('../models/ideaCategoryModel');
const Account = require('../models/accountModel');
const Task = require('../models/taskModel');

class ideaController {

  //Like Idea
  async like(req,res,next) {
    try {
      const idea = await Idea.findById(req.params.id);
      const currentUser = req.data._id.toString();
      const idealike = idea.likes;
      if (
        idealike.includes(currentUser)
      ) {
        return console.log("Idea already liked");
      }else{
      idea.likes.unshift( req.data._id );
      await idea.save();
      res.json(idea.likes);
      console.log("Post liked")};
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Server Error");
    }
  }


  // dislike a post 
    async dislike(req,res,next) {
      try {
        const idea = await Idea.findById(req.params.id);
        const currentUser = req.data._id.toString();
        const idealike = idea.likes;
        if (idealike.includes(currentUser) ) {
            const removeIndex = idealike
            .map((like) => like.toString())
            .indexOf(currentUser);

            idealike.splice(removeIndex, 1);
          await idea.save();
          res.json(idealike);
          console.log("Idea Unliked");
        }else {
          return console.log("Idea not been liked")
        }
        
      } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
      }
    }

  //[GET] /idea/detail/:slug
  detail(req, res, next) {
    Account.findOne({ _id: req.data._id})
    const commments = Comment.find({});
    Idea.findById({ _id: req.params.id })
      .lean()
      .populate('comments', 'content')
      .populate('account','username')
      .then((ideas) => {
        res.render('idea/detail', { ideas: ideas });
      })
      .catch(next);
  }

  //[GET] /idea/create
  async create(req, res, next) {
    const categories = await Category.find({}).lean();
    res.render('idea/create',{
      categories: categories
    });
  }

  async store(req, res, next) {
    const formData = {
      title: req.body.title,
      description: req.body.description,
      slug: req.body.slug,
      file: req.file.originalname,
      
    };

   
    // const task = await Task.findOne({ title: req.body.tasks });
    // if (!task) {
    //   return res.render('idea/create', {
    //     error: true,
    //     message: 'Task does not exist!',
    //   });
    // }


    const category = await Category.findOne({ name: req.body.ideaCategory });
    if (!category) {
      return res.render('idea/create', {
        error: true,
        message: 'Category does not exist!',
      });
    }

    formData.ideaCategory = category._id;
    const idea = new Idea(formData);
    idea.upVotes = [];
    idea.downVotes = [];
    await idea
      .save()
      .then(() => {
        res.redirect('/main/show');
      })
      .catch((error) => {
        res.send('Failed saved');
      });
  }

  //[GET] /idea/storedIdeas
  async storedIdeas(req, res, next) {
    const ideaCategory = await Category.find({});
    await Idea.find({ ideaCategory })
      .lean()
      .populate('ideaCategory', 'name', 'ideaCategories')
      .then((ideas) => {
        res.render('idea/storedIdeas', { ideas: ideas });
      })
      .catch(next);
    // res.render('idea/storedIdeas');
  }

  //[GET] /idea/:id/update
  update(req, res, next) {
    Idea.findById(req.params.id)
      .then((ideas) => {
        res.render('idea/update', {
          ideas: ideas,
        });
      })
      .catch(next);
  }

  //[PUT] /idea/:id
  updateIdea(req, res, next) {
    Idea.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect('/idea/storedIdeas'))
      .catch(next);
  }

  //[DELETE] /idea/:id
  deleteIdea(req, res, next) {
    Idea.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  //[DELETE] /idea/:id/forceDeleteIdea
  forceDeleteIdea(req, res, next) {}


  listCategory(req, res, next) {
     Category.find({ })
      .then((categories) => {
        res.render('idea/listCategory', {
          categories: categories,
        });
      })
      .catch(next);
  }
}

module.exports = new ideaController();
