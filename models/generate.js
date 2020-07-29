var otpGenerator = require('otp-generator');

exports.generateOtp = ()=>
{
	return otpGenerator.generate(6,{digits:true, alphabets:false, upperCase:false, specialChars:false});
}