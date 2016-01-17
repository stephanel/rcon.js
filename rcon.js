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

		if(result === 'exit') {
			result = '';
			console.log('WARNING : This command is dangerous. It will stop the server you are connected to.');
			console.log('If you really want to stop this server, use \'exit_the_server_please\'');
		}

		if(result === 'exit_the_server_please') {
                        result = 'exit';
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

function connect(addr, password) {
        var rcon = Rcon({
                address: addr,
                password: password
        });

        rcon.connect().then(() => {
                console.log('Connected to '+srvAddr);
                console.log('Use \'quit\' to disconnect from the server.');
                shellPrompt(rcon);
        }).catch(function(err) {
                console.error(err);
                process.exit();
        });
}

if(process.argv.length < 3) {
	console.log('Usage : rcon.js <serverip>');
	process.exit();
}

var srvAddr = process.argv[2];

if(typeof process.argv[3] !== 'undefined') {
	connect(srvAddr, process.argv[3]);
} else {
	read({
	        prompt: 'Password : ',
	        silent: true
	}, function(err, result, isDefault) {
	        connect(srvAddr, result);
	});
}

