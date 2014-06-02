/*
 * ully
 * https://github.com/ullyin/ully
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
 *     var api = new Ully('AccessToken');
 *
 * @param {String} AccessToken Access Token
 */

var Ully = module.exports = function Ully(accessToken) {
    //Access Token
    this.AccessToken = accessToken;
    //apiUri
    this.uri = process.env.ULLY_URI || 'https://ully.in/api/';
    var apiUri = this.uri + ':path';
    //Get handler
    this.get = function(path, callback) {
        request
            .get(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.AccessToken))
            .set('Accept', 'application/json')
            .end(callback);
    };
    //Post handler
    this.post = function(path, body, callback) {
        request
            .post(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.AccessToken))
            .send(body)
            .set('Accept', 'application/json')
            .end(callback);
    };
    //Put handler
    this.put = function(path, body, callback) {
        request
            .put(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.AccessToken))
            .send(body)
            .set('Accept', 'application/json')
            .end(callback);
    };
    //Delete handler
    this.delete = function(path, body, callback) {
        request
            .del(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.AccessToken))
            .send(body)
            .set('Accept', 'application/json')
            .end(callback);
    };
};

//HandlerExceptions
process.on('uncaughtException', function(err) {
    console.log();
    console.error(err);
    console.log();
    console.error(err.stack);
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
 *     api.login('accessToken', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method login
 * @public
 * @param {String} AccessToken A Access Token
 * @param {Function} callback A callback with api response
 */

Ully.prototype.login = function login(accessToken, callback) {
    //Write config
    if (accessToken && accessToken.length > 0) {
        h.write(join(__dirname, 'ullyConfig.json'), JSON.stringify({accessToken: accessToken}, null, 4));
        return callback(null, {
            message: 'Logged successfully!'
        });
    } else {
        return callback(null, {
            message: 'Login failed. Try again!'
        });
    }
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
 *     api.account(function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method account
 * @public
 * @param {Function} callback A callback with api response
 */

Ully.prototype.account = function account(callback) {
    this.get('account?:token', function(err, res) {
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
 *     api.updateAccount('name', email', 'username', 'currentPassword', 'password', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method updateAccount
 * @public
 * @param {String} name Name
 * @param {String} email Email
 * @param {String} username Username
 * @param {String} currentPassword Current Password
 * @param {String} password Password
 * @param {Function} callback A callback with api response
 */

Ully.prototype.updateAccount = function updateAccount(name, email, username, currentPassword, password, callback) {
    this.put('account?:token', {
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
        _.each(res.body.response, function(val) {
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
        _.each(selectedCollection[0].urls, function(val) {
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
        self.delete(join('collections', collectionSlug, 'urls', item, '?:token'), null, function(err) {
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
