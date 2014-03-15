# Ully [![Build Status](https://secure.travis-ci.org/enytc/ully.png?branch=master)](http://travis-ci.org/enytc/ully) [![NPM version](https://badge-me.herokuapp.com/api/npm/ully.png)](http://badges.enytc.com/for/npm/ully) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/enytc/ully/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

> Manage your favorite links easily and quickly

## Getting Started
Install the module with: `npm install -g ully`

```javascript
var Ully = require('ully');
//Create new instance of Ully
var api = new Ully('access_token');
```

## Documentation

#### .prompt(prompts, cb)

**Parameter**: `prompts`
**Type**: `Array`
**Example**: 

```javascript
var prompts = [
{
	type: 'input',
	name: 'name',
	message: 'What\'s your name?'
}, 
{
	type: 'input',
	name: 'email',
	message: 'What\'s your email?'
}];
```

**Parameter**: `cb`
**Type**: `Function`
**Example**:

```javascript
function(answers) {
	
}
```

The 'prompt' method is responsible for asking questions

How to use this method

```javascript
var prompts = [
{
	type: 'input',
	name: 'name',
	message: 'What\'s your name?'
}, 
{
	type: 'input',
	name: 'email',
	message: 'What\'s your email?'
}];

api.prompt(prompts, function(answers) {
	console.log(answers);
}); 
```

#### .signup(name, email, username, password)

**Parameter**: `name`
**Type**: `String`
**Example**: `myname`


**Parameter**: `email`
**Type**: `String`
**Example**: `example@example.com`


**Parameter**: `username`
**Type**: `String`
**Example**: `myusername`


**Parameter**: `password`
**Type**: `String`
**Example**: `123456test`


The 'signup' method is responsible for create accounts

How to use this method

```javascript

api.signup('myname', 'email', 'myusername', '123456test');
```

#### .login(email, password)


**Parameter**: `email`
**Type**: `String`
**Example**: `example@example.com`


**Parameter**: `password`
**Type**: `String`
**Example**: `123456test`


The 'login' method is responsible to login in accounts

How to use this method

```javascript

api.login('email', '123456test');
```

#### .forgot(email, username)


**Parameter**: `email`
**Type**: `String`
**Example**: `example@example.com`


**Parameter**: `username`
**Type**: `String`
**Example**: `myusername`


The 'forgot' method is responsible for reset passwords

How to use this method

```javascript

api.stats(true);
```

#### .stats(pureJson)


**Parameter**: `pureJson`
**Type**: `Boolean`
**Example**: `true`


The 'stats' method is responsible for showing statistics of Ully

How to use this method

```javascript

api.stats(true);
```

#### .status(pureJson)


**Parameter**: `pureJson`
**Type**: `Boolean`
**Example**: `true`


The 'status' method is responsible for showing status of the api

How to use this method

```javascript

api.status(true);
```

#### .me(pureJson)


**Parameter**: `pureJson`
**Type**: `Boolean`
**Example**: `true`


The 'me' method is responsible for showing profile info

How to use this method

```javascript

api.me(true);
```

#### .updateMe(name, email, username, password)

**Parameter**: `name`
**Type**: `String`
**Example**: `myname`


**Parameter**: `email`
**Type**: `String`
**Example**: `example@example.com`


**Parameter**: `username`
**Type**: `String`
**Example**: `myusername`


**Parameter**: `password`
**Type**: `String`
**Example**: `123456test`

The 'updateMe' method is responsible for update profile info

How to use this method

```javascript

api.updateMe('myname', 'email', 'myusername', '123456test');
```

#### .deleteMe()

The 'deleteMe' method is responsible for delete profile info

How to use this method

```javascript

api.deleteMe();
```

#### .collections(pureJson)


**Parameter**: `pureJson`
**Type**: `Boolean`
**Example**: `true`


The 'collections' method is responsible for list all collections

How to use this method

```javascript

api.collections(true);
```

#### .collectionsByUsername(username, pureJson)

**Parameter**: `username`
**Type**: `String`
**Example**: `myusername`

**Parameter**: `pureJson`
**Type**: `Boolean`
**Example**: `true`


The 'collectionsByUsername' method is responsible for list all collections of a specific user

How to use this method

```javascript

api.collectionsByUsername('username', true);
```

#### .createCollections(name, slug, publicCollection)

**Parameter**: `name`
**Type**: `String`
**Example**: `My Favorites`

**Parameter**: `slug`
**Type**: `String`
**Example**: `favorites`

**Parameter**: `publicCollection`
**Type**: `Boolean`
**Example**: `true`


The 'createCollections' method is responsible for create a new collection

How to use this method

```javascript

api.createCollections('name', 'slug', true);
```

#### .updateCollections(collectionSlug, name, slug, publicCollection)

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


The 'updateCollections' method is responsible for update a specific collection

How to use this method

```javascript

api.updateCollections('collectionSlug', 'name', 'slug', true);
```

#### .deleteCollections(collectionSlug)

**Parameter**: `collectionSlug`
**Type**: `String`
**Example**: `favorites`


The 'deleteCollections' method is responsible for delete a specific collection

How to use this method

```javascript

api.deleteCollections('collectionSlug');
```

#### .createUrls(collectionSlug, title, url, description)

**Parameter**: `collectionSlug`
**Type**: `String`
**Example**: `favorites`

**Parameter**: `title`
**Type**: `String`
**Example**: `Title of url`

**Parameter**: `url`
**Type**: `String`
**Example**: `http://example.com`

**Parameter**: `description`
**Type**: `String`
**Example**: `My example page`


The 'createUrls' method is responsible for create a new url

How to use this method

```javascript

api.createUrls('collectionSlug', 'Title of url', 'http://example.com', 'My example page');
```

#### .updateUrls(collectionSlug, urlid, title, url, description)

**Parameter**: `collectionSlug`
**Type**: `String`
**Example**: `favorites`

**Parameter**: `urlid`
**Type**: `String`
**Example**: `urlid`

**Parameter**: `title`
**Type**: `String`
**Example**: `Title of url`

**Parameter**: `url`
**Type**: `String`
**Example**: `http://example.com`

**Parameter**: `description`
**Type**: `String`
**Example**: `My example page`


The 'updateUrls' method is responsible for update a specific url

How to use this method

```javascript

api.updateUrls('collectionSlug', 'urlid', 'Title of url', 'http://example.com', 'My example page');
```

#### .deleteUrls(collectionSlug, urlid)

**Parameter**: `collectionSlug`
**Type**: `String`
**Example**: `favorites`

**Parameter**: `urlid`
**Type**: `String`
**Example**: `urlid`


The 'deleteUrls' method is responsible for delete a specific url

How to use this method

```javascript

api.deleteUrls('collectionSlug', 'urlid');
```

## Contributing

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

