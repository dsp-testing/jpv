
var tap = require('tap');
var jpv = require('../index.js');

var json = {
    key1: null,
    key2: {
        url: 'http://example.com'
    },
    key3: '17850',
    key4: 'OK',
    key5: '2012-10-06T04:13:00+00:00',
    key6: [1, 2, 3],
    key7: 'Yes',
    key8: 'OK'
};

var pattern = {
    key1: '(null)',
    key2: {
        url: '[url]'
    },
    key3: /[0-9]+/i,
    key4: 'OK',
    key5: '[datetime]',
    key6: '![empty]',
    key8: '!{Faild}',
    key9: '{NO}?'
};

tap.test('jpv.validate', function (t) {
    t.ok(jpv.validate(json, pattern, { debug: true }), 'Validate json Pattern');
    t.end();
});