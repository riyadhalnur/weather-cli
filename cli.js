#!/usr/bin/env node
'use strict';

var meow = require('meow');
var chalk = require('chalk');
var updateNotifier = require('update-notifier');
var weather = require('./');
var pkg = require('./package.json');

var cli = meow({
	help: [
		'Usage',
		'  $ weather-cli [input]',
		'',
		'Options',
		'  city [Default: Dhaka]',
		'  country [Default: Bangladesh]',
		'  scale (C/F) [Default: Celcius]',
		'',
		'Examples',
		'  $ weather-cli London UK C',
		'  London, UK',
		'  Condition: Partly Cloudy',
		'  Temperature: 32C'
	]
});

function _toCelcius(temp) {
	return Math.round(((temp - 32) * 5) / 9);
}

updateNotifier({pkg: pkg}).notify();

weather(cli.input, function (err, result) {
	if (err) {
		console.log(chalk.bold.red(err));
		process.exit(1);
	}

	var condition = result.query.results.channel.item.condition.text;
	var temperature;

	if (cli.input[2] && cli.input[2] === 'C') {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	} else if (cli.input[2] && cli.input[2] === 'F') {
		temperature = result.query.results.channel.item.condition.temp + 'F';
	} else {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	}

	var city = cli.input[0] ? cli.input[0] : 'Dhaka';
	var country = cli.input[1] ? cli.input[1] : 'Bangladesh';

	console.log(chalk.red(city + ', ' + country));
	console.log(chalk.cyan('Condition: ' + chalk.yellow(condition)));
	console.log(chalk.cyan('Temperature: ' + chalk.yellow(temperature)));
	process.exit();
});
