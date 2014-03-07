#!/usr/bin/env node

/*
 * ully
 * https://github.com/enytc/ully
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the BSD license.
 */

/**
 * Module dependencies.
 */

var program = require('commander');
var updateNotifier = require('update-notifier');
var Insight = require('insight');
var banner = require('../lib/banner.js');
var Ully = require('..');
var ully;
var logged = false;
var isAdmin = false;
var path = require('path');
var h = require('../lib/helpers.js');
var debug = require('../lib/debugger.js');
var pkg = require('../package.json');
var configPath = path.join(__dirname, '..', 'lib', 'ullyConfig.json');
require('colors');

/*
 * Ully Banner
 */

banner();

/*
 * Ully Insight
 */

var insight = new Insight({
    trackingCode: 'UA-26025686-3',
    packageName: pkg.name,
    packageVersion: pkg.version
});

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
    ully = new Ully(config.token);
    logged = true;
    isAdmin = true ? config.role === 'admin' : false;
} else {
    ully = new Ully('');
    debug('  You are not logged in at the time. You may not use all the features of Ully if you do not login with your account.\n', 'error');
}

program
    .option('--json', 'Show pure JSON output');

program
    .option('-u, --username <username>', 'A username of a specific user');

/*
 * Ully Signup
 */

program
    .command('signup')
    .description('Create your Ully account'.white)
    .action(function () {
        var prompts = [{
            type: 'input',
            name: 'name',
            message: 'What\'s your name?'
        }, {
            type: 'input',
            name: 'email',
            message: 'What\'s your email?'
        }, {
            type: 'input',
            name: 'username',
            message: 'Choose a username'
        }, {
            type: 'password',
            name: 'password',
            message: 'Enter your password'
        }];
        //Ask
        ully.prompt(prompts, function (answers) {
            ully.signup(answers.name, answers.email, answers.username, answers.password);
        });
    });

/*
 * Ully Login
 */

program
    .command('login')
    .description('Login in your Ully account'.white)
    .action(function () {
        var prompts = [{
            type: 'input',
            name: 'email',
            message: 'Enter your email'
        }, {
            type: 'input',
            name: 'username',
            message: 'Enter your username'
        }, {
            type: 'password',
            name: 'password',
            message: 'Enter your password'
        }];
        //Ask
        ully.prompt(prompts, function (answers) {
            ully.login(answers.email, answers.username, answers.password);
        });
    });

/*
 * Ully Forgot
 */

program
    .command('forgot')
    .description('Reset your password'.white)
    .action(function () {
        var prompts = [{
            type: 'input',
            name: 'email',
            message: 'Enter your email'
        }, {
            type: 'input',
            name: 'username',
            message: 'Enter your username'
        }];
        //Ask
        ully.prompt(prompts, function (answers) {
            ully.forgot(answers.email, answers.username);
        });
    });

/*
 * Ully Logout
 */

program
    .command('logout')
    .description('Logout of your Ully account'.white)
    .action(function () {
        var prompts = [{
            type: 'confirm',
            name: 'logout',
            message: 'Are you sure you want to logout from your account?'
        }];
        //Ask
        ully.prompt(prompts, function (answers) {
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
    .description('Show statistics of a specific user'.white)
    .action(function () {
        if (program.json) {
            ully.stats(true);
        } else {
            ully.stats();
        }
    });

/*
 * Ully Status
 */

program
    .command('status')
    .description('Show status of api'.white)
    .action(function () {
        if (program.json) {
            ully.status(true);
        } else {
            ully.status();
        }
    });

if (logged) {
    if (isAdmin) {
        /*
         * Ully StatsByUserId
         */
        program
            .command('stats:user <userid>')
            .description('Show statistics of Ully'.white)
            .action(function (userid) {
                if (program.json) {
                    ully.statsByUserId(userid, true);
                } else {
                    ully.statsByUserId(userid);
                }
            });
    }

    /*
     * Ully Me
     */
    program
        .command('me')
        .description('Show me profile info'.white)
        .action(function () {
            if (program.json) {
                ully.me(true);
            } else {
                ully.me();
            }
        });

    /*
     * Ully UpdateMe
     */

    program
        .command('me:update')
        .description('Update your profile info'.white)
        .action(function () {
            var prompts = [{
                type: 'input',
                name: 'name',
                message: 'Enter a name'
            }, {
                type: 'input',
                name: 'email',
                message: 'Enter a email'
            }, {
                type: 'input',
                name: 'username',
                message: 'Enter a username'
            }, {
                type: 'password',
                name: 'password',
                message: 'Enter a password'
            }];
            //Ask
            ully.prompt(prompts, function (answers) {
                ully.updateMe(answers.name, answers.email, answers.username, answers.password);
            });
        });

    /*
     * Ully deleteMe
     */

    program
        .command('me:delete')
        .description('Delete your Ully account'.white)
        .action(function () {
            var prompts = [{
                type: 'confirm',
                name: 'delete',
                message: 'Are you sure you want to delete your account with all data?'
            }, {
                type: 'confirm',
                name: 'delete2',
                message: 'Do you confirm the account deletion?'
            }];
            //Ask
            ully.prompt(prompts, function (answers) {
                if (answers.delete) {
                    if (answers.delete2) {
                        ully.deleteMe();
                    }
                }
            });
        });

    if (isAdmin) {
        /*
         * Ully Users
         */
        program
            .command('users')
            .description('Show all users'.white)
            .action(function () {
                if (program.json) {
                    ully.users(true);
                } else {
                    ully.users();
                }
            });

        /*
         * Ully UsersByUsername
         */
        program
            .command('users:id <username>')
            .description('Get userId by username'.white)
            .action(function (username) {
                if (program.json) {
                    ully.UsersByUsername(username, true);
                } else {
                    ully.UsersByUsername(username);
                }
            });

        /*
         * Ully UsersShow
         */
        program
            .command('users:user <userid>')
            .description('Show a specific user info'.white)
            .action(function (userid) {
                if (program.json) {
                    ully.usersShow(userid, true);
                } else {
                    ully.usersShow(userid);
                }
            });

        /*
         * Ully createUsers
         */

        program
            .command('users:new')
            .description('Create a new user'.white)
            .action(function () {
                var prompts = [{
                    type: 'input',
                    name: 'name',
                    message: 'Enter a name'
                }, {
                    type: 'input',
                    name: 'email',
                    message: 'Enter a email'
                }, {
                    type: 'input',
                    name: 'username',
                    message: 'Enter a username'
                }, {
                    type: 'password',
                    name: 'password',
                    message: 'Enter a password'
                }, {
                    type: "list",
                    message: "Choose a user role",
                    name: "role",
                    choices: [{
                        name: 'User',
                        value: 'user',
                        checked: true
                    }, {
                        name: 'Admin',
                        value: 'admin'
                    }],
                }, {
                    type: "confirm",
                    message: "Enable this user account?",
                    name: "status",
                    default: false
                }];
                //Ask
                ully.prompt(prompts, function (answers) {
                    ully.createUsers(answers.name, answers.email, answers.username, answers.password, answers.role, answers.status);
                });
            });

        /*
         * Ully updateUsers
         */

        program
            .command('users:update <userid>')
            .description('Update a specific user'.white)
            .action(function (userid) {
                var prompts = [{
                    type: 'input',
                    name: 'name',
                    message: 'Enter a name'
                }, {
                    type: 'input',
                    name: 'email',
                    message: 'Enter a email'
                }, {
                    type: 'input',
                    name: 'username',
                    message: 'Enter a username'
                }, {
                    type: 'password',
                    name: 'password',
                    message: 'Enter a password'
                }, {
                    type: "list",
                    message: "Choose a user role",
                    name: "role",
                    choices: [{
                        name: 'User',
                        value: 'user',
                        checked: true
                    }, {
                        name: 'Admin',
                        value: 'admin'
                    }],
                }, {
                    type: "confirm",
                    message: "Enable this user account?",
                    name: "status",
                    default: false
                }];
                //Ask
                ully.prompt(prompts, function (answers) {
                    ully.updateUsers(userid, answers.name, answers.email, answers.username, answers.password, answers.role, answers.status);
                });
            });

        /*
         * Ully deleteUsers
         */

        program
            .command('users:delete <userid>')
            .description('Delete a specific user'.white)
            .action(function (userid) {
                var prompts = [{
                    type: 'confirm',
                    name: 'delete',
                    message: 'Are you sure you want to delete your account with all data?'
                }, {
                    type: 'confirm',
                    name: 'delete2',
                    message: 'Do you confirm the account deletion?'
                }];
                //Ask
                ully.prompt(prompts, function (answers) {
                    if (answers.delete) {
                        if (answers.delete2) {
                            ully.deleteUsers(userid);
                        }
                    }
                });
            });

        /*
         * Ully Moderation
         */
        program
            .command('mod')
            .description('Moderate collections'.white)
            .action(function () {
                if (program.json) {
                    ully.moderation(true);
                } else {
                    ully.moderation();
                }
            });

        /*
         * Ully moderationShowCollectionByUser
         */
        program
            .command('mod:info <userid>')
            .description('Show info of a specific collection'.white)
            .action(function (userid) {
                ully.listCollectionsByUserId(userid, function (list) {
                    if (list.length < 1) {
                        console.log(' You don\'t have collections. \n Create your first collection.\n' + '\n $ ully collections:new'.bold.white);
                        process.exit();
                    }
                    if (list.length < 1) {
                        console.log(' You don\'t have collections. \n Create your first collection.\n' + '\n $ ully collections:new'.bold.white);
                        process.exit();
                    }
                    var prompts = [{
                        type: "list",
                        message: "Choose a collection",
                        name: "collection",
                        choices: list
                    }];
                    //Ask
                    ully.prompt(prompts, function (answers) {
                        ully.moderationShowCollectionByUser(userid, answers.collection);
                    });
                });
            });

        /*
         * Ully moderationDeleteCollection
         */
        program
            .command('mod:delete <userid>')
            .description('Delete a specific collection'.white)
            .action(function (userid) {
                ully.listCollectionsByUserId(userid, function (list) {
                    if (list.length < 1) {
                        console.log(' You don\'t have collections. \n Create your first collection.\n' + '\n $ ully collections:new'.bold.white);
                        process.exit();
                    }
                    var prompts = [{
                        type: "list",
                        message: "Choose a collection",
                        name: "collection",
                        choices: list
                    }, {
                        type: 'confirm',
                        name: 'delete',
                        message: 'Are you sure you want to delete this collection?'
                    }];
                    //Ask
                    ully.prompt(prompts, function (answers) {
                        if (answers.delete) {
                            ully.moderationDeleteCollection(userid, answers.collection);
                        }
                    });
                });
            });

        /*
         * Ully moderationDeleteCollection
         */
        program
            .command('mod:deleteurl <userid>')
            .description('Delete a specific url in selected collection'.white)
            .action(function (userid) {
                ully.listCollectionsByUserId(userid, function (list) {
                    if (list.length < 1) {
                        console.log(' You don\'t have collections. \n Create your first collection.\n' + '\n $ ully collections:new'.bold.white);
                        process.exit();
                    }
                    var prompts = [{
                        type: "list",
                        message: "Choose a collection",
                        name: "collection",
                        choices: list
                    }];
                    //Ask
                    ully.prompt(prompts, function (answers) {
                        ully.listUrlsOnSelectedCollection(userid, function (urllist) {
                            var prompts = [{
                                type: "list",
                                message: "Choose a url",
                                name: "url",
                                choices: urllist
                            }, {
                                type: 'confirm',
                                name: 'delete',
                                message: 'Are you sure you want to delete this collection?'
                            }];
                            //Ask
                            ully.prompt(prompts, function (urlanswers) {
                                if (urlanswers.delete) {
                                    ully.moderationDeleteUrl(userid, answers.collection, urlanswers.url);
                                }
                            });
                        });
                    });
                });
            });
    }

    /*
     * Ully Collections
     */
    program
        .command('collections')
        .description('Show your collections'.white)
        .action(function () {
            if (program.username) {
                if (program.json) {
                    ully.collectionsByUsername(program.username, true);
                } else {
                    ully.collectionsByUsername(program.username);
                }
            } else {
                if (program.json) {
                    ully.collections(true);
                } else {
                    ully.collections();
                }
            }
        });

    /*
     * Ully createCollections
     */

    program
        .command('collections:new')
        .description('Create a new collection'.white)
        .action(function () {
            var prompts = [{
                type: 'input',
                name: 'name',
                message: 'Enter a name'
            }, {
                type: 'input',
                name: 'slug',
                message: 'Enter a slug'
            }, {
                type: "confirm",
                message: "This is a public collection?",
                name: "public",
                default: true
            }];
            //Ask
            ully.prompt(prompts, function (answers) {
                ully.createCollections(answers.name, answers.slug, answers.public);
            });
        });

    /*
     * Ully updateCollections
     */

    program
        .command('collections:update')
        .description('Update a specific collection'.white)
        .action(function () {
            ully.listCollections(function (list) {
                if (list.length < 1) {
                    console.log(' You don\'t have collections. \n Create your first collection.\n' + '\n $ ully collections:new'.bold.white);
                    process.exit();
                }
                var prompts = [{
                    type: "list",
                    message: "Choose a collection",
                    name: "collection",
                    choices: list
                }];
                //Ask
                ully.prompt(prompts, function (collectionAnswers) {
                    var prompts = [{
                        type: 'input',
                        name: 'name',
                        message: 'Enter a name'
                    }, {
                        type: 'input',
                        name: 'slug',
                        message: 'Enter a slug'
                    }, {
                        type: "confirm",
                        message: "This is a public collection?",
                        name: "public",
                        default: true
                    }];
                    //Ask
                    ully.prompt(prompts, function (answers) {
                        ully.updateCollections(collectionAnswers.collection, answers.name, answers.slug, answers.public);
                    });
                });
            });
        });

    /*
     * Ully deleteCollections
     */

    program
        .command('collections:delete')
        .description('Delete a specific collection'.white)
        .action(function () {
            ully.listCollections(function (list) {
                if (list.length < 1) {
                    console.log(' You don\'t have collections. \n Create your first collection.\n' + '\n $ ully collections:new'.bold.white);
                    process.exit();
                }
                var prompts = [{
                    type: "list",
                    message: "Choose a collection",
                    name: "collection",
                    choices: list
                }, {
                    type: 'confirm',
                    name: 'delete',
                    message: 'Are you sure you want to delete this collection?'
                }, {
                    type: 'confirm',
                    name: 'delete2',
                    message: 'Do you confirm the collection deletion?'
                }];
                //Ask
                ully.prompt(prompts, function (answers) {
                    if (answers.delete) {
                        if (answers.delete2) {
                            ully.deleteCollections(answers.collection);
                        }
                    }
                });
            });
        });


    /*
     * Ully createUrl
     */

    program
        .command('collections:newurl')
        .description('Create a new url in selected collection'.white)
        .action(function () {
            ully.listCollections(function (list) {
                if (list.length < 1) {
                    console.log(' You don\'t have collections. \n Create your first collection.\n' + '\n $ ully collections:new'.bold.white);
                    process.exit();
                }
                var prompts = [{
                    type: "list",
                    message: "Choose a collection",
                    name: "collection",
                    choices: list
                }];
                //Ask
                ully.prompt(prompts, function (collectionAnswers) {
                    var prompts = [{
                        type: 'input',
                        name: 'url',
                        message: 'Enter a url'
                    }, {
                        type: 'input',
                        name: 'description',
                        message: 'Enter a description'
                    }];
                    //Ask
                    ully.prompt(prompts, function (answers) {
                        ully.createUrls(collectionAnswers.collection, answers.url, answers.description);
                    });
                });
            });
        });

    /*
     * Ully updateUrl
     */

    program
        .command('collections:updateurl')
        .description('Update a url in selected collection'.white)
        .action(function () {
            ully.listCollections(function (list) {
                if (list.length < 1) {
                    console.log(' You don\'t have collections. \n Create your first collection.\n' + '\n $ ully collections:new'.bold.white);
                    process.exit();
                }
                var prompts = [{
                    type: "list",
                    message: "Choose a collection",
                    name: "collection",
                    choices: list
                }];
                //Ask
                ully.prompt(prompts, function (collectionAnswers) {
                    ully.listUrls(collectionAnswers.collection, function (urlList) {
                        if (urlList.length < 1) {
                            console.log(' You don\'t have urls. \n Create your first url.\n' + '\n $ ully collections:newurl'.bold.white);
                            process.exit();
                        }
                        var prompts = [{
                            type: "list",
                            message: "Choose a url to update",
                            name: "urltoupdate",
                            choices: urlList
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
                        ully.prompt(prompts, function (answers) {
                            ully.updateUrls(collectionAnswers.collection, answers.urltoupdate, answers.url, answers.description);
                        });
                    });
                });
            });
        });

    /*
     * Ully deleteUrl
     */

    program
        .command('collections:deleteurl')
        .description('Delete a url in selected collection'.white)
        .action(function () {
            ully.listCollections(function (list) {
                if (list.length < 1) {
                    console.log(' You don\'t have collections. \n Create your first collection.\n' + '\n $ ully collections:new'.bold.white);
                    process.exit();
                }
                var prompts = [{
                    type: "list",
                    message: "Choose a collection",
                    name: "collection",
                    choices: list
                }];
                //Ask
                ully.prompt(prompts, function (collectionAnswers) {
                    ully.listUrls(collectionAnswers.collection, function (urlList) {
                        if (urlList.length < 1) {
                            console.log(' You don\'t have urls. \n Create your first url.\n' + '\n $ ully collections:newurl'.bold.white);
                            process.exit();
                        }
                        var prompts = [{
                            type: "checkbox",
                            message: "Choose a urls to delete",
                            name: "urlstodelete",
                            choices: urlList,
                            validate: function (answer) {
                                if (answer.length < 1) {
                                    return "You must choose at least one topping.";
                                }
                                return true;
                            }
                        }, {
                            type: 'confirm',
                            name: 'delete',
                            message: 'Are you sure you want to delete these urls?'
                        }, {
                            type: 'confirm',
                            name: 'delete2',
                            message: 'Do you confirm the url deletion?'
                        }];
                        //Ask
                        ully.prompt(prompts, function (answers) {
                            if (answers.delete) {
                                if (answers.delete2) {
                                    ully.deleteUrls(collectionAnswers.collection, answers.urlstodelete);
                                }
                            }
                        });
                    });
                });
            });
        });
}

/*
 * Ully on help ption show examples
 */

program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ ully signup');
    console.log('    $ ully login');
    console.log('    $ ully forgot');
    console.log('    $ ully logout');
    console.log('');
});

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

if (process.argv.length == 2) {
    program.help();
}
