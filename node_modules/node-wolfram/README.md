node-wolfram
============
node-wolfram is a very thin wrapper for the [WolframAlpha API](http://products.wolframalpha.com/api/). It merely makes queries and returns the answer in JSON (converted from their usual XML). The conversion is done with [node-xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) and nothing else is done.

(Kind of a rewrite of [node-wolfram by strax](https://github.com/strax/node-wolfram). He used libxml for parsing and I didn't like that.)

Install
-------
`npm install node-wolfram`

Usage
-----
Here is an example in JavaScript:
```javascript
var Client = require('node-wolfram');
var Wolfram = new Client('YOUR_APPID_HERE');
Wolfram.query("2+2", function(err, result) {
	if(err)
		console.log(err);
	else
	{
		for(var a=0; a<result.queryresult.pod.length; a++)
		{
			var pod = result.queryresult.pod[a];
			console.log(pod.$.title,": ");
			for(var b=0; b<pod.subpod.length; b++)
			{
				var subpod = pod.subpod[b];
				for(var c=0; c<subpod.plaintext.length; c++)
				{
					var text = subpod.plaintext[c];
					console.log('\t', text);
				}
			}
		}
	}
});
```

Here is the equivalent in CoffeeScript:
```coffeescript
Client = require 'node-wolfram'
Wolfram = new Client('YOUR_APPID_HERE')
Wolfram.query "2+2", (err, result) ->
	if err?
		console.log err
	else
		for pod in result.queryresult.pod
			console.log pod.$.title + ": "
			for subpod in pod.subpod
				for text in subpod.plaintext
					console.log '\t', text
```

Both will output:
```
Input: 
	 2+2
Result: 
	 4
Number name: 
	 four
Number line: 
	 
Manipulatives illustration: 
	  | + |  |  =  | 
2 |  | 2 |  | 4
Typical human computation times: 
	 age 6:  3.2 seconds  |  age 8:  1.8 seconds  |  age 10:  1.2 seconds  |  
age 18:  0.83 seconds
(ignoring concentration, repetition, variations in education, etc.)
```

If the request or xml2js conversion has an error, the callback will receive that error. If the query is received, but the queryresult has an error property, then the error given to the callback will be that queryresult's error.

Testing
-------
Install grunt with: `npm install -g grunt grunt-cli`<br/>
`APPID=YOUR_APPID_HERE grunt test`

Example Response
-----
This is what you get for the response if you query `2+2`. It should help show how the XML response gets converted to JSON. Attributes of tags are stored in the `$` properties.
```json
{
    "queryresult": {
        "$": {
            "success": "true",
            "error": "false",
            "numpods": "6",
            "datatypes": "Math",
            "timedout": "",
            "timedoutpods": "",
            "timing": "0.671",
            "parsetiming": "0.076",
            "parsetimedout": "false",
            "recalculate": "",
            "id": "MSPa264521a0e4dg83gd7eg200005037925gie85ce02",
            "host": "http://www5a.wolframalpha.com",
            "server": "29",
            "related": "http://www5a.wolframalpha.com/api/v2/relatedQueries.jsp?id=MSPa264621a0e4dg83gd7eg200003a3da730hhbdgifi&s=29",
            "version": "2.6"
        },
        "pod": [{
            "$": {
                "title": "Input",
                "scanner": "Identity",
                "id": "Input",
                "position": "100",
                "error": "false",
                "numsubpods": "1"
            },
            "subpod": [{
                "$": {
                    "title": ""
                },
                "plaintext": ["2+2"],
                "img": [{
                    "$": {
                        "src": "http://www5a.wolframalpha.com/Calculate/MSP/MSP264721a0e4dg83gd7eg20000519g66800ac2e7bg?MSPStoreType=image/gif&s=29",
                        "alt": "2+2",
                        "title": "2+2",
                        "width": "32",
                        "height": "18"
                    }
                }]
            }]
        }, {
            "$": {
                "title": "Result",
                "scanner": "StepByStep",
                "id": "Result",
                "position": "200",
                "error": "false",
                "numsubpods": "1",
                "primary": "true"
            },
            "subpod": [{
                "$": {
                    "title": ""
                },
                "plaintext": ["4"],
                "img": [{
                    "$": {
                        "src": "http://www5a.wolframalpha.com/Calculate/MSP/MSP264821a0e4dg83gd7eg2000033434gf1i1cfc47h?MSPStoreType=image/gif&s=29",
                        "alt": "4",
                        "title": "4",
                        "width": "8",
                        "height": "18"
                    }
                }]
            }],
            "states": [{
                "$": {
                    "count": "1"
                },
                "state": [{
                    "$": {
                        "name": "Step-by-step solution",
                        "input": "Result__Step-by-step solution"
                    }
                }]
            }]
        }, {
            "$": {
                "title": "Number name",
                "scanner": "Integer",
                "id": "NumberName",
                "position": "300",
                "error": "false",
                "numsubpods": "1"
            },
            "subpod": [{
                "$": {
                    "title": ""
                },
                "plaintext": ["four"],
                "img": [{
                    "$": {
                        "src": "http://www5a.wolframalpha.com/Calculate/MSP/MSP264921a0e4dg83gd7eg2000026f0i2b652da2991?MSPStoreType=image/gif&s=29",
                        "alt": "four",
                        "title": "four",
                        "width": "28",
                        "height": "18"
                    }
                }]
            }]
        }, {
            "$": {
                "title": "Number line",
                "scanner": "NumberLine",
                "id": "NumberLine",
                "position": "400",
                "error": "false",
                "numsubpods": "1"
            },
            "subpod": [{
                "$": {
                    "title": ""
                },
                "plaintext": [""],
                "img": [{
                    "$": {
                        "src": "http://www5a.wolframalpha.com/Calculate/MSP/MSP265021a0e4dg83gd7eg20000393ii8ihd6575ib6?MSPStoreType=image/gif&s=29",
                        "alt": "",
                        "title": "",
                        "width": "300",
                        "height": "51"
                    }
                }]
            }]
        }, {
            "$": {
                "title": "Manipulatives illustration",
                "scanner": "Arithmetic",
                "id": "Illustration",
                "position": "500",
                "error": "false",
                "numsubpods": "1"
            },
            "subpod": [{
                "$": {
                    "title": ""
                },
                "plaintext": [" | + |  |  =  | \n2 |  | 2 |  | 4"],
                "img": [{
                    "$": {
                        "src": "http://www5a.wolframalpha.com/Calculate/MSP/MSP265121a0e4dg83gd7eg20000596ci7a3i5064882?MSPStoreType=image/gif&s=29",
                        "alt": " | + |  |  =  | \n2 |  | 2 |  | 4",
                        "title": " | + |  |  =  | \n2 |  | 2 |  | 4",
                        "width": "134",
                        "height": "48"
                    }
                }]
            }]
        }, {
            "$": {
                "title": "Typical human computation times",
                "scanner": "Arithmetic",
                "id": "TypicalHumanComputationTimes",
                "position": "600",
                "error": "false",
                "numsubpods": "1"
            },
            "subpod": [{
                "$": {
                    "title": ""
                },
                "plaintext": ["age 6:  3.2 seconds  |  age 8:  1.8 seconds  |  age 10:  1.2 seconds  |  \nage 18:  0.83 seconds\n(ignoring concentration, repetition, variations in education, etc.)"],
                "img": [{
                    "$": {
                        "src": "http://www5a.wolframalpha.com/Calculate/MSP/MSP265221a0e4dg83gd7eg20000647fdi2ce1ce2f8e?MSPStoreType=image/gif&s=29",
                        "alt": "age 6:  3.2 seconds  |  age 8:  1.8 seconds  |  age 10:  1.2 seconds  |  \nage 18:  0.83 seconds\n(ignoring concentration, repetition, variations in education, etc.)",
                        "title": "age 6:  3.2 seconds  |  age 8:  1.8 seconds  |  age 10:  1.2 seconds  |  \nage 18:  0.83 seconds\n(ignoring concentration, repetition, variations in education, etc.)",
                        "width": "485",
                        "height": "63"
                    }
                }]
            }],
            "states": [{
                "$": {
                    "count": "1"
                },
                "state": [{
                    "$": {
                        "name": "More details",
                        "input": "TypicalHumanComputationTimes__More details"
                    }
                }]
            }]
        }],
        "sources": [{
            "$": {
                "count": "1"
            },
            "source": [{
                "$": {
                    "url": "http://www.wolframalpha.com/sources/HumanComputationQuerySourceInformationNotes.html",
                    "text": "Human computation query"
                }
            }]
        }]
    }
}
```