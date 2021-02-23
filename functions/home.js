// Libraries
const date = require('../functions/date.js')

// Models
const Cohort = require('../models/cohort.js');
const Course = require('../models/course.js');
const Fellow = require('../models/fellow.js')

// Functions
const home_page = (req, res) => {
    Cohort.find({}, (err, cohorts) => {
        res.render('./administrator/account/home/homepage.jade', {
            user: req.user,
            cohorts: cohorts,
            year: date.year
        })
    }).sort({ _id: 1 })
}

const add_new_cohort = (req, res) => {
    const { title } = req.body;
    Cohort.findOne({ "title": title }, (err, cohort) => {
        if (cohort) {
            req.flash('danger', 'Cohort already exists.')
            res.redirect("/administrator/home")
        }
        else {
            Cohort.find({},(err,cohorts)=>{
                let data = new Cohort();
                data.no =cohorts.length + 1
                data.title = title;
                data.fellows = 0;
                data.created_on = new Date();
                data.save((err) => {
                    req.flash('info', 'Cohort added successfully.')
                    res.redirect("/administrator/home")
                })
            })
          
        }
    })
}

const edit_cohort_page = (req,res)=>{
    const id = req.params.id;
    Cohort.findById(id,(err,cohort)=>{
        res.render('./administrator/account/home/edit_cohort.jade',{
            user:req.user,
            cohort:cohort
        })
    })

}

const edit_cohort_post = (req,res)=>{
   const id = req.params.id
   let query = {
       _id:id
   }
   let data = {};
   data.title = req.body.title;
   Cohort.update(query,data,(err)=>{
       req.flash('info','Cohort updated successfully.');
       res.redirect('/administrator/home')
   })
}

const delete_cohort = (req,res)=>{
    const id = req.params.id;
    Cohort.findById(id,(err,cohort)=>{
        const no = cohort.no;
        Cohort.find({},(err,cohorts)=>{
            cohorts.map((item)=>{
                if(parseInt(item.no) > parseInt(no))
                {
                    const query ={
                        _id:item.id
                    }
                    const data = {};
                    data.no = parseInt(item.no) - 1;
                    Cohort.update(query,data,(err)=>{
                        
                    })
                }
            })
        })
    })

    setTimeout(()=>{
        Cohort.findByIdAndRemove(id,(err)=>{
            Course.remove({cohort_id:id},(err)=>{
                Fellow.remove({cohort_id:id},(err)=>{
                    req.flash('danger','Cohort deleted successfully.');
                    res.redirect('/administrator/home')
                })
            })
         })
    },1500)
}

// Export Func
module.exports = {
    home_page: home_page,
    add_new_cohort: add_new_cohort,
    edit_cohort_page:edit_cohort_page,
    edit_cohort_post:edit_cohort_post,
    delete_cohort:delete_cohort
}


