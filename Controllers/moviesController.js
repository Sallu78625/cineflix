
const Movies = require('./../Models/movieModel');
const ApiFeatures = require('./../Utils/ApiFeatures');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const CustomError = require('./../Utils/CustomError')


exports.getHighestratedMovie= async (req,res,next)=>{
    req.query.limit=5;
    req.query.sort='rating';
    next();

}

// route hanler function
exports.getallmovie = asyncErrorHandler (async (req,res,next)=>{

      const features =  new ApiFeatures(Movies.find(),req.query).filter().sort().limitingfield().pagination();
        ///when use lte or gte url look like localhost/api/movie?rating[gte]=3
     

        const getmovie = await features.query;
   
        res.status(200).json({
            "status":"success",
            "length":getmovie.length,
            "movies":getmovie
        })


})
    
  
exports.getmovie = asyncErrorHandler (async (req,res,next)=>{

    const id = req.params.id;
    // const singlemovie = Movies.find({_id:id});
    const singlemovie = await Movies.findById(id);

    if(!singlemovie){

        const err = new CustomError('No movie found with this id',404)
        return next(err);
        
    }

    res.status(200).json({
        "status":"success",
        "movie":singlemovie
    })

  
})
  


exports.createmovie = asyncErrorHandler( async (req,res,next)=>{
    //   const testmovie = new movie;
    //   testmovie.save()
    
        const newmovie = await Movies.create(req.body);
        res.status(201).json({
            "status":"success",
            "movie":newmovie

        })
   
})
  
exports.updatemovie = asyncErrorHandler( async (req,res,next)=>{
    const id = req.params.id;

        const updatedmovie = await Movies.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});
        if(!updatedmovie){

            const err = new CustomError('No movie found with this id',404)
            return next(err);
            
        }

        res.status(201).json({
            "status":"success",
           "sata": {
                "movie": updatedmovie
            }
            
        })

})
  
exports.deletemovie = asyncErrorHandler( async(req,res,next)=>{
    const id = req.params.id ;

    const deletedmovie =  await Movies.findByIdAndDelete(id);

        if(!deletedmovie){

            const err = new CustomError('No movie found with this id',404)
            return next(err);
            
        }

        res.status(204).json({
            "status":"success",
            
        })


})

exports.getMovieStats = async (req,res)=>{
    try{
        const stats = await Movies.aggregate([
            {$match:{rating:{$gte:0}}},
            {$group:{_id:'price',
                    avgrating:{$avg:'$rating'},
                    avgprice:{$avg:'$price'},
                    minprice:{$min:'$price'},
                    totalprice:{$sum:'$price'},
                    count:{$sum:1}
             }},
            { $sort:{minprice:1}}
        ]);


        res.status(200).json({
            "status":"success",
            "length":stats.length,
           "data": {
                 stats
            }
            
        })

    }catch(err){

        res.status(404).json({
            "status":"fail",
            "message":err.message
        
        })

    }

}

exports.getMoviebyactor = async(req,res)=>{
    try{
        const actors = req.params.actors;
        const movie = await Movies.aggregate([
            {$unwind:'$actors'},
            {$group:{_id:'$actors',
                    moviecount:{$sum:1},
                    movies:{$push:'$name'}
                     },
            },
            {$addFields:{actors:'$_id'}},
            {$sort:{moviecount:-1}},
            {$match:{actors:actors}}
         ] )
        
          
        res.status(200).json({
            "status":"success",
            "length":movie.length,
           "data": {
            movie
            }
            
        })
    }catch(err){
        res.status(404).json({
            "status":"fail",
            "message":err.message
        
        })

    }


}
  