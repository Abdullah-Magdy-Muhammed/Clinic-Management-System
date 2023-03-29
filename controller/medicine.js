const {validationResult}=require('express-validator');
const mongoose = require('mongoose');
const ErrorResponse = require('./../utils/errorResponse')
const medicineScema= require("../model/medicine");
const asyncHandler = require('express-async-handler')


exports.getAllMedicines =  (request,response,next)=>{
    let  data=[];
    response.advancedResults.forEach(element => {
       
            data.push(element);
           });
        console.log(data)
    response.status(200).json(data)
}
exports.getMedicineID=(request,response,next)=>{
    const medicineId = request.params.id;
    medicineScema.findById(medicineId).then(data=>{
        if(data!=null ){
            response.status(200).json(data);
        }else{
            next(new ErrorResponse(`medicine doesn't exist with id of ${request.params.id}`,404))
        }
    }).catch(error=>{
        next(error);
    })
}


exports.addNewMedicine=(request,response,next)=>{
    let errors= validationResult(request);
    // console.log(errors);
    if(!errors.isEmpty()){
        let error =new Error();
        error.status=422;
        error.message=errors.array().reduce((current,object)=>current +object.msg+" "," ");
        throw error;

    }else{
        let newMedicine = new medicineScema({
            // image:request.file.filename,
            drugName: request.body.drugName,
            dosage:request.body.dosage,
            quantity:request.body.quantity,
            description:request.body.description,
            form:request.body.form,
            price:request.body.price,
            mfd_date:request.body.mfd_date,
            exp_date:request.body.exp_date,
        }) ;
        // console.log(request);
        // response.json({body:request.body,file:request.file});
        // console.log(request.file);
        newMedicine.save().then(data=>{

            response.status(200).json({success:true,message:"add medicine",data});
        }) .catch(error=>{
            next(error);
        })  
    }
    
}
exports.updateMedicineData=(request,response,next)=>{
    if (Object.keys(request.body).length === 0) {
        next(new ErrorResponse("Empty data", 400))
    }

    let errors= validationResult(request);
    console.log(errors);
    if(!errors.isEmpty()){
        let error =new Error();
        error.status=422;
        error.message=errors.array().reduce((current,object)=>current +object.msg+" "," ");
        throw error;

    }else{
        medicineScema.updateOne({ _id:request.params.id},{
            $set:{   
                // image:request.file.filename, 
                drugName: request.body.drugName,
                dosage:request.body.dosage,
                quantity:request.body.quantity,
                description:request.body.description,
                form:request.body.form,
                price:request.body.price,
                mfd_date:request.body.mfd_date,
                exp_date:request.body.exp_date,
                archive:request.body.archive
            }

        }).then(data=>{
            if(data==null){
                throw new Error ('medicine id is not found !!');
            }
            response.status(201).json({success:true,message:"update medicine",data});
        }).catch(error=>next(error))
        
    
    } 
}
// exports.deleteMedicine=(request,response,next)=>{
//     // const medicineId = request.params.id;
//     medicineScema.findByIdAndDelete({ _id: request.params.id })
//     .then(data=>{
//         if(data==null)
//         response.status(200).json({success:true,message:"delete medicine",id:request.params});
           
//     }).catch(error=>next(error))

// }
exports.deleteMedicine=(request,response,next)=>{
    // const medicineId = request.params.id;
    medicineScema.updateOne({ _id: request.params.id },{
        $set:{  
            drugName: request.body.drugName,
            dosage:request.body.dosage,
            quantity:request.body.quantity,
            description:request.body.description,
            form:request.body.form,
            price:request.body.price,
            archive:true,
            mfd_date:request.body.mfd_date,
            exp_date:request.body.exp_date,
         }})
    .then(data=>{
        response.status(200).json({success:true,message:"delete medicine",id:request.params});
           
    }).catch(error=>next(error))

}
