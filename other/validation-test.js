var expect = require('chai').expect;
var validation = require('./valdiation.js');

describe('something', function() {
  it('Should return test', function() {
    var result = validation.init();
    expect(result).to.equal('test');
  });
})
