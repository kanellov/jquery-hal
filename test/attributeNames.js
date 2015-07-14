/* global describe, it, beforeEach, afterEach, expect */
/* global module, inject */

describe('special attribute names', function () {

    it('should get embedde item resource', function () {
        var handler = $.mockjax({
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

        var resource = $.hal.$get('/', {
            linksAttribute: "links",
            embeddedAttribute: "embedded"
        }).then(function (resource) {
            expect(resource).toEqual({});

            return resource.$get('testing').then(function (resource) {
                expect(resource).toEqual({
                    "id": "one!"
                });
            });
        });

        $.mockjax.clear(handler);
    });

    it('should get linked item resource', function () {
        var handler = $.mockjax({
            url: "/",
            type: "GET",
            responseText: {
                "links": {
                    "self": "/",
                    "testing": "/testing"
                }
            }
        });

        var handler2 = $.mockjax({
            url: "/testing",
            type: "GET",
            responseText: {
                "links": {
                    "self": "/testing"
                },
                "id": "one!"
            }
        });

        var resource = $.hal.$get('/', {
            linksAttribute: "links",
            embeddedAttribute: "embedded"
        }).then(function (resource) {
            expect(resource).toEqual({});

            return resource.$get('testing').then(function (resource) {
                expect(resource).toEqual({
                    "id": "one!"
                });
            });
        });

        $.mockjax.clear(handler);
        $.mockjax.clear(handler2);
    });
});