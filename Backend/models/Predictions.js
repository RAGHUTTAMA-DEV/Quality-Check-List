import mongoose from "mongoose";

const schema = new mongoose.Schema({ // Correctly initialize the schema
    prediction: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

export default mongoose.model("Predict", schema); // Use the schema variable