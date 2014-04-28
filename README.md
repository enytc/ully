# Ully [![Build Status](https://secure.travis-ci.org/enytc/ully.png?branch=master)](http://travis-ci.org/enytc/ully) [![NPM version](https://badge-me.herokuapp.com/api/npm/ully.png)](http://badges.enytc.com/for/npm/ully) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/enytc/ully/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

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

#### .login(email, password, callback)

**Parameter**: `email`
**Type**: `String`
**Example**: `example@example.com`


**Parameter**: `password`
**Type**: `String`
**Example**: `123456test`


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
api.login('email', '123456test', function(err, data) {
    console.log(data);
});
```

#### .statsByUsername(username, callback)

**Parameter**: `username`
**Type**: `String`
**Example**: `myusername`


**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `statsByUsername` method is responsible for showing statistics of Ully

How to use this method

```javascript
api.stats('myusername', function(err, data) {
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

#### .me(callback)

**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `me` method is responsible for showing profile info

How to use this method

```javascript
api.me(function(err, data) {
    console.log(data);
});
```

#### .updateMe(name, email, username, currentPassword, password, callback)

**Parameter**: `name`
**Type**: `String`
**Example**: `myname`


**Parameter**: `email`
**Type**: `String`
**Example**: `example@example.com`


**Parameter**: `username`
**Type**: `String`
**Example**: `myusername`


**Parameter**: `currentPassword`
**Type**: `String`
**Example**: `123456test`


**Parameter**: `password`
**Type**: `String`
**Example**: `123456test`


**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `updateMe` method is responsible for update profile info

How to use this method

```javascript
api.updateMe('myname', 'email', 'myusername', '123456test', '123456test', function(err, data) {
    console.log(data);
});
```

#### .deleteMe(callback)

**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `deleteMe` method is responsible for delete profile info

How to use this method

```javascript
api.deleteMe(function(err, data) {
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

#### .collectionsByUsername(username, callback)

**Parameter**: `username`
**Type**: `String`
**Example**: `myusername`


**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `collectionsByUsername` method is responsible for list all collections of a specific user

How to use this method

```javascript
api.collectionsByUsername('username', function(err, data) {
    console.log(data);
});
```

#### .createCollections(name, slug, publicCollection, callback)

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

The `createCollections` method is responsible for create a new collection

How to use this method

```javascript
api.createCollections('name', 'slug', true, function(err, data) {
    console.log(data);
});
```

#### .updateCollections(collectionSlug, name, slug, publicCollection, callback)

**Parameter**: `collectionSlug`
**Type**: `String`
**Example**: `favorites`


**Parameter**: `name`
**Type**: `String`
**Example**: `My Favorites`


**Parameter**: `slug`
**Type**: `String`
**Example**: `myfavorites`


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

The `updateCollections` method is responsible for update a specific collection

How to use this method

```javascript
api.updateCollections('collectionSlug', 'name', 'slug', true, function(err, data) {
    console.log(data);
});
```

#### .deleteCollections(collectionSlug, callback)

**Parameter**: `collectionSlug`
**Type**: `String`
**Example**: `favorites`


**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `deleteCollections` method is responsible for delete a specific collection

How to use this method

```javascript
api.deleteCollections('collectionSlug', function(err, data) {
    console.log(data);
});
```

#### .createUrls(collectionSlug, url, title, description, callback)

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

The `createUrls` method is responsible for create a new url

How to use this method

```javascript
api.createUrls('collectionSlug', 'http://example.com', 'Title of url', 'My example page', function(err, data) {
    console.log(data);
});
```

#### .updateUrls(collectionSlug, urlID, url, title, description, callback)

**Parameter**: `collectionSlug`
**Type**: `String`
**Example**: `favorites`


**Parameter**: `urlID`
**Type**: `String`
**Example**: `urlID`


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

The `updateUrls` method is responsible for update a specific url

How to use this method

```javascript
api.updateUrls('collectionSlug', 'urlID', 'http://example.com', 'Title of url', 'My example page', function(err, data) {
    console.log(data);
});
```

#### .deleteUrls(collectionSlug, urlID, callback)

**Parameter**: `collectionSlug`
**Type**: `String`
**Example**: `favorites`


**Parameter**: `urlID`
**Type**: `String`
**Example**: `urlID`


**Parameter**: `callback`
**Type**: `Function`
**Example**: 
```javascript
function(err, data) {
    
}
```

The `deleteUrls` method is responsible for delete a specific url

How to use this method

```javascript
api.deleteUrls('collectionSlug', 'urlID', function(err, data) {
    console.log(data);
});
```

## Contributing

1. Fork it [enytc/ully](https://github.com/enytc/ully/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am "Add some feature"`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

See the [CONTRIBUTING Guidelines](CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/enytc/ully/issues).

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

