/* #-#-#-#-#-#-#-#-#-#-#-#-#-#-#
File Name: server.js
Author(s): Akshit Kumar
Last Modified: 
#-#-#-#-#-#-#-#-#-#-#-#-#-#-# */

/* Calling all the required modules */
require('dotenv').config()
const express = require("express");
const Discord = require("discord.js");
const redirect=require('express-redirect');
const cors=require('cors');
const md = require("markdown-it")();
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const shortid = require('shortid');
const minify = require('express-minify');
var bcrypt=require('./models/bcrypt');
var otp=require('./controllers/otp');
var sendotp=require('./models/sendotp');
var generate=require('./models/generate');
var otp=require('./controllers/otp');

/* Initialization of the modules that require it */

// Checking if MongoDB URI exists
if (process.env.mongo) {
    // Initiating a connection to MongoDB
mongoose.connect(process.env.mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db=mongoose.connection;
db.on('error', console.log.bind(console, "Could not connect to the database!"));
db.once('open', function(callback){
    console.log("Connected to the database!");
});
const UR = mongoose.model("urgent", {
    name: String,
    email: String,
    status: String
});};
// Checking if E-Mail exists
if (process.env.em1) {
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.em1, // Address to send the Emails from
        pass: process.env.emp1 // Password of that Email
    }
});
};
if (process.env.token) {
const client = new Discord.Client();
client.on("ready", () => {
    console.log(`DI IS ONLINE!`);
});
client.login(process.env.token);
};

const app = express();

app.use(minify());
app.use(cors());
const fs = require("fs");
var counter = 0;
const matter = require('gray-matter');
var bodyParser = require("body-parser");
app.set('view engine', 'ejs'); // Setting the view engine to use EJS
app.use(express.static("public")) // Set a path to call all the static files from
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.locals.title = "Home";
app.locals.keywords = null;
app.locals.description = null;
app.locals.url = null;
app.locals.image = null;
app.locals.count = counter;
app.locals.uri = null;

app.get("/", (req, res) => {
    counter++;
    res.locals.url = req.protocol + '://' + req.get('host') + req.originalUrl;
        if (process.env.token) {
    const guild = client.guilds.cache.get(process.env.gid);
    let roleID = process.env.rid;
    let memberCount = guild.roles.cache.get(roleID).members.size;
    const count = guild.members.cache.filter(m => m.roles.cache.has(roleID) && m.presence.status === 'online').size
        } 
        if (!process.env.token) {
            var count = "DI OFFLINE"
            var memberCount = "DI OFFLINE"
        }

    res.render("pages/index", {uri: req.url, count: counter, online: count, total: memberCount});
});

app.get("/blog/:page", (req, res) => {
if (fs.existsSync(__dirname + '/views/pages/' + req.params.page + '.md')) {
    const file = matter.read(__dirname + '/views/pages/' + req.params.page + '.md');
    let content = file.content;
    var result = md.render(content);
    res.render("pages/page", {
        partial: partial,
        post: result,
        title: file.data.title,
        url: req.protocol + '://' + req.get('host') + req.originalUrl,
        date: file.data.date,
        description: file.data.description,
        image: file.data.image,
        keywords: file.data.keywords
    });
} else {
  res.locals.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.locals.four = req.url;
      res.status(404).render('pages/404', {
        title: "Error 404",
        url: req.protocol + '://' + req.get('host') + req.originalUrl,
        description: "R1",
        keywords: "R1",
        image: req.protocol + '://' + req.get('host') + '/200.png'
    });
} });

	app.post('/send',(req,res)=>{
        var name = req.body.name;
        var email = req.body.email;
        var message = req.body.message;
        var subject = req.body.subject;
        var uid = shortid.generate();
        var data = {
            "name": name,
            "email":email,
            "message": message,
            "subject": subject,
            "uid": uid,
            "staff": null,
            "status": null,
            "time": Math.floor(new Date() / 1000)
        }
        if (process.env.token) {
        client.channels.cache.get(process.env.c2)
            .send(`We have received a new request:
            **Name**: ${name}
            Subject: ${subject}
            Message: ${message}
            Follow Up: ${email}
            ID: ${uid}
            Status: ${defstatus}`);
        }
        if (process.env.mongo) {
        db.collection('urgents').insertOne(data,function(err, collection){
            if (err) throw err;
            console.log("Urgent request logged!");
        });
        }
        if (process.env.em1) {
		var x=generate.generateOtp();
		var mailOptions={
			from: "ecrimeportal@gmail.com",
			to: req.body.email,
			subject: 'Email Verification',
			html: 'Your OTP for Email Verification is <b>'+x+'</b>'
		};
		sendotp.send(mailOptions,(err,data)=>{
			if(err)
				res.send(err);
			else
			{
				otp.save(req.body.email,x,(error,dataa)=>{
					if(error)
						res.send(error);
					res.render('pages/verifyOtp.ejs',{email:req.body.email});
				});
			}
        });
    }
	});
	app.post('/verify',(req,res)=>{
		otp.match(req.body.email,req.body.otp,(err,data)=>{
			if(err)
				res.send(err);
			if(data==undefined)
				res.send("OTP Expired. Kindly try to resend it.");
			else if(data==true)
			{
				otp.remove(req.body.email,(error,dataa)=>{
					if(error)
						res.send(error);
					else
                        res.send("Success. Verified.");
                        client.channels.cache.get('737253262574485567')
                        .send(`Request ID for ${req.body.email} has been approved!`);
				})
			}
			else
				res.send("Failure. Kindly check again.");
		})
    });
    if (process.env.mongo) {
app.post('/api/status', async (req, res) => {
    var iuid = req.body.uid;
        const stat = await UR.findOne({ uid: iuid })
        console.log(stat)
    return res.render('pages/clientstat', {
        title: "Thanks!",
        url: req.protocol + '://' + req.get('host') + req.originalUrl,
        description: "Thanks for filling the form!",
        statusof: stat
    });
    }
)};
if (process.env.mongo) {
app.post(process.env.peuri, async (req, res) => {
        var iuid = req.body.uid;
        var cstat = req.body.cstat;
        const stat = await UR.findOne({ uid: iuid })
    const doc = await UR.findOneAndUpdate(
        { uid: iuid },
        {
            status: cstat
        })
        return res.render('pages/thanks', {
            title: "Thanks!",
            url: req.protocol + '://' + req.get('host') + req.originalUrl,
            description: "Thanks for filling the form!",
            statusof: stat
        });
    }
)};
app.get('/request', function(req, res) {
    res.locals.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('pages/request');
});
if (process.env.mongo) {
app.get('/status', function(req, res) {
    res.locals.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('pages/status', {
    });
});
}
if (process.env.mongo) {
app.get(process.env.edituri, function(req, res) {
    res.locals.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('pages/update', {
    });
}); }

const listener = app.listen(process.env.PORT || 3000, function() {
    console.log("Your app is listening on port " + listener.address().port);
});