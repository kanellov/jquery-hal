
QUnit.module("Simple module -",{
    beforeEach: function() {
        /**
         * clears all mock calls before each test
         */
        $.mockjax.clear();
    }
});

/**
 *
 *
 */
QUnit.test("should get empty resource", function (assert) {
    var done = assert.async();
    $.mockjax({
        url: "/",
        type: "GET",
        responseText: {
            "_links": {
                "self": "/"
            }
        }
    });

    $.hal.$get('/').then(function (r) {
        assert.propEqual(r,
            {},
            "should be object Resource without any properties");
        assert.ok(r instanceof(Resource));
        done();
    });
});

/**
 *
 *
 */
QUnit.test("should get resource", function (assert) {
    var done = assert.async();
    $.mockjax({
      url: "/",
      type: "GET",
      responseText: {
            "test": true,
            "_links": {
                "self": "/"
            }
        }
    });

    $.hal.$get('/').then(function (r) {
        assert.propEqual(r, {
            "test": true,
        });
        assert.ok(r instanceof(Resource));
        done();
    });
});

/**
 *
 *
 */
QUnit.test("should get link by templated url", function (assert) {
    var done = assert.async();

    $.mockjax({
        url: "http://example.com/",
        type: "GET",
        responseText: {
            "root": true,
            "_links": {
                "self": "/",
                "item": {
                    templated: true,
                    href: "/item{/id}"
                }
            }
        }
    });

    $.mockjax({
        url: "http://example.com/item/1",
        type: "GET",
        responseText: {
            "id": 1,
            "_links": {
                "self": "/item/1"
            }
        }
    });

    $.hal.$get('http://example.com/').then(function (resource) {
        assert.propEqual(resource, {
            "root": true
        });
        assert.ok(resource instanceof(Resource));

        resource.$get('item', {
            id: 1
        }).then(function (r) {
            assert.propEqual(r, {
                "id": 1
            });
            assert.ok(r instanceof(Resource));

            done();
        });
    });
});

/**
 *
 *
 */
QUnit.test("should get lists", function (assert) {
    var done = assert.async();

    $.mockjax({
        url: "http://example.com/",
        type: "GET",
        responseText: {
            "root": true,
            "_links": {
                "self": "/",
                "item": {
                    templated: true,
                    href: "/item{/id}"
                }
            },
            "_embedded": {
                "item": [{
                    "id": 1,
                    "_links": {
                        "self": "/item/1"
                    }
                }, {
                    "id": 2,
                    "_links": {
                        "self": "/item/2"
                    }
                }, {
                    "id": 3,
                    "_links": {
                        "self": "/item/3"
                    }
                }]
            }
        }
    });

    $.hal.$get('http://example.com/').then(function (resource) {
        assert.propEqual(resource, {
            "root": true
        });

        resource.$get('item').then(function (r) {
            assert.propEqual(r[0], {
                "id": 1
            });
            assert.ok(r[0] instanceof(Resource));

            assert.propEqual(r[1], {
                "id": 2
            });
            assert.ok(r[1] instanceof(Resource));

            assert.propEqual(r[2], {
                "id": 3
            });
            assert.ok(r[2] instanceof(Resource));

            done();
        });
    });

});


QUnit.test("Should transform url", function(assert) {
    var done = assert.async();
    $.mockjax({
        url: "http://example.com/api/",
        type: "GET",
        responseText: {
            "root": true,
            "_links": {
                "self": "/",
                "item": {
                    templated: true,
                    href: "/item{/id}"
                }
            }
        }
    });

    $.mockjax({
        url: "http://example.com/api/item/1",
        type: "GET",
        responseText: {
            "id": 1,
            "_links": {
                "self": "/item/1"
            }
        }
    });


    $.hal.$get('https://example.com/', {
        transformUrl: transformUrl
    }).then(function (resource) {
        assert.propEqual(resource, {
            "root": true
        });

        resource.$get('item', {
            id: 1
        }).then(function (resource) {
            assert.propEqual(resource, {
                "id": 1
            });
            done();
        });
    });

    function transformUrl(url) {
        var from = 'https://example.com/';
        var to = 'http://example.com/api/';
        if (url.substring(0, from.length) === from) {
            return to + url.substring(from.length);
        }
        return url;
    }
});



QUnit.test("should get build href from a templated link", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "https://example.com/",
        type: "GET",
        responseText: {
            "root": true,
            "_links": {
                "self": "/",
                "item": {
                    templated: true,
                    href: "/item{/id}"
                }
            }
        }
    });

    $.hal.$get('https://example.com/', {}).then(function (resource) {
        assert.propEqual(resource, {
            "root": true
        });

        assert.equal(resource.$href('item', {
            id: 1
        }), 'https://example.com/item/1');

        done();
    });
});
