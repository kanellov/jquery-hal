
QUnit.module("hal builder test resources",{
    beforeEach: function() {
        /**
         * clears all mock calls before each test
         */
        $.mockjax.clear();
        console.log("clear handlers before test");
    }
});


QUnit.test("should read exampleWithoutHref resource", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "/exampleWithoutHref",
        type: "GET",
        responseText: {
            "name": "Example Resource"
        }
    });

    $.hal.$get("/exampleWithoutHref").then(function (resource) {
        assert.propEqual(resource, {
            "name": "Example Resource"
        });

        done();
    });

});


QUnit.test("should read exampleWithArray resource", function(assert) {
    var done  = assert.async();
    $.mockjax({
        url: "/exampleWithArray",
        type: "GET",
        responseText: {
            "array": ["one", "two", "three"],
            "name": "Example Resource"
        }
    });

    $.hal.$get("/exampleWithArray").then(function (resource) {
        assert.propEqual(resource, {
            "array": ["one", "two", "three"],
            "name": "Example Resource"
        });
        done();
    });
});


QUnit.test("should read example resource", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "https://example.com/api/customer/123456",
        type: "GET",
        responseText: {
            "_links": {
                "curie": [{
                    "href": "https://example.com/apidocs/accounts",
                    "name": "ns"
                }, {
                    "href": "https://example.com/apidocs/roles",
                    "name": "role"
                }],
                "self": {
                    "href": "https://example.com/api/customer/123456"
                },
                "ns:parent": {
                    "href": "https://example.com/api/customer/1234",
                    "name": "bob",
                    "title": "The Parent",
                    "hreflang": "en"
                },
                "ns:users": {
                    "href": "https://example.com/api/customer/123456?users"
                }
            },
            "age": 33,
            "expired": false,
            "id": 123456,
            "name": "Example Resource",
            "optional": true
        }
    });

    $.hal.$get("https://example.com/api/customer/123456").then(function (resource) {
        assert.propEqual(resource, {
            "age": 33,
            "expired": false,
            "id": 123456,
            "name": "Example Resource",
            "optional": true
        });
    done();
    });
});


QUnit.test("should read exampleWithLiteralNullProperty resource", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "https://example.com/api/customer/123456",
        type: "GET",
        responseText: {
            "_links": {
                "curie": [{
                    "href": "https://example.com/apidocs/accounts",
                    "name": "ns"
                }, {
                    "href": "https://example.com/apidocs/roles",
                    "name": "role"
                }],
                "self": {
                    "href": "https://example.com/api/customer/123456"
                },
                "ns:parent": {
                    "href": "https://example.com/api/customer/1234",
                    "name": "bob",
                    "title": "The Parent",
                    "hreflang": "en"
                },
                "ns:users": {
                    "href": "https://example.com/api/customer/123456?users"
                }
            },
            "age": 33,
            "expired": false,
            "id": 123456,
            "name": "Example Resource",
            "nullval": "null",
            "optional": true
        }
    });

    $.hal.$get("https://example.com/api/customer/123456").then(function (resource) {
        assert.propEqual(resource, {
            "age": 33,
            "expired": false,
            "id": 123456,
            "name": "Example Resource",
            "nullval": "null",
            "optional": true
        });
        done();
    });
});


QUnit.test("should read exampleWithTemplate resource", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "https://example.com/api/customer",
        type: "GET",
        responseText: {
            "_links": {
                "curie": [{
                    "href": "https://example.com/apidocs/accounts",
                    "name": "ns"
                }, {
                    "href": "https://example.com/apidocs/roles",
                    "name": "role"
                }],
                "self": {
                    "href": "https://example.com/api/customer"
                },
                "ns:parent": {
                    "href": "https://example.com/api/customer/1234",
                    "name": "bob",
                    "title": "The Parent",
                    "hreflang": "en"
                },
                "ns:query": {
                    "href": "https://example.com/api/customer/search{?queryParam}",
                    "templated": true
                }
            }
        }
    });

    $.hal.$get("https://example.com/api/customer").then(function (resource) {
        assert.propEqual(resource, {});
        done();
    });
});


QUnit.test("should read exampleWithNullProperty resource", function(assert) {

    var done = assert.async();
    $.mockjax({
        url: "https://example.com/api/customer/123456",
        type: "GET",
        responseText: {
            "_links": {
                "curie": [{
                    "href": "https://example.com/apidocs/accounts",
                    "name": "ns"
                }, {
                    "href": "https://example.com/apidocs/roles",
                    "name": "role"
                }],
                "self": {
                    "href": "https://example.com/api/customer/123456"
                },
                "ns:parent": {
                    "href": "https://example.com/api/customer/1234",
                    "name": "bob",
                    "title": "The Parent",
                    "hreflang": "en"
                },
                "ns:users": {
                    "href": "https://example.com/api/customer/123456?users"
                }
            },
            "age": 33,
            "expired": false,
            "id": 123456,
            "name": "Example Resource",
            "nullprop": null,
            "optional": true
        }
    });

    $.hal.$get("https://example.com/api/customer/123456").then(function (resource) {
        assert.propEqual(resource, {
            "age": 33,
            "expired": false,
            "id": 123456,
            "name": "Example Resource",
            "nullprop": null,
            "optional": true
        });

        done();
    });
});


QUnit.test("should read exampleWithSubresource resource", function(assert) {

    var done = assert.async();

    $.mockjax({
        url: "https://example.com/api/customer/123456",
        type: "GET",
        responseText: {
            "_links": {
                "curie": [{
                    "href": "https://example.com/apidocs/accounts",
                    "name": "ns"
                }, {
                    "href": "https://example.com/apidocs/roles",
                    "name": "role"
                }],
                "self": {
                    "href": "https://example.com/api/customer/123456"
                },
                "ns:parent": {
                    "href": "https://example.com/api/customer/1234",
                    "name": "bob",
                    "title": "The Parent",
                    "hreflang": "en"
                },
                "ns:users": {
                    "href": "https://example.com/api/customer/123456?users"
                }
            },
            "_embedded": {
                "ns:user": {
                    "_links": {
                        "self": {
                            "href": "https://example.com/user/11"
                        }
                    },
                    "age": 32,
                    "expired": false,
                    "id": 11,
                    "name": "Example User",
                    "optional": true
                }
            }
        }
    });

    $.hal.$get("https://example.com/api/customer/123456", {}).then(function (resource) {

        assert.propEqual(resource, {});

        resource.$get("ns:user").then(function (r) {
            assert.propEqual(r, {
                "age": 32,
                "expired": false,
                "id": 11,
                "name": "Example User",
                "optional": true
            });
            done();
        });
    });
});


QUnit.test("should read exampleWithSubresourceLinkingToItself resource", function(assert) {

    var done = assert.async();
    $.mockjax({
        url: "https://example.com/api/customer/123456",
        type: "GET",
        responseText: {
            "_links": {
                "curie": [{
                    "href": "https://example.com/apidocs/accounts",
                    "name": "ns"
                }, {
                    "href": "https://example.com/apidocs/roles",
                    "name": "role"
                }],
                "self": {
                    "href": "https://example.com/api/customer/123456"
                },
                "ns:parent": {
                    "href": "https://example.com/api/customer/1234",
                    "name": "bob",
                    "title": "The Parent",
                    "hreflang": "en"
                },
                "ns:users": {
                    "href": "https://example.com/api/customer/123456?users"
                }
            },
            "_embedded": {
                "ns:user": {
                    "_links": {
                        "self": {
                            "href": "https://example.com/user/11"
                        },
                        "role:admin": {
                            "href": "https://example.com/user/11"
                        }
                    },
                    "age": 32,
                    "expired": false,
                    "id": 11,
                    "name": "Example User",
                    "optional": true
                }
            }
        }
    });

    $.hal.$get("https://example.com/api/customer/123456", {}).then(function (resource) {
        assert.propEqual(resource, {});

        resource.$get("ns:user").then(function (r) {
            assert.propEqual(r, {
                "age": 32,
                "expired": false,
                "id": 11,
                "name": "Example User",
                "optional": true
            });
            done();
        });

    });

});


QUnit.test("should read exampleWithMultipleSubresources resource", function(assert) {

    var done = assert.async();

    $.mockjax({
        url: "https://example.com/api/customer/123456",
        type: "GET",
        responseText: {
            "_links": {
                "curie": [{
                    "href": "https://example.com/apidocs/accounts",
                    "name": "ns"
                }, {
                    "href": "https://example.com/apidocs/roles",
                    "name": "role"
                }],
                "self": {
                    "href": "https://example.com/api/customer/123456"
                },
                "ns:parent": {
                    "href": "https://example.com/api/customer/1234",
                    "name": "bob",
                    "title": "The Parent",
                    "hreflang": "en"
                },
                "ns:users": {
                    "href": "https://example.com/api/customer/123456?users"
                }
            },
            "_embedded": {
                "ns:user": [{
                    "_links": {
                        "self": {
                            "href": "https://example.com/user/11"
                        }
                    },
                    "age": 32,
                    "expired": false,
                    "id": 11,
                    "name": "Example User",
                    "optional": true
                }, {
                    "_links": {
                        "self": {
                            "href": "https://example.com/user/12"
                        }
                    },
                    "age": 32,
                    "expired": false,
                    "id": 12,
                    "name": "Example User",
                    "optional": true
                }]
            }
        }
    });

    $.hal.$get("https://example.com/api/customer/123456", {}).then(function (resource) {
        assert.propEqual(resource, {});

        resource.$get("ns:user").then(function (r) {
            assert.propEqual(r[0], {
                "age": 32,
                "expired": false,
                "id": 11,
                "name": "Example User",
                "optional": true
            });

            assert.propEqual(r[1], {
                "age": 32,
                "expired": false,
                "id": 12,
                "name": "Example User",
                "optional": true
            });
            done();
        });
    });
});


QUnit.test("should read exampleWithMultipleNestedSubresources resource", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "https://example.com/api/customer/123456",
        type: "GET",
        responseText: {
            "_links": {
                "curie": [{
                    "href": "https://example.com/apidocs/accounts",
                    "name": "ns"
                }, {
                    "href": "https://example.com/apidocs/phones",
                    "name": "phone"
                }, {
                    "href": "https://example.com/apidocs/roles",
                    "name": "role"
                }],
                "self": {
                    "href": "https://example.com/api/customer/123456"
                },
                "ns:parent": {
                    "href": "https://example.com/api/customer/1234",
                    "name": "bob",
                    "title": "The Parent",
                    "hreflang": "en"
                },
                "ns:users": {
                    "href": "https://example.com/api/customer/123456?users"
                }
            },
            "_embedded": {
                "ns:user": [{
                    "_links": {
                        "self": {
                            "href": "https://example.com/user/11"
                        }
                    },
                    "age": 32,
                    "expired": false,
                    "id": 11,
                    "name": "Example User",
                    "optional": true,
                    "_embedded": {
                        "phone:cell": {
                            "_links": {
                                "self": {
                                    "href": "https://example.com/phone/1"
                                }
                            },
                            "id": 1,
                            "number": "555-666-7890"
                        }
                    }
                }, {
                    "_links": {
                        "self": {
                            "href": "https://example.com/user/12"
                        }
                    },
                    "age": 32,
                    "expired": false,
                    "id": 12,
                    "name": "Example User",
                    "optional": true
                }]
            }
        }
    });

    $.hal.$get("https://example.com/api/customer/123456", {}).then(function (resource) {
        assert.propEqual(resource, {});

        resource.$get("ns:user").then(function (r) {
            assert.propEqual(r[0], {
                "age": 32,
                "expired": false,
                "id": 11,
                "name": "Example User",
                "optional": true
            });

            assert.propEqual(r[1], {
                "age": 32,
                "expired": false,
                "id": 12,
                "name": "Example User",
                "optional": true
            });


            r[0].$get("phone:cell").then(function (rc) {
                assert.propEqual(rc, {
                    "id": 1,
                    "number": "555-666-7890"
                });
                done();
            });
        });
    });
});
