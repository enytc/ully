/*
 * ully-cli
 * https://github.com/ullyin/ully-cli
 *
 * Copyright (c) 2015, EnyTC Corporation
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
    this.delete = function(path, callback) {
        request
            .del(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.AccessToken))
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
        h.write(join(__dirname, 'ullyConfig.json'), JSON.stringify({
            accessToken: accessToken
        }, null, 4));
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
    this.get('collections?:token', function(err, res) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                var obj = _.map(res.body.response, function(o) {
                    return _.pick(o, ['id', 'name', 'slug', 'urls', 'createdAt', 'updatedAt']);
                });
                callback(null, obj);
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
 * Method responsible for create a new collection
 *
 * @example
 *
 *     api.createCollection('name', 'slug', 'public', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method createCollection
 * @public
 * @param {String} name Name
 * @param {String} slug Slug
 * @param {Boolean} publicCollection Public Collection
 * @param {Function} callback A callback with api response
 */

Ully.prototype.createCollection = function createCollection(name, slug, publicCollection, callback) {
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
 * Method responsible for create a new url
 *
 * @example
 *
 *     api.addUrl('collectionSlug', 'url', 'title', 'description', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method addUrl
 * @public
 * @param {String} collectionSlug Collection Slug
 * @param {String} url Url
 * @param {String} title Title
 * @param {String} description Description of url
 * @param {Function} callback A callback with api response
 */

Ully.prototype.addUrl = function addUrl(collectionSlug, url, title, description, callback) {
    this.post(join('collections', 'urls', '?:token'), {
        title: title,
        url: url,
        description: description,
        slug: collectionSlug
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
 * Method responsible for list all shortened urls
 *
 * @example
 *
 *     api.shortenedUrls(function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method shortenedUrls
 * @public
 * @param {Function} callback A callback with api response
 */

Ully.prototype.shortenedUrls = function shortenedUrls(callback) {
    this.get('shortener?:token', function(err, res) {
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
 * Method responsible for generate a dinamic list of shortened urls
 *
 * @example
 *
 *     api.listShortenedUrls();
 *
 * @method listShortenedUrls
 * @public
 * @param {Function} callback A callback
 */

Ully.prototype.listShortenedUrls = function listShortenedUrls(callback) {
    this.get('shortener?:token', function(err, res) {
        if (err) {
            throw err;
        }
        var list = [];
        //Start
        _.each(res.body.response, function(val) {
            list.push({
                name: val.url,
                value: val.shortenedUrl
            });
        });
        //Callback
        callback(list);
    });
};

/**
 * Method responsible for shorten urls
 *
 * @example
 *
 *     api.shortenUrl('url', 'shortcode', 'password', function(err, data) {
 *          console.log(data);
 *     });
 *
 * @method shortenUrl
 * @public
 * @param {String} url Url to shorten
 * @param {String} shortcode A custom shortcode (optional)
 * @param {String} password A password to protect this url (optional)
 * @param {Function} callback A callback with api response
 */

Ully.prototype.shortenUrl = function shortenUrl(url, shortcode, password, callback) {
    this.post('shortener?:token', {
        url: url,
        shortcode: shortcode,
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
