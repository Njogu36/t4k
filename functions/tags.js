// Libraries

const date = require('../functions/date.js')

// Models

const Tags = require('../models/tag.js')

// Functions
const tags_page = (req, res) => {
    Tags.find({}, (err, tags) => {
        res.render('./administrator/account/home/tags.jade', {
            user: req.user,
            tags: tags,
            year: date.year
        })
    })
}

const add_new_tag = (req, res) => {
    const { title } = req.body;
    Tags.findOne({ title: title }, (err, tag) => {
        if (tag) {
            req.flash('danger', 'Tag already exists.');
            res.redirect('/administrator/tags')
        }
        else {
            let data = new Tags();
            data.title = title;
            data.created_on = new Date();
            data.save(() => {
                req.flash('info', 'Tag added successfully.');
                res.redirect('/administrator/tags')
            })
        }

    })

}

const edit_tag_page = (req,res)=>{
    const id = req.params.id;
    Tags.findById(id,(err,tag)=>{
        res.render('./administrator/account/home/edit_tag.jade',{
            user:req.user,
            tag:tag
        })

    })
}

const edit_tag_post = (req,res)=>{
   const id = req.params.id;
   const {title} = req.body
   const query = {
       _id:id
   };
   const data = {};
   data.title = title;
   Tags.update(query,data,(err)=>{
       req.flash("info",'Tag updated successfully.');
       res.redirect('/administrator/tags')
   })
}

const delete_tag = (req,res)=>{
    const id = req.params.id;
    Tags.findByIdAndRemove(id,(err)=>{
        req.flash('danger','Tag deleted successfully.');
        res.redirect('/administrator/tags')
    })
}


// Export Func
module.exports = {
    tags_page: tags_page,
    add_new_tag: add_new_tag,
    edit_tag_page:edit_tag_page,
    edit_tag_post:edit_tag_post,
    delete_tag:delete_tag
}


