import mongoose from 'mongoose';

const schema=mongoose.Schema;

const CheckList = new schema({
  content: {
    type: String,
    required: true
  },
  isChecked: {
    type: Boolean,
    default: false
  },
  checkedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  coments: {
    type: String,
    default: ""
  },
  Image: {
    type: String,
    default: ""
  },
  // ✅ Fix this field name spelling
  AssingedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});


 const CheckListItem=mongoose.model("CheckList",CheckList);

 export default CheckListItem;

 