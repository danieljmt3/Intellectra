import mongoose from "mongoose";

const RepostSchema=new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    asunto:{
        type:String,
        required:true
    }
})

const ReportModel=mongoose.model('reports',RepostSchema);

export default ReportModel;