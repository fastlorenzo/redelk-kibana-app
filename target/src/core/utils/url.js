"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRelativeUrl = exports.modifyUrl = void 0;
const url_1 = require("url");
/**
 *  Takes a URL and a function that takes the meaningful parts
 *  of the URL as a key-value object, modifies some or all of
 *  the parts, and returns the modified parts formatted again
 *  as a url.
 *
 *  Url Parts sent:
 *    - protocol
 *    - slashes (does the url have the //)
 *    - auth
 *    - hostname (just the name of the host, no port or auth information)
 *    - port
 *    - pathname (the path after the hostname, no query or hash, starts
 *        with a slash if there was a path)
 *    - query (always an object, even when no query on original url)
 *    - hash
 *
 *  Why?
 *    - The default url library in node produces several conflicting
 *      properties on the "parsed" output. Modifying any of these might
 *      lead to the modifications being ignored (depending on which
 *      property was modified)
 *    - It's not always clear whether to use path/pathname, host/hostname,
 *      so this tries to add helpful constraints
 *
 *  @param url The string url to parse.
 *  @param urlModifier A function that will modify the parsed url, or return a new one.
 *  @returns The modified and reformatted url
 *  @public
 */
function modifyUrl(url, urlModifier) {
    const parsed = url_1.parse(url, true);
    // Copy over the most specific version of each property. By default, the parsed url includes several
    // conflicting properties (like path and pathname + search, or search and query) and keeping track
    // of which property is actually used when they are formatted is harder than necessary.
    const meaningfulParts = {
        auth: parsed.auth,
        hash: parsed.hash,
        hostname: parsed.hostname,
        pathname: parsed.pathname,
        port: parsed.port,
        protocol: parsed.protocol,
        query: parsed.query || {},
        slashes: parsed.slashes,
    };
    // The urlModifier modifies the meaningfulParts object, or returns a new one.
    const modifiedParts = urlModifier(meaningfulParts) || meaningfulParts;
    // Format the modified/replaced meaningfulParts back into a url.
    return url_1.format({
        auth: modifiedParts.auth,
        hash: modifiedParts.hash,
        hostname: modifiedParts.hostname,
        pathname: modifiedParts.pathname,
        port: modifiedParts.port,
        protocol: modifiedParts.protocol,
        query: modifiedParts.query,
        slashes: modifiedParts.slashes,
    });
}
exports.modifyUrl = modifyUrl;
/**
 * Determine if a url is relative. Any url including a protocol, hostname, or
 * port is not considered relative. This means that absolute *paths* are considered
 * to be relative *urls*
 * @public
 */
function isRelativeUrl(candidatePath) {
    // validate that `candidatePath` is not attempting a redirect to somewhere
    // outside of this Kibana install
    const all = url_1.parse(candidatePath, false /* parseQueryString */, true /* slashesDenoteHost */);
    const { protocol, hostname, port } = all;
    // We should explicitly compare `protocol`, `port` and `hostname` to null to make sure these are not
    // detected in the URL at all. For example `hostname` can be empty string for Node URL parser, but
    // browser (because of various bwc reasons) processes URL differently (e.g. `///abc.com` - for browser
    // hostname is `abc.com`, but for Node hostname is an empty string i.e. everything between schema (`//`)
    // and the first slash that belongs to path.
    if (protocol !== null || hostname !== null || port !== null) {
        return false;
    }
    return true;
}
exports.isRelativeUrl = isRelativeUrl;
