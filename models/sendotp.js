"use strict";

var nodemailer=require('nodemailer');
if (process.env.em1) {
var transporter = nodemailer.createTransport({
	service:'gmail',
	auth:{
		user: process.env.em1, // Address to send the Emails from
        pass: process.env.emp1
	}
})};

exports.send = (mailOptions,cb)=>
{
	transporter.sendMail(mailOptions,(err,info)=>{
		if(err)
			cb(err);
		cb(null,info);
	});
}
