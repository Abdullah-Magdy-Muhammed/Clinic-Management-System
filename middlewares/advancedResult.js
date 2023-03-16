const ErrorResponse = require('./../utils/errorResponse')


const advancedResults = (model, populate)=> async (request,response,next)=>{
    //copy request.query  
    const reqQuery = {...request.query}
    //fienld to exclude
    const removeFields =['select','sort', 'limit', 'page'];
    //loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])
    //create query string
    let queryStr = JSON.stringify(reqQuery)
    //Create operators ($gt, $gte ,etc)
    const regex = /\b(gt|gte|lt|lte|in)\b/g;
    queryStr = queryStr.replace(regex,  match => `$${match}`);
    //Select Fields
    const fields = request.query.select?request.query.select.split(',').join(" "):'-__v';
    const sortBy = request.query.sort? request.query.sort.split(',').join(' '): '-createdAt';
    //Pagination
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 25;
    //----Test                     
    const startIndex = (page-1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    const pagination = {};
    if(startIndex > 0){
        pagination.next ={
            page:page +1,
            limit
        }
    } 
    if(endIndex < total){
        pagination.prev ={
            page:page - 1,
            limit
        }
    } 
    if(populate){
        await model.find(JSON.parse(queryStr))
    .select(fields)
    .sort(sortBy)
    .limit(limit)
    .skip(startIndex)
    .populate(populate)
    .then(data=>{
        // response.advancedResults ={
        //     // success: true,
        //     // count: data.length,
        //     // pagination,
        //     data:data 
        // }

        response.advancedResults =data
        next()
    })
    .catch(error=>{
        next(new ErrorResponse(404))
    })
    }else{
         //Find resource
  await model.find(JSON.parse(queryStr))
  .select(fields)
  .sort(sortBy)
  .limit(limit)
  .skip(startIndex)
  .then(data=>{
    //   response.advancedResults ={
    //       success: true,
    //       count: data.length,
    //       pagination,
    //       data:data 
    //   }
    response.advancedResults =data

      next()
  })
  .catch(error=>{
      next(new ErrorResponse(404))
  })
    }
   
}
module.exports = advancedResults