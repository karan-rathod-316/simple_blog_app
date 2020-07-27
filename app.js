const express = require('express')
let path = require('path')
let morgan = require('morgan')
const mongoose = require('mongoose')
const Blog = require('./models/blog')

//express app
const app = express()

//connect to mongoDB
mongoose.connect('mongodb://localhost/blog', 
{ useNewUrlParser: true,
  useUnifiedTopology: true
 },
(err) => {
  console.log('Connected', err ? errr : true)
});

// register view engine
app.set('view engine', 'ejs')
//app.set('views', 'myviews')use this if the folder is other than views. It picks up views folder by default if you have named it that, if not, u have to define it manually like the example here


//middlewares
app.use(morgan('tiny'))
app.use(express.urlencoded({extended:true}))
//app.use(express.json())
app.use(express.static('public'))

//routes
app.get('/',(req,res) =>
{
res.redirect('/blogs')
})


app.get('/about',(req,res) =>
{
res.render('about',{title: "About"})
})

//blog routes
app.get('/blogs', (req,res)=>{
    Blog.find().sort({createdAt: -1})
        .then(result=>res.render('index',{title: "All Blogs", blogs:result}))
        .catch(err => console.log(err))
})

app.post('/blogs',(req,res)=>{
    const blog = new Blog(req.body)

    blog.save()
        .then(result => res.redirect('/blogs')) 
        .catch(err=>console.log('err'))
})

app.delete('/blogs/:id',(req,res) =>{
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
    .then(result=>{res.json({redirect:'/blogs'})})
    .catch(err => {console.log(err)})
})

app.get('/blogs/create',(req,res)=>{
    
    res.render('create',{title: "Create Blogs"})
})

app.get('/blogs/:id', (req, res)=>{
    const id = req.params.id;

    Blog.findById(id)
        .then(result => {
            res.render('blog-details', {blog: result, title: "Blog Details" })
        })
        .catch(err =>{
            console.log(err)
        });
    });

//404
app.use((req,res)=>{
    res.status(404).render('404',{title: "404"})
})

//listen to requests
app.listen(3000)