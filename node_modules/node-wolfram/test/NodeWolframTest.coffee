Client = require '../dist/index'
assert = require 'assert'

describe 'node-wolfram', ->
	it 'should throw an error if querying with no app id', ->
		noAppId = ->
			Wolfram = new Client()
			Wolfram.query '2+2', (err, response) ->
				# blah blah blah...
		assert.throws noAppId, Error

	it 'should receive an error from Wolfram with an invalid app id', ->
		Wolfram = new Client('f the police')
		Wolfram.query '2+2', (err, response) ->
			assert.ok err?, "We should get an error."
			assert.equal 'Invalid appid', err.msg[0]

	it 'should be able to answer 2+2', ->
		Wolfram = new Client(process.env.APPID)
		Wolfram.query '2+2', (err, response) ->
			assert.ok not err?, "Shouldn't get error."
			assert.ok response?, "Should have a response."
			assert.equal '4', result.queryresult.pod[1].subpod[0].plaintext[0]
			
	it 'should be able to answer "x^2 when x = 3"', ->
		Wolfram = new Client(process.env.APPID)
		Wolfram.query "x^2 when x = 3", (err, response) ->
			assert.ok not err?, "Shouldn't get error."
			assert.ok response?, "Should have a response."
			assert.equal '9', result.queryresult.pod[1].subpod[0].plaintext[0]
