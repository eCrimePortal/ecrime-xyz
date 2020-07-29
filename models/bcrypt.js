var bcrypt=require('bcrypt');
var saltRounds = 10;

exports.encrypt = (otp)=>
{
	return bcrypt.hashSync(otp,saltRounds);
}

exports.match = (otp,hash)=>
{
	return bcrypt.compareSync(otp,hash);
}