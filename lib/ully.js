/*
 * ully
 * https://github.com/enytc/ully
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the BSD license.
 */

'use strict';

/*
 * Module Dependencies
 */

var request = require('superagent');
var inquirer = require('inquirer');
var debug = require('./debugger.js');
var async = require('async');
var _ = require('underscore');
var h = require('./helpers.js');
var pj = require('prettyjson').render;
var join = require('path').join;

/*
 * Private Methods
 */

function response(err, res, pureJson, message, type) {
    if (err) {
        throw err;
    }
    if (res) {
        if (!pureJson) {
            console.log('\n[ ' + 'Response'.green.bold + ' ] ==> ');
            console.log();
            console.log(pj(res.body));
        } else {
            console.log(JSON.stringify(res.body, null, 4));
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
 * Public Methods
 */

/**
 * @class Ully
 *
 * @constructor
 *
 * Constructor responsible for provide api requests
 *
 * @example
 *
 *     var api = new Ully('access_token');
 *
 * @param {String} access_token Access Token
 */

var Ully = module.exports = function Ully(token) {
    //Access Token
    this.access_token = token;
    //apiUri
    this.uri = 'https://ully.herokuapp.com';
    var apiUri = 'https://ully.herokuapp.com/:path';
    //Get handler
    this.get = function (path, cb) {
        request
            .get(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Post handler
    this.post = function (path, body, cb) {
        request
            .post(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Put handler
    this.put = function (path, body, cb) {
        request
            .put(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Delete handler
    this.delete = function (path, body, cb) {
        request
            .del(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
};

//HandlerExceptions
process.on('uncaughtException', function (err) {
    console.log();
    console.error(err.stack);
    console.error(err);
});

/**
 * Method responsible for asking questions
 *
 * @example
 *
 *     api.prompt(prompts, cb);
 *
 * @method prompt
 * @public
 * @param {Object} prompts Array of prompt options
 * @param {Function} cb A callback
 */

Ully.prototype.prompt = function prompt(prompts, cb) {
    inquirer.prompt(prompts, function (answers) {
        cb(answers);
    });
};

/**
 * Method responsible for create accounts
 *
 * @example
 *
 *     api.signup('name', 'email', 'username', 'password');
 *
 * @method signup
 * @public
 * @param {String} name Name
 * @param {String} email Email
 * @param {String} username Username
 * @param {String} password Password
 */

Ully.prototype.signup = function signup(name, email, username, password) {
    this.post('signup', {
        name: name,
        email: email,
        username: username,
        password: password
    }, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for login in accounts
 *
 * @example
 *
 *     api.login('email', 'username', 'password');
 *
 * @method login
 * @public
 * @param {String} email Email
 * @param {String} password Password
 */

Ully.prototype.login = function login(email, password) {
    this.post('forgot/token', {
        email: email,
        password: password
    }, function (err, res) {
        if (err) {
            response(err);
        }
        //Write config
        if (res.body.token && res.body.role) {
            h.write(join(__dirname, 'ullyConfig.json'), JSON.stringify(res.body, null, 4));
            response(null, null, null, 'Logged successfully!', 'success');
        } else {
            response(null, null, null, 'Login failed. Try again!', 'error');
        }
    });
};

/**
 * Method responsible for reset passwords
 *
 * @example
 *
 *     api.forgot('email', 'username');
 *
 * @method forgot
 * @public
 * @param {String} email Email
 * @param {String} username Username
 */

Ully.prototype.forgot = function forgot(email, username) {
    this.post('forgot', {
        email: email,
        username: username
    }, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for showing stats of Ully
 *
 * @example
 *
 *     api.stats();
 *
 * @method stats
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Ully.prototype.stats = function stats(pureJson) {
    this.get('stats', function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res, pureJson);
    });
};

/**
 * Method responsible for showing stats of a specific user
 *
 * @example
 *
 *     api.statsByUsername();
 *
 * @method statsByUsername
 * @public
 * @param {String} username Username
 * @param {Boolean} pureJson If true show json raw
 */

Ully.prototype.statsByUsername = function statsByUsername(username, pureJson) {
    this.get(join('stats', username, '?:token'), function (err, res) {
        if (err) {
            response(err);
        }
        //Delete user info
        delete res.body.user;
        response(null, res, pureJson);
    });
};

/**
 * Method responsible for showing the status of api
 *
 * @example
 *
 *     api.status();
 *
 * @method status
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Ully.prototype.status = function status(pureJson) {
    this.get('status', function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res, pureJson);
    });
};


/**
 * Method responsible for showing profile info
 *
 * @example
 *
 *     api.me();
 *
 * @method me
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Ully.prototype.me = function me(pureJson) {
    this.get('me?:token', function (err, res) {
        if (err) {
            response(err);
        }
        var obj = {
            body: _.pick(res.body, ['name', 'email', 'username', 'status'])
        }
        response(null, obj, pureJson);
    });
};

/**
 * Method responsible for update profile info
 *
 * @example
 *
 *     api.updateMe('name', email', 'username', 'password');
 *
 * @method updateMe
 * @public
 * @param {String} name Name
 * @param {String} email Email
 * @param {String} username Username
 * @param {String} password Password
 */

Ully.prototype.updateMe = function updateMe(name, email, username, password) {
    var meObj = {
        name: name,
        email: email,
        username: username,
        password: password
    };
    _.each(meObj, function (val, key) {
        if (meObj[key] === '') {
            delete meObj[key];
        }
    });
    this.put('me?:token', meObj, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, null, null, res.body.message);
    });
};

/**
 * Method responsible for delete profile info
 *
 * @example
 *
 *     api.deleteMe();
 *
 * @method deleteMe
 * @public
 */

Ully.prototype.deleteMe = function deleteMe() {

    this.delete('me?:token', null, function (err, res) {
        if (err) {
            response(err);
        }
        if (h.exists(__dirname + '/ullyConfig.json')) {
            h.remove(__dirname + '/ullyConfig.json');
        }
        response(null, null, null, res.body.message);
    });
};

/**
 * Method responsible for list all users
 *
 * @example
 *
 *     api.users();
 *
 * @method users
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Ully.prototype.users = function users(pureJson) {
    this.get('users?:token', function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for showing info of a specific user by username
 *
 * @example
 *
 *     api.UsersByUsername();
 *
 * @method UsersByUsername
 * @public
 * @param {String} username Username
 * @param {Boolean} pureJson If true show json raw
 */

Ully.prototype.UsersByUsername = function UsersByUsername(username, pureJson) {
    this.get(join('users', 'id', username, '?:token'), function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res, pureJson);
    });
};

/**
 * Method responsible for showing info of a specific user
 *
 * @example
 *
 *     api.usersShow();
 *
 * @method usersShow
 * @public
 * @param {String} userid Username
 * @param {Boolean} pureJson If true show json raw
 */

Ully.prototype.usersShow = function usersShow(userid, pureJson) {
    this.get(join('users', userid, '?:token'), function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res, pureJson);
    });
};

/**
 * Method responsible for create a new user
 *
 * @example
 *
 *     api.createUsers('name', email', 'username', 'password', 'role', 'status');
 *
 * @method createUsers
 * @public
 * @param {String} name Name
 * @param {String} email Email
 * @param {String} username Username
 * @param {String} password Password
 * @param {String} role User role
 * @param {Boolean} status User status
 */

Ully.prototype.createUsers = function createUsers(name, email, username, password, role, status) {
    this.post('users?:token', {
        name: name,
        email: email,
        username: username,
        password: password,
        role: role,
        status: status
    }, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for update a specific user info
 *
 * @example
 *
 *     api.updateUsers('userid', 'name', email', 'username', 'password', 'role', 'status');
 *
 * @method updateUsers
 * @public
 * @param {String} userid User ID
 * @param {String} name Name
 * @param {String} email Email
 * @param {String} username Username
 * @param {String} password Password
 * @param {String} role User role
 * @param {Boolean} status User status
 */

Ully.prototype.updateUsers = function updateUsers(userid, name, email, username, password, role, status) {
    var usersObj = {
        name: name,
        email: email,
        username: username,
        password: password,
        role: role,
        status: status
    };
    _.each(usersObj, function (val, key) {
        if (usersObj[key] === '') {
            delete usersObj[key];
        }
    });
    this.put(join('users', userid, '?:token'), usersObj, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for remove a specific user info
 *
 * @example
 *
 *     api.deleteUsers('userid');
 *
 * @method deleteUsers
 * @public
 * @param {String} userid User ID
 */

Ully.prototype.deleteUsers = function deleteUsers(userid) {
    this.delete(join('users', userid, '?:token'), null, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for list all collections
 *
 * @example
 *
 *     api.moderation();
 *
 * @method moderation
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Ully.prototype.moderation = function moderation(pureJson) {
    this.get('moderation?:token', function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for generate a dinamic list of collections
 *
 * @example
 *
 *     api.listCollectionsByUserId();
 *
 * @method listCollectionsByUserId
 * @public
 * @param {String} userid User ID
 * @param {Function} cb A callback
 */

Ully.prototype.listCollectionsByUserId = function listCollectionsByUserId(userid, cb) {
    this.get(join('moderation', userid, '?:token'), function (err, res) {
        if (err) {
            throw err;
        }
        var list = [];
        //Start
        _.each(res.body, function (val, key) {
            list.push({
                name: val.name + ' -> ' + val.slug,
                value: val.slug
            });
        });
        //Callback
        cb(list);
    });
};

/**
 * Method responsible for generate a dinamic list of urls in selected collection
 *
 * @example
 *
 *     api.listUrlsOnSelectedCollection();
 *
 * @method listUrlsOnSelectedCollection
 * @public
 * @param {String} userid User ID
 * @param {Function} cb A callback
 */

Ully.prototype.listUrlsOnSelectedCollection = function listUrlsOnSelectedCollection(userid, cb) {
    this.get(join('moderation', userid, '?:token'), function (err, res) {
        if (err) {
            throw err;
        }
        var list = [];
        //Start
        _.each(res.body, function (val, key) {
            _.each(val.urls, function (uval, ukey) {
                list.push({
                    name: uval.url,
                    value: uval._id
                });
            });
        });
        //Callback
        cb(list);
    });
};

/**
 * Method responsible for list all collections by userid
 *
 * @example
 *
 *     api.moderationShowCollectionByUser();
 *
 * @method moderationShowCollectionByUser
 * @public
 * @param {String} userid User ID
 * @param {Boolean} pureJson If true show json raw
 */

Ully.prototype.moderationShowCollectionByUser = function moderationShowCollectionByUser(userid, pureJson) {
    this.get(join('moderation', userid, '?:token'), function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for delete a specific collection
 *
 * @example
 *
 *     api.moderationDeleteCollection('userid', 'collection');
 *
 * @method moderationDeleteCollection
 * @public
 * @param {String} userid User ID
 * @param {String} collection Collection ID
 */

Ully.prototype.moderationDeleteCollection = function moderationDeleteCollection(userid, collection) {
    this.delete(join('moderation', userid, collection, '?:token'), null, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for delete a specific url in selected collection
 *
 * @example
 *
 *     api.moderationDeleteUrl('userid', 'collection', 'urlid');
 *
 * @method moderationDeleteUrl
 * @public
 * @param {String} userid User ID
 * @param {String} collection Collection ID
 * @param {String} urlid Url ID
 */

Ully.prototype.moderationDeleteUrl = function moderationDeleteUrl(userid, collection, urlid) {
    this.delete(join('moderation', userid, collection, 'urls', urlid, '?:token'), null, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for list all collections
 *
 * @example
 *
 *     api.collections();
 *
 * @method collections
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Ully.prototype.collections = function collections(pureJson) {
    this.get('collections?fields=name,slug,urls,public&:token', function (err, res) {
        if (err) {
            response(err);
        }
        if (res.body.length < 1) {
            console.log('  You don\'t have collections. \n  Create your first collection.\n' + '\n  $ ully collections:new'.bold.white);
            process.exit();
        }
        response(null, res);
    });
};


/**
 * Method responsible for list all collections of a specific user
 *
 * @example
 *
 *     api.collectionsByUsername();
 *
 * @method collectionsByUsername
 * @public
 * @param {String} username Username
 * @param {Boolean} pureJson If true show json raw
 */

Ully.prototype.collectionsByUsername = function collectionsByUsername(username, pureJson) {
    this.get(join('collections', 'of', username, '?fields=name,slug,urls,public&:token'), function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};


/**
 * Method responsible for generate a dinamic list of collections
 *
 * @example
 *
 *     api.listCollections();
 *
 * @method listCollections
 * @public
 * @param {Function} cb A callback
 */

Ully.prototype.listCollections = function listCollections(cb) {
    this.get('collections?:token', function (err, res) {
        if (err) {
            throw err;
        }
        var list = [];
        //Start
        _.each(res.body, function (val, key) {
            list.push({
                name: val.name + ' -> ' + val.slug,
                value: val.slug
            });
        });
        //Callback
        cb(list);
    });
};

/**
 * Method responsible for generate a dinamic list of urls
 *
 * @example
 *
 *     api.listUrls();
 *
 * @method listUrls
 * @public
 * @param {String} collection Username
 * @param {Function} cb A callback
 */

Ully.prototype.listUrls = function listUrls(collection, cb) {
    this.get('collections?:token', function (err, res) {
        if (err) {
            throw err;
        }
        var list = [];
        var selectedCollection = _.where(res.body, {
            slug: collection
        });
        //Start
        _.each(selectedCollection[0].urls, function (val, key) {
            list.push({
                name: val.url,
                value: val._id
            });
        });
        //Callback
        cb(list);
    });
};

/**
 * Method responsible for create a new collection
 *
 * @example
 *
 *     api.createCollections('name', 'slug', 'public');
 *
 * @method createCollections
 * @public
 * @param {String} name Name
 * @param {String} slug Slug
 * @param {Boolean} publicCollection Public Collection
 */

Ully.prototype.createCollections = function createCollections(name, slug, publicCollection) {
    this.post('collections?:token', {
        name: name,
        slug: slug,
        public: publicCollection
    }, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for update a specific collection
 *
 * @example
 *
 *     api.updateCollections('collectionSlug', 'name', 'slug', 'public');
 *
 * @method updateCollections
 * @public
 * @param {String} collectionSlug Slug
 * @param {String} name Name
 * @param {String} slug Slug
 * @param {Boolean} publicCollection Public Collection
 */

Ully.prototype.updateCollections = function updateCollections(collectionSlug, name, slug, publicCollection) {
    var collectionsObj = {
        name: name,
        slug: slug,
        public: publicCollection
    };
    _.each(collectionsObj, function (val, key) {
        if (collectionsObj[key] === '') {
            delete collectionsObj[key];
        }
    });
    this.put(join('collections', collectionSlug, '?:token'), collectionsObj, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, null, null, res.body.message);
    });
};

/**
 * Method responsible for delete a specific collection
 *
 * @example
 *
 *     api.deleteCollections('collectionSlug');
 *
 * @method updateCollections
 * @public
 * @param {String} collectionSlug Slug
 */

Ully.prototype.deleteCollections = function deleteCollections(collectionSlug) {
    this.delete(join('collections', collectionSlug, '?:token'), null, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, null, null, res.body.message);
    });
};

/**
 * Method responsible for create a new url
 *
 * @example
 *
 *     api.createUrls('collectionSlug', 'title', 'url', 'description');
 *
 * @method createUrls
 * @public
 * @param {String} collectionSlug Collection Slug
 * @param {String} title Title
 * @param {String} url Url
 * @param {String} description Description of url
 */

Ully.prototype.createUrls = function createUrls(collectionSlug, title, url, description) {
    this.post(join('collections', collectionSlug, 'urls', '?:token'), {
        title: title,
        url: url,
        description: description
    }, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for update a specific url
 *
 * @example
 *
 *     api.updateUrls('collectionSlug', 'title', 'url', 'description');
 *
 * @method updateUrls
 * @public
 * @param {String} collectionSlug Collection Slug
 * @param {String} urlid Url ID
 * @param {String} title Title
 * @param {String} url Url
 * @param {String} description Description of url
 */

Ully.prototype.updateUrls = function updateUrls(collectionSlug, urlid, title, url, description) {
    var urlsObj = {
        title: title,
        url: url,
        description: description
    };
    _.each(urlsObj, function (val, key) {
        if (urlsObj[key] === '') {
            delete urlsObj[key];
        }
    });
    this.put(join('collections', collectionSlug, 'urls', urlid, '?:token'), urlsObj, function (err, res) {
        if (err) {
            response(err);
        }
        response(null, null, null, res.body.message);
    });
};

/**
 * Method responsible for delete a specific url
 *
 * @example
 *
 *     api.deleteUrls('collectionSlug', urlsid);
 *
 * @method deleteUrls
 * @public
 * @param {String} collectionSlug Slug
 * @param {String} urlsid Array of urls id
 */

Ully.prototype.deleteUrls = function deleteUrls(collectionSlug, urlsid) {
    var self = this;
    async.eachSeries(urlsid, function (item, cb) {
        self.delete(join('collections', collectionSlug, 'urls', item, '?:token'), null, function (err, res) {
            if (err) {
                cb(err);
            }
            response(null, null, null, res.body.message);
            cb(null);
        });
    }, function (err) {
        if (err) {
            response(err);
        }
    });
};
