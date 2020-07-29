var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var otpSchema = Schema({
	email: {type: String},
	code: {type: String},
}, {timestamps: true});

otpSchema.index({createdAt: 1},{expireAfterSeconds: 120});

var otp=mongoose.model("otps",otpSchema);
module.exports=otp;