(function( global, factory) {

    if (typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !(w.jQuery || w.rfc6570)) {
                    throw new Error( "jQuery is not defined. jQuery-hal cannot be initialized" );
                }
                return factory( w );
            };
    } else {

        if(global.jQuery === "undefined" || global.rfc6570 === "undefined") {
            throw new error("jQuery or rfc6570 library is not defined. jQuery-hal cannot be initialized");
        } else {
            factory(global);
        }
    }
}(typeof window !== "undefined" ? window : this, function (window) {

    "use strict";

    var rfc6570 = window.rfc6570;
    var $ = window.jQuery;

    /**
     * contructor that creates Resource objects
     */
    function Resource(href, options, data, xhr) {
        var linksAttribute,
            embeddedAttribute,
            links,
            embedded,
            xhrProp = xhr;

        var linksAttribute = options.linksAttribute || '_links',
            embeddedAttribute = options.embeddedAttribute || '_embedded',
            links = {},
            embedded = {}
            href = getSelfLink(href, data).href;

        defineHiddenProperty(this, '$href', function (rel, params) {
            return (rel in links) ? hrefLink(links[rel], params) : null;
        });
        defineHiddenProperty(this, '$has', function (rel) {
            return rel in links;
        });
        defineHiddenProperty(this, '$get', function (rel, params) {
            return callLink('GET', links[rel], params);
        });
        defineHiddenProperty(this, '$post', function (rel, params, data) {
            return callLink('POST', links[rel], params, data);
        });
        defineHiddenProperty(this, '$put', function (rel, params, data) {
            return callLink('PUT', links[rel], params, data);
        });
        defineHiddenProperty(this, '$patch', function (rel, params, data) {
            return callLink('PATCH', links[rel], params, data);
        });
        defineHiddenProperty(this, '$del', function (rel, params) {
            return callLink('DELETE', links[rel], params);
        });
        defineHiddenProperty(this, '_xhr', function () {
            return xhrProp;
        });
        /**
         * add the data for the current Resource
         */
        Object.keys(data)
            .filter(function (key) {
                return key !== linksAttribute && key !== embeddedAttribute && !~['_', '$'].indexOf(key[0]);
            })
            .forEach(function (key) {
                Object.defineProperty(this, key, {
                    configurable: false,
                    enumerable: true,
                    value: data[key]
                });
            }, this);

        /**
         * fill links property of Resource
         */
        if (data[linksAttribute]) {
            Object.keys(data[linksAttribute])
                .forEach(function (rel) {
                    var link;
                    link = data[linksAttribute][rel];
                    link = normalizeLink(href, link);
                    links[rel] = link;
                }, this);
        }

        /**
         * fill empedded property of Resource
         */
        if (data[embeddedAttribute]) {
            Object.keys(data[embeddedAttribute])
                .forEach(function (rel) {
                    var embedded,link,resource;
                    embedded = data[embeddedAttribute][rel];
                    link = getSelfLink(href, embedded);
                    links[rel] = link;
                    resource = createResource(href, options, embedded);
                    embedResource(resource);
                }, this);
        }

        /**
         *
         */
        function defineHiddenProperty(target, name, value) {
            Object.defineProperty(target, name, {
                configurable: false,
                enumerable: false,
                value: value
            });
        } //defineHiddenProperty

        /**
         *
         */
        function embedResource(resource) {
            if (Array.isArray(resource)){
                return resource.map(function (resource) {
                    return embedResource(resource);
                });
            }

            if(resource instanceof(Resource)) {
                var href = resource.$href('self');
                embedded[href] = $.Deferred().resolve(resource);
            }
        }

        /**
         *
         */
        function hrefLink(link, params) {
            var href = link.templated ?
                new rfc6570.UriTemplate(link.href).stringify(params) :
                link.href;

            return href;
        } //hrefLink

        /**
         *
         */
        function callLink(method, link, params, data) {
            var linkHref;

            if (Array.isArray(link)) {
                return $.when.apply($, link.map(function (link) {
                    if (method !== 'GET')
                        throw 'method is not supported for arrays';

                    return callLink(method, link, params, data);
                })).then(function() {
                    /**
                     * chain the promise to return an array with resources
                     * rather than Resource objects as arguments.
                     */
                    return Array.prototype.slice.call(arguments);
                });
            }

            linkHref = hrefLink(link, params);

            if (method === 'GET' && (linkHref in embedded)) {
                return embedded[linkHref];
            }

            return callService(method, linkHref, options, data);
        } // end of callLink

        /**
         *
         */
        function resolveUrl(baseHref, href) {
            var resultHref = '';
            var reFullUrl = /^((?:\w+\:)?)((?:\/\/)?)([^\/]*)((?:\/.*)?)$/;
            var baseHrefMatch = reFullUrl.exec(baseHref);
            var hrefMatch = reFullUrl.exec(href);

            for (var partIndex = 1; partIndex < 5; partIndex++) {
                if (hrefMatch[partIndex])
                    resultHref += hrefMatch[partIndex];
                else
                    resultHref += baseHrefMatch[partIndex];
            }

            return resultHref;
        } // end of resolveUrl

        /**
         * [normalizeLink description]
         * @param  {[type]} baseHref [description]
         * @param  {[type]} link     [description]
         * @return object
         */
        function normalizeLink(baseHref, link) {
            if (Array.isArray(link)) {
                return link.map(function (link) {
                    return normalizeLink(baseHref, link);
                });
            }

            if (link) {
                if (typeof link === 'string') link = {
                    href: link
                };
                link.href = resolveUrl(baseHref, link.href);
            } else {
                link = {
                    href: baseHref
                };
            }

            return link;
        } // end of normalizeLink

        /**
         * [getSelfLink description]
         * @param  {[type]} baseHref [description]
         * @param  {[type]} resource [description]
         * @return {[type]}          [description]
         */
        function getSelfLink(baseHref, resource) {

            if (Array.isArray(resource)) {
                return resource.map(function (resource) {
                    return getSelfLink(baseHref, resource);
                });
            }
            return normalizeLink(
                baseHref,
                resource && resource[linksAttribute] && resource[linksAttribute].self
            );
        } // end of getSelfLink
    } // end Resource Constructor


    /**
     * Creates a new Resource object using the Resource constructor
     */
    function createResource(href, options, data, xhr) {
        if (Array.isArray(data)) {
            return data.map(function (data) {
                return createResource(href, options, data, xhr);
            });
        }
        return new Resource(href, options, data, xhr);
    } // end of createResource

    /**
     * makes all the xhr calls
     */
    function callService(method, href, options, data) {
        if (!options)
            options = {};

        if (!options.headers)
            options.headers = {};

        if (!options.headers['Content-Type'])
            options.headers['Content-Type'] = 'application/json';

        if (!options.headers.Accept)
            options.headers.Accept = 'application/hal+json,application/json';

        var resource = $.ajax({
            method: method,
            url: options.transformUrl ? options.transformUrl(href) : href,
            headers: options.headers,
            data: data
        }).then(function (data, textStatus, xhr) {
            switch (Math.floor(xhr.status / 100)) {
                case 2:
                    if (data) {
                        return createResource(href, options, data, xhr);
                    }
                    if (xhr.getResponseHeader('Content-Location')) {
                        return xhr.getResponseHeader('Content-Location');
                    }
                    if (xhr.getResponseHeader('Location')) {
                        return xhr.getResponseHeader('Location');
                    }
                    return null;
                default:
                    return $.Deferred().reject(hxr.status);
            }
        });

        return resource;
    } // end callService


    $.extend({
        hal: {
            $get: function (href, options) {
                return callService('GET', href, options);
            },
            $post: function (href, options, data) {
                return callService('POST', href, options, data);
            },
            $put: function (href, options, data) {
                return callService('PUT', href, options, data);
            },
            $patch: function (href, options, data) {
                return callService('PATCH', href, options, data);
            },
            $del: function (href, options) {
                return callService('DELETE', href, options);
            }
        }
    });

    window.Resource = Resource;

}));