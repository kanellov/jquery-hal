/* global describe, it, beforeEach, afterEach, expect */
/* global module, inject */
/*

tests from halbuilder-test-resources-2.02
git://github.com/HalBuilder/halbuilder-test-resources.git

*/


describe('halbuilder test resources', function () {

    it('should read exampleWithoutHref resource', function () {
        var handler = $.mockjax({
            url: "/exampleWithoutHref",
            type: "GET",
            resposeText: {
                "name": "Example Resource"
            }
        });

        var resource = $.hal.$get('/exampleWithoutHref').then(function (resource) {
            expect(resource).toEqual({
                "name": "Example Resource"
            });
        });

        $.mockjax.clear(handler);
    });


    it('should read exampleWithArray resource', function () {
        var handler = $.mockjax({
            url: "/exampleWithArray",
            type: "GET",
            responseText: {
                "array": ["one", "two", "three"],
                "name": "Example Resource"
            }
        });

        var resource = $.hal.$get('/exampleWithArray').then(function (resource) {
            expect(resource).toEqual({
                "array": ["one", "two", "three"],
                "name": "Example Resource"
            });
        });

        $.mockjax.clear(handler);
    });


    it('should read example resource', function () {
        var handler = $.mockjax({
            url: "",
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

        var resource = $.hal.$get("https://example.com/api/customer/123456").then(function (resource) {
            expect(resource).toEqual({
                "age": 33,
                "expired": false,
                "id": 123456,
                "name": "Example Resource",
                "optional": true
            });
        });

        $.mockjax.clear(handler);
    });


    it('should read exampleWithLiteralNullProperty resource', function () {
        var handler = $.mockjax({
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

        var resource = $.hal.$get("https://example.com/api/customer/123456").then(function (resource) {
            expect(resource).toEqual({
                "age": 33,
                "expired": false,
                "id": 123456,
                "name": "Example Resource",
                "nullval": "null",
                "optional": true
            });
        });

        $.mockjax.clear(handler);
    });


    it('should read exampleWithTemplate resource', function () {
        var handler = $.mockjax({
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

        var resource = $.hal.$get("https://example.com/api/customer").then(function (resource) {
            expect(resource).toEqual({});
        });

        $.mockjax.clear(handler);
    });


    it('should read exampleWithNullProperty resource', function () {
        var handler = $.mockjax({
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

        var resource = $.hal.$get("https://example.com/api/customer/123456").then(function (resource) {
            expect(resource).toEqual({
                "age": 33,
                "expired": false,
                "id": 123456,
                "name": "Example Resource",
                "nullprop": null,
                "optional": true
            });
        });

        $.mockjax.clear(handler);
    });


    it('should read exampleWithSubresource resource', function () {
        var handler = $.mockjax({
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

        var resource = $.hal.$get("https://example.com/api/customer/123456", {}).then(function (resource) {
            expect(resource).toEqual({});

            resource.$get('ns:user').then(function (resource) {
                expect(resource).toEqual({
                    "age": 32,
                    "expired": false,
                    "id": 11,
                    "name": "Example User",
                    "optional": true
                });
            });

        });

        $.mockjax.clear(handler);
    });


    it('should read exampleWithSubresourceLinkingToItself resource', function () {
        var handler = $.mockjax({
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

        var resource = $.hal.$get("https://example.com/api/customer/123456", {}).then(function (resource) {
            expect(resource).toEqual({});

            resource.$get('ns:user').then(function (resource) {
                expect(resource).toEqual({
                    "age": 32,
                    "expired": false,
                    "id": 11,
                    "name": "Example User",
                    "optional": true
                });
            });

        });

        $.mockjax.clear(handler);
    });


    it('should read exampleWithMultipleSubresources resource', function () {
        var handler = $.mockjax({
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

        var resource = $.hal.$get("https://example.com/api/customer/123456", {}).then(function (resource) {
            expect(resource).toEqual({});

            resource.$get('ns:user').then(function (resource) {
                expect(resource[0]).toEqual({
                    "age": 32,
                    "expired": false,
                    "id": 11,
                    "name": "Example User",
                    "optional": true
                });

                expect(resource[1]).toEqual({
                    "age": 32,
                    "expired": false,
                    "id": 12,
                    "name": "Example User",
                    "optional": true
                });

            });

        });

        $.mockjax.clear(handler);
    });


    it('should read exampleWithMultipleNestedSubresources resource', function () {
        var handler = $.mockjax({
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

        var resource = $.hal.$get("https://example.com/api/customer/123456", {}).then(function (resource) {
            expect(resource).toEqual({});

            resource.$get('ns:user').then(function (resource) {
                expect(resource[0]).toEqual({
                    "age": 32,
                    "expired": false,
                    "id": 11,
                    "name": "Example User",
                    "optional": true
                });

                expect(resource[1]).toEqual({
                    "age": 32,
                    "expired": false,
                    "id": 12,
                    "name": "Example User",
                    "optional": true
                });


                resource[0].$get('phone:cell').then(function (resource) {
                    expect(resource).toEqual({
                        "id": 1,
                        "number": "555-666-7890"
                    });

                });

            });

        });

        $.mockjax.clear(handler);
    });
});