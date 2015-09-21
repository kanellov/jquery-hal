
QUnit.module("Special attribute names",{
    beforeEach: function() {
        /**
         * clears all mock calls before each test
         */
        $.mockjax.clear();
    }
});


QUnit.test("should get embedded item resource", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "/",
        type: "GET",
        responseText: {
            "links": {
                "self": "/"
            },
            "embedded": {
                "testing": {
                    "links": {
                        "self": "/testing"
                    },
                    "id": "one!"
                }
            }
        }
    });

    $.hal.$get("/", {
        linksAttribute: "links",
        embeddedAttribute: "embedded"
    }).then(function (resource) {

        assert.propEqual(resource, {});

        resource.$get("testing").then(function (r) {

            assert.propEqual(r, {
                "id": "one!"
            },
            "embedded resource should have id property");

            done();
        });
    });

});

QUnit.test("should get linked item resource", function(assert) {
    var done = assert.async();
    $.mockjax({
        url: "/",
        type: "GET",
        responseText: {
            "links": {
                "self": "/",
                "testing": "/testing"
            }
        }
    });

    $.mockjax({
        url: "/testing",
        type: "GET",
        responseText: {
            "links": {
                "self": "/testing"
            },
            "id": "one!"
        }
    });

    $.hal.$get("/", {
        linksAttribute: "links",
        embeddedAttribute: "embedded"
    }).then(function (resource) {
        assert.propEqual(resource, {});

        resource.$get("testing").then(function (r) {
            assert.propEqual(r, {
                "id": "one!"
            });
            done();
        });
    });
});