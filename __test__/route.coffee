chai    = require 'chai'
someVar = true;
chai.should()

tesss = require '../src/covertest'

describe 'Test of test', ->

  it 'A little test to test travis', ->
    tesss.value.should.equal true
