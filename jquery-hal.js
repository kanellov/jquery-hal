;(function ($, window, document, undefined) {
    var rfc6570 = window.rfc6570;

    function Resource(href, options, data) {
        var linksAttribute,
            embeddedAttribute,
            links,
            embedded;

        function defineHiddenProperty(target, name, value) {
            Object.defineProperty(target, name, {
                configurable: false,
                enumerable: false,
                value: value
            });
        }

        function embedResource(resource) {
            var href;
            if (Array.isArray(resource)) return resource.map(function (resource) {
                return embedResource(resource);
            });
            href = resource.$href('self');
            embedded[href] = $.Deferred().when(resource);
        }

        function hrefLink(link, params) {
            return link.templated ? new rfc6570.UriTemplate(link.href).stringify(params) : link.href;
        }

        function callLink(method, link, params, data) {
            var linkHref;
            if (Array.isArray(link)) {
                return $.Deferred().when(link.map(function (link) {
                    if (method !== 'GET') {
                        throw 'method is not supported for arrays';
                    }
                    return callLink(method, link, params, data);
                }));
            }

            linkHref = hrefLink(link, params);

            if (method === 'GET') {
                if (linkHref in embedded) {
                    return embedded[linkHref];
                }
                return callService(method, linkHref, options, data);
            } else {
                return callService(method, linkHref, options, data);
            }

        }

        function getSelfLink(baseHref, resource) {

            if (Array.isArray(resource)) {
                return resource.map(function (resource) {
                    return getSelfLink(baseHref, resource);
                });
            }
            return normalizeLink(baseHref, resource && resource[linksAttribute] && resource[linksAttribute].self);
        }

        linksAttribute = options.linksAttribute || '_links';
        embeddedAttribute = options.embeddedAttribute || '_embedded';
        links = {};
        embedded = {};
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


        if (data[linksAttribute]) {
            Object.keys(data[linksAttribute])
                .forEach(function (rel) {
                    var link;
                    link = data[linksAttribute][rel];
                    link = normalizeLink(href, link);
                    links[rel] = link;
                }, this);
        }

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
    }

    function createResource(href, options, data) {
        if (Array.isArray(data)) {
            return data.map(function (data) {
                return createResource(href, options, data);
            });
        }
        return new Resource(href, options, data);
    }

    function normalizeLink(baseHref, link) {
        if (Array.isArray(link)) {
            return link.map(function (link) {
                return normalizeLink(baseHref, link);
            });
        }

        if (link) {
            if (typeof link === 'string') {
                link = {
                    href: link
                };
            }
            link.href = resolveUrl(baseHref, link.href);
        } else {
            link = {
                href: baseHref
            };
        }

        return link;
    }

    function callService(method, href, options, data) {
        if (!options) options = {};
        if (!options.headers) options.headers = {};
        if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json';
        if (!options.headers.Accept) options.headers.Accept = 'application/hal+json,application/json';

        var resource = $.ajax({
            method: method,
            url: options.transformUrl ? options.transformUrl(href) : href,
            headers: options.headers,
            data: data
        }).done(function (data, textStatus, xhr) {
            switch (Math.floor(xhr.status / 100)) {
                case 2:
                    if (data) {
                        return createResource(href, options, data);
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
    }

    function resolveUrl(baseHref, href) {
        var resultHref, reFullUrl, baseHrefMatch, hrefMatch;
        resultHref = '';
        reFullUrl = /^((?:\w+\:)?)((?:\/\/)?)([^\/]*)((?:\/.*)?)$/;
        baseHrefMatch = reFullUrl.exec(baseHref);
        hrefMatch = reFullUrl.exec(href);
        for (var partIndex = 1; partIndex < 5; partIndex++) {
            if (hrefMatch[partIndex]) resultHref += hrefMatch[partIndex];
            else resultHref += baseHrefMatch[partIndex];
        }
        return resultHref;
    }

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

}(jQuery, window, document));
