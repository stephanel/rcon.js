#!/usr/bin/node
var Rcon = require('srcds-rcon');
var read = require('read');

function shellPrompt(rcon) {
	read({
		prompt: '> ',
		silent: false
	}, function(err, result, isDefault) {
		if(result === 'quit') {
			process.exit();
			return;
		}

		rcon.command(result).then(response => { 
			console.log(`${response}`);
			shellPrompt(rcon);			
		}).catch(function(err) {
			console.error(err);
			shellPrompt(rcon);
		});
	});
}

if(process.argv.length < 3) {
	console.log('Usage : rcon.js <serverip>');
	process.exit();
}

var srvAddr = process.argv[2];
read({
	prompt: 'Password : ',
	silent: true
}, function(err, result, isDefault) {
	var srvPassword = result;

	var rcon = Rcon({
	        address: srvAddr,
	        password: srvPassword
	});
	
	rcon.connect().then(() => {
	        console.log('Connected to '+srvAddr);
		console.log('Use \'quit\' to disconnect from the server.');
		shellPrompt(rcon);
	}).catch(function(err) {
	        console.error(err);
	        process.exit();
	});
});

