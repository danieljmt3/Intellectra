import mongoose from 'mongoose'

const promptSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
})

const promptModel=mongoose.model('prompts',promptSchema);

export default promptModel;