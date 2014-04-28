/*
 * ully
 * https://github.com/enytc/ully
 *
 * Copyright (c) 2014, EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

/*
 * Module Dependencies
 */

var request = require('superagent'),
    inquirer = require('inquirer'),
    debug = require('./debugger.js'),
    async = require('async'),
    _ = require('underscore'),
    h = require('./helpers.js'),
    join = require('path').join;

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
    this.uri = process.env.ULLY_URI || 'https://ully.in/api/';
    var apiUri = this.uri + ':path';
    //Get handler
    this.get = function(path, callback) {
        request
            .get(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .set('Accept', 'application/json')
            .end(callback);
    };
    //Post handler
    this.post = function(path, body, callback) {
        request
            .post(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(callback);
    };
    //Put handler
    this.put = function(path, body, callback) {
        request
            .put(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(callback);
    };
    //Delete handler
    this.delete = function(path, body, callback) {
        request
            .del(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(callback);
    };
};

//HandlerExceptions
process.on('uncaughtException', function(err) {
    console.log();
    console.error(err.stack);
    console.error(err);
});

/**
 * Method responsible for asking questions
 *
 * @example
 *
 *     api.prompt(prompts, callback);
 *
 * @method prompt
 * @public
 * @param {Object} prompts Array of prompt options
 * @param {Function} callback A callback
 */

Ully.prototype.prompt = function prompt(prompts, callback) {
    inquirer.prompt(prompts, function(answers) {
        callback(answers);
    });
};

/**
 * Method responsible for login in accounts
 *
 * @example
 *
 *     api.login('email', 'username', 'password', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method login
 * @public
 * @param {String} email Email
 * @param {String} password Password
 * @param {Function} callback A callback with api response
 */

Ully.prototype.login = function login(email, password, callback) {
    this.post('forgot/access_token', {
        email: email,
        password: password
    }, function(err, res) {
        if (callback) {
            if (err) {
                return callback(err);
            }
            //Write config
            if (res.body.response.hasOwnProperty('access_token') && res.body.response.hasOwnProperty('role')) {
                h.write(join(__dirname, 'ullyConfig.json'), JSON.stringify(res.body.response, null, 4));
                return callback(null, {
                    message: 'Logged successfully!'
                });
            } else {
                return callback(null, {
                    message: 'Login failed. Try again!'
                });
            }
        }
    });
};

/**
 * Method responsible for showing stats of Ully
 *
 * @example
 *
 *     api.stats(function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method stats
 * @public
 * @param {Function} callback A callback with api response
 */

Ully.prototype.stats = function stats(callback) {
    this.get('stats', function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for showing stats of a specific user
 *
 * @example
 *
 *     api.statsByUsername('myusername', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method statsByUsername
 * @public
 * @param {String} username Username
 * @param {Function} callback A callback with api response
 */

Ully.prototype.statsByUsername = function statsByUsername(username, callback) {
    this.get(join('stats', username, '?:token'), function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for showing the status of api
 *
 * @example
 *
 *     api.status(function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method status
 * @public
 * @param {Function} callback A callback with api response
 */

Ully.prototype.status = function status(callback) {
    this.get('status', function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};


/**
 * Method responsible for showing profile info
 *
 * @example
 *
 *     api.me(function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method me
 * @public
 * @param {Function} callback A callback with api response
 */

Ully.prototype.me = function me(callback) {
    this.get('me?:token', function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for update profile info
 *
 * @example
 *
 *     api.updateMe('name', email', 'username', 'currentPassword', 'password', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method updateMe
 * @public
 * @param {String} name Name
 * @param {String} email Email
 * @param {String} username Username
 * @param {String} currentPassword Current Password
 * @param {String} password Password
 * @param {Function} callback A callback with api response
 */

Ully.prototype.updateMe = function updateMe(name, email, username, currentPassword, password, callback) {
    this.put('me?:token', {
        name: name,
        email: email,
        username: username,
        currentpassword: currentPassword,
        password: password
    }, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for delete profile info
 *
 * @example
 *
 *     api.deleteMe(function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method deleteMe
 * @public
 * @param {Function} callback A callback with api response
 */

Ully.prototype.deleteMe = function deleteMe(callback) {
    this.delete('me?:token', null, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            }
            if (h.exists(__dirname + '/ullyConfig.json')) {
                h.remove(__dirname + '/ullyConfig.json');
            }
            if (!err) {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for list all users
 *
 * @example
 *
 *     api.users(function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method users
 * @public
 * @param {Function} callback A callback with api response
 */

Ully.prototype.users = function users(callback) {
    this.get('users?:token', function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for showing info of a specific user by username
 *
 * @example
 *
 *     api.UsersByUsername('myusername', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method UsersByUsername
 * @public
 * @param {String} username Username
 * @param {Function} callback A callback with api response
 */

Ully.prototype.UsersByUsername = function UsersByUsername(username, callback) {
    this.get(join('users', 'id', username, '?:token'), function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for showing info of a specific user
 *
 * @example
 *
 *     api.usersShow('userID', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method usersShow
 * @public
 * @param {String} userID User ID
 * @param {Function} callback A callback with api response
 */

Ully.prototype.usersShow = function usersShow(userID, callback) {
    this.get(join('users', userID, '?:token'), function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for create a new user
 *
 * @example
 *
 *     api.createUsers('name', email', 'username', 'password', 'role', 'status', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method createUsers
 * @public
 * @param {String} name Name
 * @param {String} email Email
 * @param {String} username Username
 * @param {String} password Password
 * @param {String} role User role
 * @param {Boolean} status User status
 * @param {Function} callback A callback with api response
 */

Ully.prototype.createUsers = function createUsers(name, email, username, password, role, status, callback) {
    this.post('users?:token', {
        name: name,
        email: email,
        username: username,
        password: password,
        role: role,
        status: status
    }, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for update a specific user info
 *
 * @example
 *
 *     api.updateUsers('userID', 'name', email', 'username', 'password', 'role', 'status', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method updateUsers
 * @public
 * @param {String} userID User ID
 * @param {String} name Name
 * @param {String} email Email
 * @param {String} username Username
 * @param {String} password Password
 * @param {String} role User role
 * @param {Boolean} status User status
 * @param {Function} callback A callback with api response
 */

Ully.prototype.updateUsers = function updateUsers(userID, name, email, username, password, role, status, callback) {
    this.put(join('users', userID, '?:token'), {
        name: name,
        email: email,
        username: username,
        password: password,
        role: role,
        status: status
    }, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for remove a specific user info
 *
 * @example
 *
 *     api.deleteUsers('userID', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method deleteUsers
 * @public
 * @param {String} userID User ID
 * @param {Function} callback A callback with api response
 */

Ully.prototype.deleteUsers = function deleteUsers(userID, callback) {
    this.delete(join('users', userID, '?:token'), null, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for list all collections
 *
 * @example
 *
 *     api.moderation(function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method moderation
 * @public
 * @param {Function} callback A callback with api response
 */

Ully.prototype.moderation = function moderation(callback) {
    this.get('moderation?:token', function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
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
 * @param {String} userID User ID
 * @param {Function} callback A callback
 */

Ully.prototype.listCollectionsByUserId = function listCollectionsByUserId(userID, callback) {
    this.get(join('moderation', userID, '?:token'), function(err, res) {
        if (err) {
            throw err;
        }
        var list = [];
        //Start
        _.each(res.body.response, function(val, key) {
            list.push({
                name: val.name + ' -> ' + val.slug,
                value: val.slug
            });
        });
        //Callback
        callback(list);
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
 * @param {String} userID User ID
 * @param {Function} callback A callback
 */

Ully.prototype.listUrlsOnSelectedCollection = function listUrlsOnSelectedCollection(userID, callback) {
    this.get(join('moderation', userID, '?:token'), function(err, res) {
        if (err) {
            throw err;
        }
        var list = [];
        //Start
        _.each(res.body.response, function(val, key) {
            _.each(val.urls, function(uval, ukey) {
                list.push({
                    name: uval.url,
                    value: uval._id
                });
            });
        });
        //Callback
        callback(list);
    });
};

/**
 * Method responsible for list all collections by userID
 *
 * @example
 *
 *     api.moderationShowCollectionByUser('userID', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method moderationShowCollectionByUser
 * @public
 * @param {String} userID User ID
 * @param {Function} callback A callback with api response
 */

Ully.prototype.moderationShowCollectionByUser = function moderationShowCollectionByUser(userID, callback) {
    this.get(join('moderation', userID, '?:token'), function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for delete a specific collection
 *
 * @example
 *
 *     api.moderationDeleteCollection('userID', 'collection', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method moderationDeleteCollection
 * @public
 * @param {String} userID User ID
 * @param {String} collection Collection ID
 * @param {Function} callback A callback with api response
 */

Ully.prototype.moderationDeleteCollection = function moderationDeleteCollection(userID, collection, callback) {
    this.delete(join('moderation', userID, collection, '?:token'), null, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for delete a specific url in selected collection
 *
 * @example
 *
 *     api.moderationDeleteUrl('userID', 'collection', 'urlID', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method moderationDeleteUrl
 * @public
 * @param {String} userID User ID
 * @param {String} collection Collection ID
 * @param {String} urlID Url ID
 * @param {Function} callback A callback with api response
 */

Ully.prototype.moderationDeleteUrl = function moderationDeleteUrl(userID, collection, urlID, callback) {
    this.delete(join('moderation', userID, collection, 'urls', urlID, '?:token'), null, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for list all collections
 *
 * @example
 *
 *     api.collections(function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method collections
 * @public
 * @param {Function} callback A callback with api response
 */

Ully.prototype.collections = function collections(callback) {
    this.get('collections?fields=name,slug,urls,public&:token', function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};


/**
 * Method responsible for list all collections of a specific user
 *
 * @example
 *
 *     api.collectionsByUsername('myusername', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method collectionsByUsername
 * @public
 * @param {String} username Username
 * @param {Function} callback A callback with api response
 */

Ully.prototype.collectionsByUsername = function collectionsByUsername(username, callback) {
    this.get(join('collections', 'of', username, '?fields=name,slug,urls,public&:token'), function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
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
 * @param {Function} callback A callback
 */

Ully.prototype.listCollections = function listCollections(callback) {
    this.get('collections?:token', function(err, res) {
        if (err) {
            throw err;
        }
        var list = [];
        //Start
        _.each(res.body.response, function(val, key) {
            list.push({
                name: val.name + ' -> ' + val.slug,
                value: val.slug
            });
        });
        //Callback
        callback(list);
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
 * @param {Function} callback A callback
 */

Ully.prototype.listUrls = function listUrls(collection, callback) {
    this.get('collections?:token', function(err, res) {
        if (err) {
            throw err;
        }
        var list = [];
        var selectedCollection = _.where(res.body.response, {
            slug: collection
        });
        //Start
        _.each(selectedCollection[0].urls, function(val, key) {
            list.push({
                name: val.url,
                value: val._id
            });
        });
        //Callback
        callback(list);
    });
};

/**
 * Method responsible for create a new collection
 *
 * @example
 *
 *     api.createCollections('name', 'slug', 'public', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method createCollections
 * @public
 * @param {String} name Name
 * @param {String} slug Slug
 * @param {Boolean} publicCollection Public Collection
 * @param {Function} callback A callback with api response
 */

Ully.prototype.createCollections = function createCollections(name, slug, publicCollection, callback) {
    this.post('collections?:token', {
        name: name,
        slug: slug,
        public: publicCollection
    }, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for update a specific collection
 *
 * @example
 *
 *     api.updateCollections('collectionSlug', 'name', 'slug', 'public', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method updateCollections
 * @public
 * @param {String} collectionSlug Slug
 * @param {String} name Name
 * @param {String} slug Slug
 * @param {Boolean} publicCollection Public Collection
 * @param {Function} callback A callback with api response
 */

Ully.prototype.updateCollections = function updateCollections(collectionSlug, name, slug, publicCollection, callback) {
    this.put(join('collections', collectionSlug, '?:token'), {
        name: name,
        slug: slug,
        public: publicCollection
    }, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for delete a specific collection
 *
 * @example
 *
 *     api.deleteCollections('collectionSlug', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method deleteCollections
 * @public
 * @param {String} collectionSlug Slug
 * @param {Function} callback A callback with api response
 */

Ully.prototype.deleteCollections = function deleteCollections(collectionSlug, callback) {
    this.delete(join('collections', collectionSlug, '?:token'), null, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for create a new url
 *
 * @example
 *
 *     api.createUrls('collectionSlug', 'url', 'title', 'description', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method createUrls
 * @public
 * @param {String} collectionSlug Collection Slug
 * @param {String} url Url
 * @param {String} title Title
 * @param {String} description Description of url
 * @param {Function} callback A callback with api response
 */

Ully.prototype.createUrls = function createUrls(collectionSlug, url, title, description, callback) {
    this.post(join('collections', collectionSlug, 'urls', '?:token'), {
        title: title,
        url: url,
        description: description
    }, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for update a specific url
 *
 * @example
 *
 *     api.updateUrls('collectionSlug', 'title', 'url', 'description', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method updateUrls
 * @public
 * @param {String} collectionSlug Collection Slug
 * @param {String} urlID Url ID
 * @param {String} url Url
 * @param {String} title Title
 * @param {String} description Description of url
 * @param {Function} callback A callback with api response
 */

Ully.prototype.updateUrls = function updateUrls(collectionSlug, urlID, url, title, description, callback) {
    this.put(join('collections', collectionSlug, 'urls', urlID, '?:token'), {
        title: title,
        url: url,
        description: description
    }, function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, res.body.response);
            }
        }
    });
};

/**
 * Method responsible for delete a specific url
 *
 * @example
 *
 *     api.deleteUrls('collectionSlug', urlsID, function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method deleteUrls
 * @public
 * @param {String} collectionSlug Slug
 * @param {String} urlsID Array of urls id
 * @param {Function} callback A callback with api response
 */

Ully.prototype.deleteUrls = function deleteUrls(collectionSlug, urlsID, callback) {
    var self = this;
    async.eachSeries(urlsID, function(item, cb) {
        self.delete(join('collections', collectionSlug, 'urls', item, '?:token'), null, function(err, res) {
            if (err) {
                cb(err);
            }
            cb(null);
        });
    }, function(err) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(null, {
                    msg: 'All selected urls are successfully deleted!'
                });
            }
        }
    });
};
