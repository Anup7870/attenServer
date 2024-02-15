import mongoose from 'mongoose';

const attendenceSchema = new mongoose.Schema({
  studnet:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'student'
  },
  date:{
    type:String,
    required:true
  },
  year:{
    type:String,
    required:true
  },
  sem:{
    type:String,
    require:true
  },
  teacher:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'teachers'
  }
})

const Attendence = mongoose.model('attendence', attendenceSchema);

export default Attendence;