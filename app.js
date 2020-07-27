const express = require('express')
let path = require('path')
let morgan = require('morgan')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const blogRoutes = require('./routes/blogRoutes')

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

// blog routes
app.use(blogRoutes)

//404
app.use((req,res)=>{
    res.status(404).render('404',{title: "404"})
})

//listen to requests
app.listen(3000)