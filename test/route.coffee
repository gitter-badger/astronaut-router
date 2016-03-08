chai    = require 'chai'
someVar = true;
chai.should()

describe 'Test of test', ->

  it 'A little test to test travis', ->
    someVar.should.equal true
