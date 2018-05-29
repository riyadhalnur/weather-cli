#!/usr/bin/env node
'use strict';

const meow = require('meow');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const weather = require('./');

const cli = meow(`
Usage
  $ weather <input>

Options
  --city, -c City you want to lookup weather for
  --country, -C Country you want to lookup weather for
  --scale, -s Weather scale. Defaults to Celcius
  --help Show this help message
  --version Display version info and exit
  config Set the default location

Examples
  $ weather -c Dhaka -C Bangladesh
  Dhaka, Bangladesh
  Condition: Partly Cloudy
  Temperature: 32°C

  $ weather config -c Dhaka -C Bangladesh
  Default location set to Dhaka, Bangladesh
`, {
  flags: {
    city: {
      type: 'string',
      alias: 'c'
    },
    country: {
      type: 'string',
      alias: 'C'
    },
    scale: {
      type: 'string',
      alias: 's',
      default: 'C'
    }
  }
});

updateNotifier({ pkg }).notify();

if (cli.input.length && cli.input[0] === 'config') {
  weather.setLocation(cli.flags)
    .then(result => {
      console.log(chalk.bold.blue(result));
      process.exit(0);
    })
    .catch(err => {
      if (err) {
        console.log(chalk.bold.red(err));
        process.exit(1);
      }
    });
} else {
  weather.getWeather(cli.flags)
    .then(result => {
      console.log(chalk.red(`${result.city}, ${result.country}`));
      console.log(chalk.cyan(`Condition: ${chalk.yellow(result.condition)}`));
      console.log(chalk.cyan(`Temperature: ${chalk.yellow(result.temp)}${chalk.yellow('°' + result.scale)}`));
      process.exit(0);
    }).catch(err => {
      if (err) {
        console.log(chalk.bold.red(err));
        process.exit(1);
      }
    });
}
