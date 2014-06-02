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

var chai = require('chai');
chai.expect();
chai.should();

var Ully = require('../lib/ully.js');
var ully = new Ully('token');

describe('ully module', function() {
    describe('#constructor()', function() {
        it('should be a function', function() {
            Ully.should.be.a("function");
        });
    });
    describe('#instance()', function() {
        it('should be a object', function() {
            ully.should.be.a("object");
        });
    });
});
