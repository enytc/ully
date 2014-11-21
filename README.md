# Ully [![Build Status](https://secure.travis-ci.org/ullyin/ully.png?branch=master)](http://travis-ci.org/ullyin/ully) [![NPM version](https://badge-me.herokuapp.com/api/npm/ully.png)](http://badges.enytc.com/for/npm/ully)

> Manage your favorite links easily and quickly

## Getting Started

Install the module with: 

```bash
$ npm install -g ully
```

```javascript
var Ully = require('ully');
//Create new instance of Ully
var api = new Ully('access_token');
```

## Documentation

#### .login(accessToken, callback)

**Parameter**: `accessToken`
**Type**: `String`
**Example**: `ully_access_token`


**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `login` method is responsible to login in accounts

How to use this method

```javascript
api.login('ully_access_token', function(err, data) {
    console.log(data);
});
```

#### .stats(callback)

**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `stats` method is responsible for showing stats of Ully

How to use this method

```javascript
api.stats(function(err, data) {
    console.log(data);
});
```

#### .status(callback)

**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `status` method is responsible for showing status of the api

How to use this method

```javascript
api.status(function(err, data) {
    console.log(data);
});
```

#### .account(callback)

**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `account` method is responsible for showing profile info

How to use this method

```javascript
api.account(function(err, data) {
    console.log(data);
});
```

#### .collections(callback)

**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `collections` method is responsible for list all collections

How to use this method

```javascript
api.collections(function(err, data) {
    console.log(data);
});
```

#### .createCollection(name, slug, publicCollection, callback)

**Parameter**: `name`
**Type**: `String`
**Example**: `My Favorites`


**Parameter**: `slug`
**Type**: `String`
**Example**: `favorites`


**Parameter**: `publicCollection`
**Type**: `Boolean`
**Example**: `true`


**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `createCollection` method is responsible for create a new collection

How to use this method

```javascript
api.createCollection('name', 'slug', true, function(err, data) {
    console.log(data);
});
```

#### .addUrl(collectionSlug, url, title, description, callback)

**Parameter**: `collectionSlug`
**Type**: `String`
**Example**: `favorites`


**Parameter**: `url`
**Type**: `String`
**Example**: `http://example.com`


**Parameter**: `title`
**Type**: `String`
**Example**: `Title of url`


**Parameter**: `description`
**Type**: `String`
**Example**: `My example page`


**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `addUrl` method is responsible for create a new url

How to use this method

```javascript
api.addUrl('collectionSlug', 'http://example.com', 'Title of url', 'My example page',function(err, data) {
    console.log(data);
});
```

#### .shortenedUrls(callback)

**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `shortenedUrls` method is responsible for list all shortened urls

How to use this method

```javascript
api.shortenedUrls(function(err, data) {
    console.log(data);
});
```

#### .shortenUrl(url, shortcode, password, callback)

**Parameter**: `url`
**Type**: `String`
**Example**: `http://example.com/test/testing/assets/images/img.png`


**Parameter**: `shortcode`
**Type**: `String`
**Example**: `test`


**Parameter**: `password`
**Type**: `String`
**Example**: `12345678`


**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `shortenUrl` method is responsible for shorten strong urls

How to use this method

```javascript
api.shortenUrl('http://example.com/test/testing/assets/images/img.png', 'test', '12345678', function(err, data) {
    console.log(data);
});
```

## Contributing

1. Fork it [ullyin/ully](https://github.com/ullyin/ully/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am "Add some feature"`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

See the [CONTRIBUTING Guidelines](CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/ullyin/ully/issues).

## License

The BSD License

Copyright (c) 2014, EnyTC Corporation

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the EnyTC Corporation nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

