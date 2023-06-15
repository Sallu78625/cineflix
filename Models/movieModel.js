const mongoose = require('mongoose');

const fs = require('fs');
const validator = require('validator');
const movieschema = new mongoose.Schema({
    name:{type:String,
    required:[true,"name is required"],
    unique:true,
    maxlength:[100,"movie must not greater than 100 char"],
    minlength:[4,"movie must not less than 4 char"],
    validate:[validator.isAlpha,"only char allowed"],
    trim:true
    },
    description:{type:String,
    required:[true, "desc is required"],
    trim:true
    },
    duration:{
      type:Number,
      required:[true,"duration is required"]
    },
    ratings:{
      type:Number,
      //custome validator
      validate:{validator:function(value){
        return value >=1 && value <= 10;
      },
    message:"rating is not valid"},
      // min:[1,'min rating shoul be greater 1'],
      // max:[10,'min rating should be less 10'],
      default:1.0
    },
    totalRating:{
      type:Number
    },
    releaseYear:{
      type:Number,
      required:[true,"release year is required"]
    },
    releaseDate:{
      type:Date,

    },
    createdAt:{
      type:Date,
      default:Date.now()
    },

    genres:{
      
      type:[String],
      enum:{
        values:['action','sci-fi','romantic','love'],
        message:"this genres doesnt exist"
      },
      required:[true,"genres is require"]
    },

    directors:{
      type:[String],
      required:[true,"director is required"]
    },

    coverImage:{
      type:String,
      required:[true,"cover image is required"]
    },

    actors:{
      type:[String],
      required:[true,"actors is required"]
    },

    price:{
      type:Number,
      required:[true,"price is required"]
    }

  },{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  });

 movieschema.virtual('durationinhous').get(function(){
  return this.duration/60;
 })
  
movieschema.pre('save',function(next){
  //this efer to document that will get saved
  this.createby="salman";
  next();
})

movieschema.post('save',function(doc,next){
  // this refer to last ocument created
  const data = `data created by ${doc.createby}/n`;
  fs.writeFileSync('./log.txt',data,{flag:'a'},(err)=>{
    console.log(err.message)
  })
  next();
})

movieschema.pre('find',function(next){
  this.find({releaseDate:{$lte:Date.now()}});
  this.starttime = Date.now();
  next();
})

movieschema.post(/^find/,function(doc,next){
  this.find({releaseDate:{$lte:Date.now()}});
  this.endtime = Date.now();

  const content = `query took ${this.entime - this.starttime}/n`;
  fs.writeFileSync('./log.txt',content,{flag:'a'});
  next()
})
movieschema.pre('aggregate',function(next){
 console.log( this.pipeline().unshift({$match:{releaseDate:{$gte:new Date()}}}));
next()
})

  const  Movie = mongoose.model('movie',movieschema);
  
  module.exports = Movie;