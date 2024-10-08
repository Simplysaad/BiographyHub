const express = require("express");
const router = express.Router();
const post = require("../models/Post.js");
//const user = require("../models/User.js")

const locals = {
    title: "BiographyHub | Admin"
    
}

//router.get('/admin', (req, res)=>{
    //res.send('hello world')
//})

/**
 * GET
 * ADMIN - index
 */

router.get("/admin", async (req, res) => {
    //let username = "Dr. Emily Chen"
    try {
        let myPosts = await post.find(
            //{ author: username }
        );
        res.render("pages/admin/admin_index", {
            locals,
            myPosts,
            layout: "layouts/admin"
        });
    } catch (err) {
        console.log(err);
    }
});

router.get("/admin/add-post", async (req, res) => {
    try {
        res.render("pages/admin/add_post", {
            locals,        
            layout: "layouts/admin"
        });
    } catch (err) {
        console.log(err);
    }
});



/**
 *POST
 * ADMIN -create post
 * now working perfectly 
 */

router.post('/admin/add-post',  async(req, res)=>{
  try{   
     let tags =req.body.tagString.split(',') 
    let body = req.body
      console.log(body)

      let newPost = new post(req.body)

      await newPost.save().then(
          res.redirect('/admin')
      )
    // await //post.insert({body}).then((data)=>{
        //console.log('post inserted successfully', data.tags)
        //res.redirect('/admin')
    //})

      
  }
  catch(err){
    console.log(err, 'error while inserting new post')
  }
})


/**
 * GET
 * ADMIN -edit post
 * excecuted successfully 
 */
router.get("/admin/edit-post/:id", async (req, res) => {
    try {
        let myPost = await post.find({ _id: req.params.id }).then((myPost)=>{
            res.render("pages/admin/edit_post", {
            locals,
            myPost,
            layout: "layouts/admin"
    })
            //console.log(data._id)
        })
        
        
   } catch (err) {
     console.log(err);
    }
});

/**
 * POST
 * ADMIN -edit-post
 * completed successfully 
 */
router.post('/admin/edit-post/:id', async(req, res)=>{
    try {
        
        let newPost = {
            title: req.body.postTitle,
            content: req.body.postContent
        }
      
        let updatedPost = await post.findByIdAndUpdate(req.params.id, newPost).then((data)=>{
            console.log(data, 'post updated successfully')
        res.redirect('/admin')
        })
    } catch (error) {
        console.log(error)
    }
})

/**
 * DELETE
 * ADMIN -delete post
 */



router.delete('/admin/delete-post/:id', async(req, res)=>{
    //let response = window.prompt('this will delete the post, are you sure?')

    //if(response){
        try {
            await post.findByIdAndDelete(req.params.id).then(()=>{
                res.redirect('/admin')
                console.log('post deleted successfully ')
            })
        } catch (error) {
            console.log(error)
        }
    //}
})


module.exports = router;
