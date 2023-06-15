class ApiFeatures{
    constructor(query,querystr){

        this.query = query;
        this.querystr = querystr;

    }

    filter(){
        let querystrng = JSON.stringify(this.querystr);


        querystrng = querystrng.replace(/\b(gt|gte|lte|lt)\b/g,(match)=>{
           return `$${match}`;
        })

        const queryobj = JSON.parse(querystrng);

        //advanvce filtr by mongoose
        // const getmovie = await Movies.fin().where('rating').gte(req,query.rating);
        
        // find(req.query) this will work in mongoose 7.0 or more
         this.query =  this.query.find();
         return this;
    }


    sort(){
        if(this.querystr.sort){
            const sortBy = this.querystr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    limitingfield(){

        //imiting feild

        if(this.querystr.feilds){
            const feilds = this.querystr.feilds.split(',').join(' ');
            this.query =  this.query.select(feilds);
        }else{
            this.query =  this.query.select('-__v');
        }

        return this;

    }
    
    pagination(){
                //pagination

        let page = this.querystr.page || 1;
        let limit = this.querystr.limit || 5;

        let skip = (page - 1)*limit;

        this.query = this.query.skip(skip).limit(limit);

        if(this.querystr.page){
            const moviecount = Movies.countDocuments();           
            if(skip >= moviecount){
                throw new Error("this page not found");
            }
        }
        return this;
    }




}

module.exports= ApiFeatures;