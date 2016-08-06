'use strict'

const PORT = process.env.PORT || 8000;
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const Info = require('./models/info');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static('public'));

app.get('/',(req, res, next)=>{
  Info.getAll(function(err, infos){
    res.render('index',{title: "Message Board App", infos});
  });
})


app.route('/infos')
   .get((req, res)=>{
      Info.getAll(function(err, infos){
        res.status(err? 400 : 200).send(err || infos);
      });
   })
   .post((req, res)=>{
      Info.create(req.body, function(err){
        res.status(err? 400 : 200).send(err || "done!");
      });     
   })

app.route('/infos/:id')
   .get((req, res)=>{
      let infoId = req.params.id;
      Info.getOne(infoId, function(err, info){
        res.status(err? 400 : 200).send(err || info);
      });
   })
   .put((req, res)=>{
      let infoId = req.params.id;
      let updateObj = req.body;
      Info.update(infoId, updateObj,function(err, newInfo){
        res.status(err? 400 : 200).send(err || newInfo);
      });
   })
   .delete((req, res)=>{
      let infoId = req.params.id;
      Info.remove(infoId, err=>{
        res.status(err? 400 : 200).send(err);
      });
   });

app.listen(PORT, err=>{
  console.log(err || `Server listening on port ${PORT}`);
});