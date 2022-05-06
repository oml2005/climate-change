const PORT = 8000
// heroku port  below
//const PORT = process.env.PORT || 8000

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const articles = []

const newspapers = [
   {
      name:'thetimes',
      address:'https://www.thetimes.co.uk/environment/climate-change',
      base:''
   },
   {
    name:'theguardian',
    address:'https://www.theguardian.com/environment/climate-change',
    base:''
   }
   ,
  {
    name:'telegraph',
    //address:'https://www.telegraph.co.uk/environment/climate-change'
    address:'https://www.telegraph.co.uk/environment/',
    base:'https://www.telegraph.co.uk'
  }
]

newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
       .then(response=>{
           const html = response.data
           const $ = cheerio.load(html)
           $('a:contains("climate")',html).each(function() {
             const title = $(this).text() 
             const url = $(this).attr('href') 
             articles.push ({
                title,
                url:newspaper.base+url,
                source: newspaper.name
             })
           })
       })
})

app.get('/',(req, res) => {
    res.json("Welcome to my Climate Change API")
})

app.get('/news',(req, res) => {
    res.json(articles)
})
app.get('/tiempos',(req,res) => {
   axios.get('https://www.theguardian.com/environment/climate-change')
      .then( (response) => {
          const html = response.data
          const $ = cheerio.load(html)
          $('a:contains("climate")',html).each( function (){
             const title =  $(this).text
             const url = $(this).attr('href')
             articles.push({
                 title,
                 url
             })
          })
          res.json(articles)
      }).catch((err) =>console.log(err))
})


app.get('/news/:newspaperId',async (req,res)=>{
   console.log(req.params)
   const  newspaperId= req.params.newspaperId
   console.log('nespaperid: ',newspaperId)   // *

   const newspaperAddress = newspapers.filter(newspaper=>newspaper.name== newspaperId)[0].address
   const newspaperBase = newspapers.filter(newspaper=>newspaper.name== newspaperId)[0].base

   console.log("   looking for ",newspaperBase+newspaperAddress)  // *

   axios.get(newspaperAddress)
     .then(response=>{
         const html=response.data
         const $ = cheerio.load(html)
         const specificArticles = []    

         $('a:contains("climate")',html).each(function()  {
           const   title = $(this).text()
           const url = $(this).attr('href')
           specificArticles.push({
              title,
              url:newspaperBase+url,
              source:newspaperId
           })
         })
         res.json(specificArticles)   
    }).catch(err=>console.log(err))





})

// app.get('/news/:newspaperId', async (req, res) => {
//     const newspaperId =req.params.newspaperId
//     const newspaperAddress =newspapers.filter(newspaper=>newspaper.name==newspaperId)[0].address
//     const newspaperBase =newspapers.filter(newspaper=>newspaper.name==newspaperId)[0].base
//     console.log('id      : '+newspaperId)    
//     console.log('address : '+newspaperBase+newspaperAddress)


//      axios.get(newspaperAddress)
//     .then(  (response) =>  {
//         const html = response.data
//       //  console.log(html)
//       const $ = cheerio.load(html)
//       const specificArticles = []
//       $('a:contains("climate")',html).each(function() {
//          const title = $(this).text() 
//          const url = $(this).attr('href') 
//          speificArticles.push ({
//             title,
//             url:newspaperBase+url,
//             source: newspaperId
//          })
//       })
//       res.json(specificArticles)
//     }).catch((err)=>console.log(err))
//     //res.json(articles)
// })

app.listen( PORT, ()=> console.log(`server running on PORT ${PORT}`)   )
console.log("running...")