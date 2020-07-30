var mongoose = require('mongoose');
var otp = require('.././db/otp');
var bcrypt = require('.././models/bcrypt');

exports.save = (email,code,cb)=>
{
	otp.findOne({
		email: email
	}).exec((err,data)=>{
		if(err)
			cb(err);
		if(data==null)
		{
			var newOtp = new otp({
				email: email,
				code: bcrypt.encrypt(code)
			});
			newOtp.save()
			.then(savedData=>{
				cb(null,savedData);
			})
			.catch(err=>{
				cb(err);
			});
		}
		else
		{
			otp.updateOne({email: email},{code: bcrypt.encrypt(code)})
			.exec((err,data)=>{
				if(err)
					cb(err);
				if(data==undefined) {
					return console.log("undefined: otp.create -191")
				}
				cb(null,data);
			});
		}
	});
}

exports.match = (email,code,cb)=>
{
	otp.find({email: email})
	.exec((err,data)=>{
		if(err)
			cb(err);	
		if(data==null){
				return console.log("null: otp.match -193")
		}
		if(data==undefined){
				return console.log("undefined: otp.match -192")
		}
		else
			cb(null,bcrypt.match(code,data[0].code));
	});
}

exports.remove = (email,cb)=>
{
	otp.remove({email: email})
	.exec((err,data)=>{
		if(err)
			cb(err);
		if(data==null){
			return console.log("null: otp.remove -193")
		}
		cb(null,data);
	})
}