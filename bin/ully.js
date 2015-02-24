#!/usr/bin/env node

/*
 * ully-cli
 * https://github.com/ullyin/ully-cli
 *
 * Copyright (c) 2015, EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

/**
 * Module dependencies.
 */

var program = require('commander'),
    updateNotifier = require('update-notifier'),
    Insight = require('insight'),
    pj = require('prettyjson').render,
    cp = require('copy-paste'),
    banner = require('../lib/banner.js'),
    open = require('open'),
    Ully = require('..'),
    ully,
    logged = false,
    path = require('path'),
    h = require('../lib/helpers.js'),
    debug = require('../lib/debugger.js'),
    pkg = require('../package.json'),
    configPath = path.join(__dirname, '..', 'lib', 'ullyConfig.json');

require('colors');

/*
 * Ully Insight
 */

var insight = new Insight({
    trackingCode: 'UA-26025686-3',
    packageName: pkg.name,
    packageVersion: pkg.version
});

// ask for permission the first time
if (insight.optOut === undefined) {
    return insight.askPermission();
}

insight.track('ully', 'cli');

/*
 * Ully Response
 */

function response(err, res, pureJson, message, type) {
    if (err) {
        throw err;
    }
    if (res) {
        if (!pureJson) {
            console.log('\n[ ' + 'Response'.green.bold + ' ] ==> ');
            console.log();
            console.log(pj(res));
        } else {
            console.log(JSON.stringify(res, null, 4));
        }
    }
    if (message && type) {
        debug(message, type);
    }
    if (message && !type) {
        debug(message);
    }
}

/*
 * Ully Bootstrap
 */

program
    .version(pkg.version, '-v, --version')
    .usage('command [option]'.white);

/*
 * Start API
 */

if (h.exists(configPath)) {
    var config = require(configPath);
    ully = new Ully(config.accessToken);
    logged = true;
} else {
    ully = new Ully('');
    debug('  You are not logged in at the time. You may not use all the features of Ully if you do not login with your account.\n', 'error');
}

program
    .option('-j, --json', 'Show pure JSON output');

program
    .option('-o, --open', 'Open shortened url in default browser');

/*
 * Ully Signup
 */

program
    .command('signup')
    .description('Create your Ully account'.white)
    .action(function() {
        debug(' Opening Signup page...', 'success');
        open('https://ully.in/signup');
    });

/*
 * Ully Login
 */

program
    .command('login')
    .description('Login in your Ully account'.white)
    .action(function() {
        var prompts = [{
            type: 'input',
            name: 'accessToken',
            message: 'Enter your access_token'
        }];
        //Ask
        ully.prompt(prompts, function(answers) {
            ully.login(answers.accessToken, function(err, data) {
                if (err) {
                    return response(err, data);
                }
                return response(null, data);
            });
        });
    });

/*
 * Ully Forgot
 */

program
    .command('forgot')
    .description('Reset your password'.white)
    .action(function() {
        debug(' Opening Forgot page...', 'success');
        open('https://ully.in/forgot');
    });

/*
 * Ully Logout
 */

program
    .command('logout')
    .description('Logout of your Ully account'.white)
    .action(function() {
        var prompts = [{
            type: 'confirm',
            name: 'logout',
            message: 'Are you sure you want to logout from your account?'
        }];
        //Ask
        ully.prompt(prompts, function(answers) {
            if (answers.logout) {
                if (h.exists(configPath)) {
                    h.remove(configPath);
                }
                debug('You went out of your account successfully!', 'success');
            }
        });
    });

/*
 * Ully Stats
 */

program
    .command('stats')
    .description('Show statistics of Ully'.white)
    .action(function() {
        ully.stats(function(err, data) {
            if (err) {
                return response(err, data, program.json);
            }
            return response(null, data, program.json);
        });
    });

/*
 * Ully Status
 */

program
    .command('status')
    .description('Show status of the API'.white)
    .action(function() {
        ully.status(function(err, data) {
            if (err) {
                return response(err, data, program.json);
            }
            return response(null, data, program.json);
        });
    });

if (logged) {

    /*
     * Ully Account
     */
    program
        .command('account')
        .description('Show your account info'.white)
        .action(function() {
            ully.account(function(err, data) {
                if (err) {
                    return response(err, data, program.json);
                }
                return response(null, data, program.json);
            });
        });

    /*
     * Ully Collections
     */
    program
        .command('collections')
        .description('Show your collections'.white)
        .action(function() {
            ully.collections(function(err, data) {
                if (err) {
                    return response(err, data, program.json);
                }
                if (data.length < 1) {
                    console.log('  You don\'t have collections. \n  Create your first collection.\n'.bold + '\n  $ ully collections:new'.bold.white);
                    process.exit();
                }
                return response(null, data, program.json);
            });
        });

    /*
     * Ully createCollection
     */

    program
        .command('collections:new')
        .description('Create a new collection'.white)
        .action(function() {
            var prompts = [{
                type: 'input',
                name: 'name',
                message: 'Enter a name'
            }, {
                type: 'input',
                name: 'slug',
                message: 'Enter a slug'
            }, {
                type: 'confirm',
                message: 'This is a public collection?',
                name: 'public',
                default: true
            }];
            //Ask
            ully.prompt(prompts, function(answers) {
                ully.createCollection(answers.name, answers.slug, answers.public, function(err, data) {
                    if (err) {
                        return response(err, data);
                    }
                    return response(null, data);
                });
            });
        });

    /*
     * Ully addUrl
     */

    program
        .command('collections:add')
        .description('Create a new url'.white)
        .action(function() {
            ully.listCollections(function(list) {
                if (list.length < 1) {
                    console.log(' You don\'t have collections. \n Create your first collection.\n'.bold + '\n $ ully collections:new'.bold.white);
                    process.exit();
                }
                var prompts = [{
                    type: 'list',
                    message: 'Choose a collection',
                    name: 'collection',
                    choices: list
                }];
                //Ask
                ully.prompt(prompts, function(collectionAnswers) {
                    var prompts = [{
                        type: 'input',
                        name: 'title',
                        message: 'Enter a title'
                    }, {
                        type: 'input',
                        name: 'url',
                        message: 'Enter a url'
                    }, {
                        type: 'input',
                        name: 'description',
                        message: 'Enter a description'
                    }];
                    //Ask
                    ully.prompt(prompts, function(answers) {
                        ully.addUrl(collectionAnswers.collection, answers.url, answers.title, answers.description, function(err, data) {
                            if (err) {
                                return response(err, data);
                            }
                            return response(null, data);
                        });
                    });
                });
            });
        });

    /*
     * Ully listShortenedUrls
     */

    program
        .command('shortener')
        .description('List all shortened urls'.white)
        .action(function() {
            ully.listShortenedUrls(function(list) {
                if (list.length < 1) {
                    console.log(' You don\'t have shortened urls. \n Shorten your first url.\n'.bold + '\n $ ully shortener:shorten <url>'.bold.white);
                    process.exit();
                }
                var prompts = [{
                    type: 'list',
                    message: 'Choose a url to copy to clipboard',
                    name: 'url',
                    choices: list
                }];
                //Ask
                ully.prompt(prompts, function(answers) {
                    //Copy
                    cp.copy(answers.url, function() {
                        if(program.open) {
                            debug(' Opening '+ answers.url, 'success');
                            open(answers.url);
                        }
                        response(null, {
                            msg: 'Copied to clipboard successfully!',
                            shortenedUrl: answers.url
                        });
                        process.exit(0);
                    });
                });
            });
        });


    /*
     * Ully shortenUrl
     */

    program
        .command('shortener:shorten <url>')
        .description('Shorten a url'.white)
        .action(function(url) {
            var prompts = [{
                type: 'input',
                name: 'shortcode',
                message: 'Enter a shortcode, Leave blank for random shortcode'
            }, {
                type: 'password',
                message: 'Enter a password, Leave blank for public access',
                name: 'password'
            }];
            //Ask
            ully.prompt(prompts, function(answers) {
                ully.shortenUrl(url, answers.shortcode, answers.password, function(err, data) {
                    if (err) {
                        return response(err, data);
                    }
                    //Copy
                    cp.copy(data.shortenedUrl.shortenedUrl, function() {
                        debug(' Copied to clipboard successfully!', 'success');
                        if(program.open) {
                            debug(' Opening '+ answers.url, 'success');
                            open(answers.url);
                        }
                        response(null, data);
                        process.exit(0);
                    });
                });
            });
        });
}

/*
 * Ully on help ption show examples
 */

program.on('--help', function() {
    console.log('  Examples:');
    console.log('');
    console.log('    $ ully signup');
    console.log('    $ ully login');
    console.log('    $ ully forgot');
    console.log('    $ ully logout');
    console.log('');
});

/*
 * Ully Banner
 */

if (process.argv.length === 3 && process.argv[2] === '--help') {
    banner();
}

if (process.argv.length === 4 && process.argv[3] !== '--json') {
    banner();
} else {
    if (process.argv.length === 3 && process.argv[2] !== '--help') {
        banner();
    }
}

/*
 * Ully Process Parser
 */

program.parse(process.argv);

/*
 * Ully Default Action
 */

var notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version
});

if (notifier.update) {
    notifier.notify(true);
}

if (process.argv.length === 2) {
    banner();
    program.help();
}

/*
          |||                   |||
|||           |||           |||     ||||||||||||
|||       |||  |||         |||  ||| |||      |||
|||       |||   |||       |||   ||| ||||||||||||
|||       |||     |||    |||    ||| |||      |||
||||||||| |||      ||||||       ||| |||      |||
*-----------------------------------------------*
    I LOVE YOU SO MUCH PRINCESS OF LORDAERON    
*/
