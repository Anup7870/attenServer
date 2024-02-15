import mongoose from 'mongoose';

const studentRegisSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  reg:{
    type:String,
    required:true
  },
  roll:{
    type:String,
    required:true
  },
  hash:{
    type:String,
    required:true
  },
})

// const Student = mongoose.model('Studnet', studentRegisSchema);

export default studentRegisSchema;
