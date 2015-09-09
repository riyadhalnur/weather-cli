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
		'',
		'Examples',
		'  $ weather-cli London UK',
		'  Condition: Partly Cloudy',
		'  Temperature: 32C/89.6F'
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
	var temperature = result.query.results.channel.item.condition.temp + 'F';
	var temperatureInCelcius = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';

	console.log(chalk.cyan('Condition: ' + chalk.yellow(condition)));
	console.log(chalk.cyan('Temperature: ' + chalk.yellow(temperatureInCelcius + '/' + temperature)));
	process.exit();
});
