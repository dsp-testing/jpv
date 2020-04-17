
jpv
==========

Json Pattern Validator.

***jpv***  - it is an easy-to-use JSON schema validator library for large and complex data.

Describe your JSON pattern using predefined templates or native types or a regular expression then validate using the easy single function.

#### Install

Stable Release (`2.1.x`)

```sh
$ npm install jpv --save
```
or

```sh
$ yarn add jpv
```


#### Simple Usage

```javascript

import jpv from 'jpv';

var json = {
  status : 'OK',
  data : {
    url : 'http://example.com'
  }
}

var pattern = {
  status : /^OK$/,
  data : {
    url : "[url]"
  }
}

console.log( jpv.validate(json, pattern ) )

```

> validate() method returns boolean (true/false)


#### Patterns


JPV allows you to validate the JSON object associated with some templates: **Fixed**, **Native**, **Defined**, **Regex**, **Functional-Regex**, **Functional-Fixed** and **Short-Objects**.


**Fixed Pattern** is the simplest template used to validate JSON by given exact values.

```javascript
  var pattern = {
    id : 100,
    data : {
      item : {
        status : "OK"
      }
    }
  }
```

"Fixed Pattern" requires to use identical types.

```javascript
  var json = {
    id : 100
  }

  var pattern1 = {
    id : 100
  }
  var pattern2 = {
    id : "100"
  }

  console.log( jpv.validate(json, pattern1) ) // --> true
  console.log( jpv.validate(json, pattern2) ) // --> false

  // because of pattern type is a string not number
```


**Native Pattern** used to validate by native JavaScript types : boolean, null, undefined, number, string, symbol and object.


```javascript
  var json = {
    key1 : 98,
    key2 : false,
    key3 : null,
    key4 : {
      key5 : 1
    }
  }

  var pattern = {
    key1 : '(number)',
    key2 : '(boolean)',
    key3 : '(null)',
    key4 : '(object)'
  }

  console.log( jpv.validate(json, pattern) ) // --> true
```



**Defined Pattern** is made to facilitate the use of the most tedious templates such as email, date, etc.

```javascript
  var json = {
    a : '2017-12-25',
    b : 'user@gmail.com',
    c : []
  }

  var pattern = {
    a : '[date]',
    b : '[email]',
    c : '[empty]'
  }

  console.log( jpv.validate(json, pattern) )  // --> true
```

Available defined patterns:

| Pattern              | Example                   |
| ---------------------|:-------------------------:|
| exist                |                           |
| empty                | []                        |
| boolean              | True                      |
| double               | 12.258028                 |
| naturalNumber        | 2                         |
| number               | 0284                      |
| integer              | 1478                      |
| url                  | https://fb.com            |
| alphaNumeric         | a7                        |
| email                | user@example.com          |
| date                 | 2017-05-12                |
| datetime             | 2017-03-25 10:30:58.235   |



--




**Regular Expression** - make your own regular expression

```javascript
  var json = {
    key : 'A-8'
  }

  var pattern = {
    key : /^[A-Z]-[0-9]$/
  }

  console.log( jpv.validate(json, pattern) )  // --> true
```


**Functional Patterns** used to implement logical conditions

```javascript
  var json = {
    key : 'A-8'
  }

  var pattern = {
    key : '{/[A-Z]-[0-9]/}'
  }

  console.log( jpv.validate(json, pattern) )  // --> true
```

> Values in Functional scopes **{}** is always converting to string.


**Short-Objects** are short assignment for arrays and objects

Example:

```javascript
  var json = {
    a : [ 1, 2, 3],
    b : {
      c : '1'
    }
  }

  var pattern = {
    a : [],
    b : {}
  }

  console.log( jpv.validate(json, pattern) )  // --> true
```


#### Modes

There are two ```standard``` and ```strict``` modes.

```strict``` mode is used when your pattern and given JSON should contain exact fields,
while in ```standard``` mode JSON can contain more fields than described in the pattern.

By default JPV validator used standard mode. To set up strict mode - need add 3th argument into the ```jpv.validate``` function:

```javascript
  const options = { mode : "strict" };

  // strict mode
  jpv.validate(json, pattern1, options );
```

Example using strict and standard modes

```javascript
  var json = {
    a : 5789,
    b : "Another One"
  }

  var pattern1 = {
    a : '(number)'
  }

  // standard mode
  console.log(  jpv.validate(json, pattern1)  )
  // --> true

  // strict mode
  console.log(  jpv.validate(json, pattern1, { mode : "strict" } ) )
  // --> false
  // missing b

  var pattern2 = {
    a : '(number)',
    b : '(string)'
  }

  // strict mode
  console.log(  jpv.validate(json, pattern2, { mode : "strict" } ) )
  // --> true
```

#### Logical negation (!) operator

Negations ("!") operator allows to negate the pattern.

Example 1:

```javascript
  var json = {
    a : 5789
  };

  var pattern = {
    a : '!(number)'
  };

  console.log( jpv.validate(json, pattern) );
  // --> false
```

> This functionality works only for  **Native**, **Defined** and **Functional** patterns.

Example 2:

```javascript
  var json = {
    a : [2],
    b : "Yes",
    c : [2,3],
    d : "No",
    e : "1"
  }

  var pattern = {
    a : '!(number)',
    b : '!(number)',
    c : '![empty]',
    d : '!{/Yes/i}',
    e : '!{2}'
  }

  // strict mode
  console.log(  jpv.validate(json, pattern, { mode : "strict" }) )
  // --> true
```

Example 3:

```javascript
  var json = {
    key : {}
  };
  var pattern = {
    key : '![number]'
  };
  console.log(  jpv.validate(json, pattern)  )
  // --> true
```

#### Empty or Match (?) Operator

The **Empty or Match** operator is useful when the field is not required to be filled.

```javascript
  var pattern = {
     key : '(string)?'
  }
```

> Current operator (**?**) is used together with *Native*, *Defined* and *Functional* patterns only.


 Example 1:

```javascript
  var a = { }
  var b = {
    key : 5
  }
  var c = {
    key : ""
  }
  var d = {
    key : "A"
  }

  //
  var pattern = {
    key : '[number]?'
  }

  console.log( jpv.validate(a, pattern) ) // --> true
  console.log( jpv.validate(b, pattern) ) // --> true
  console.log( jpv.validate(c, pattern) ) // --> true
  console.log( jpv.validate(d, pattern) ) // --> false
```

Example 2:

```javascript

  var a = {}
  var b = {
    key : '1'
  }
  var c = {
    key : 'a'
  }

  var pattern = {
    key : '{/^[0-9]$/}?'
  }

  console.log( jpv.validate( a, pattern) ) // --> true
  console.log( jpv.validate( b, pattern) ) // --> true
  console.log( jpv.validate( c, pattern) ) // --> false
```

#### Arrays

This special pattern is used to validate nested arrays elements. All you need is to create **one** nested pattern inside an array.
Each array element will be validated according to the first element of the pattern.

```javascript
  var json = {
    users : [
      {
        id : 1001478,
        name : "Alisa"
      },
      {
        id : 1003476,
        name : "Bob"
      },
    ]
  }

  var pattern = {
    users : [
      {
        id : '(number)',
        name : '(string)'
      }
    ]
  }

  console.log( jpv.validate(json, pattern) )
  // --> true
```


#### Lenght MaxLength MinLenght

This special pattern is used to validate nested arrays elements. All you need is to create **one** nested pattern inside an array.
Each array element will be validated according to the first element of the pattern.

```javascript
  var json = {
    users : [
      {
        id : 1001478,
        name : "Alisa"
      },
      {
        id : 1003476,
        name : "Bob"
      },
    ]
  }

  var pattern = {
    users : [
      {
        id : '(number)',
        name : '(string)'
      }
    ]
  }

  console.log( jpv.validate(json, pattern) )
  // --> true
```



#### Debugging

The *jpv.validate*  function returns only a boolean type.
But if you want more information about errors, just turn on debugging mode ({debug: true}) in the third argument of function.

```
var json = { index: "Yes"}
var pattern = { index: "[number]"};

// debug mode
jpv.validate(json, pattern, {debug : true})

// the output will be >

//# The value of
//# -- { "index" : Yes
//# not matched with: /"[number]"/
```

#### TypeScript usage

```
import * as jpv from 'jpv';

jpv.validate(json, pattern, false);
```

#### Testing

```
sudo apt install node-tap
sudo npm install tap
tap test/*.js
```
