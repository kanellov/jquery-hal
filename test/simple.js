describe("simple", function () {

    it('should get empty respurce', function () {
        var handler = $.mockjax({
          url: "/",
          type: "GET",
          responseText: {
                "_links": {
                    "self": "/"
                }
            }
        });

        var resource = $.hal.$get('/').then(function () {
            expect(resource).toEqual({});
        });

        $.mockjax.clear(handler);

    });



    it('should get resource', function () {
        var handler = $.mockjax({
          url: "/",
          type: "GET",
          responseText: {
                "test": true,
                "_links": {
                    "self": "/"
                }
            }
        });

        var resource = $.hal.$get('/').then(function (resource) {
            expect(resource).toEqual({
                "test": true
            });
        });

        $.mockjax.clear(handler);
    });


    it('should get link by templated url', function () {
        var handler = $.mockjax({
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

        var handler2 = $.mockjax({
            url: "http://example.com/item/1",
            type: "GET",
            responseText: {
                "id": 1,
                "_links": {
                    "self": "/item/1"
                }
            }
        });

        var resource = $.hal.$get('http://example.com/').then(function (resource) {
            expect(resource).toEqual({
                "root": true
            });

            resource.$get('item', {
                id: 1
            }).then(function (resource) {
                expect(resource).toEqual({
                    "id": 1
                });
            });
        });

        $.mockjax.clear(handler);
        $.mockjax.clear(handler2);
    });


    it('should get lists', function () {
        var handler = $.mockjax({
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

        var resource = $.hal.$get('http://example.com/').then(function (resource) {
            expect(resource).toEqual({
                "root": true
            });

            resource.$get('item').then(function (resource) {
                expect(resource[0]).toEqual({
                    "id": 1
                });
                expect(resource[1]).toEqual({
                    "id": 2
                });
                expect(resource[2]).toEqual({
                    "id": 3
                });
            });
        });

        $.mockjax.clear(handler);
    });


    it('should transform url', function () {
        var handler = $.mockjax({
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

        var handler2 = $.mockjax({
            url: "http://example.com/api/item/1",
            type: "GET",
            responseText: {
                "id": 1,
                "_links": {
                    "self": "/item/1"
                }
            }
        });

        var resource = $.hal.$get('https://example.com/', {
            transformUrl: transformUrl
        }).then(function (resource) {
            expect(resource).toEqual({
                "root": true
            });

            resource.$get('item', {
                id: 1
            }).then(function (resource) {
                expect(resource).toEqual({
                    "id": 1
                });
            });
        });

        $.mockjax.clear(handler);
        $.mockjax.clear(handler2);

        function transformUrl(url) {
            var from = 'https://example.com/';
            var to = 'http://example.com/api/';

            if (url.substring(0, from.length) === from) {
                return to + url.substring(from.length);
            }


            return url;
        }
    });


    it('should get build href from a templated link', function () {
        var handler = $.mockjax({
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

        var resource = $.hal.$get('https://example.com/', {}).then(function (resource) {
            expect(resource).toEqual({
                "root": true
            });

            expect(resource.$href('item', {
                id: 1
            })).toEqual('https://example.com/item/1');
        });

        $.mockjax.clear(handler);
    });

});