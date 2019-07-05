"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = require("superagent");
const querystring_1 = require("querystring");
const debug_1 = require("debug");
class SuperAgentClientImpl {
    constructor(config) {
        this.request = superagent_1.default('', '');
        this.username = config.username || '';
        this.password = config.password || '';
        this.apiKey = config.password || '';
        this.accessToken = config.accessToken || '';
        this.authTypes = config.authTypes || [];
        this.basePath = config.basePath || 'https://rusticisoftware.com/api/v2/';
        this.pathParams = config.pathParams || {};
        this.queryParams = config.pathParams || {};
        this.headerParams = {};
        this.timeout = config.timeout || 60000;
        this.contentType = config.contentType || 'application/json';
        this.formParams = config.formParams || {};
        this.responseType = config.responseType;
        const infoLogger = debug_1.default('rustici-sdk:info');
        const errorLogger = debug_1.default('rustici-sdk:error');
        this.logger = {
            info: infoLogger,
            error: errorLogger,
        };
    }
    postRequest(path, body) {
        this.request = this.createRequest('post', path, body);
        return this.request.then(response => response);
    }
    getRequest(path) {
        this.request = this.createRequest('get', path, undefined);
        return this.request.then(response => response);
    }
    putRequest(path, body) {
        this.request = this.createRequest('get', path, body);
        return this.request.then(response => response);
    }
    deleteRequest(path) {
        this.request = this.createRequest('get', path, undefined);
        return this.request.then(response => response);
    }
    /**
     * Creates the SuperAgent request.
     *
     * @param {string} path
     * @param {object} queryParams
     * @param {object} pathParams
     * @param {object} body
     */
    createRequest(httpMethod, path, body) {
        try {
            const url = this.buildUrl(path, this.pathParams, '');
            this.logger.info(url);
            const request = superagent_1.default(httpMethod, url);
            this.applyAuthToRequest(this.authTypes);
            if (this.queryParams) {
                request.query(this.normalizeParams(this.queryParams));
            }
            if (this.headerParams) {
                request.set(this.normalizeParams(this.headerParams));
            }
            if (this.contentType === 'application/x-www-form-urlencoded') {
                request.send(querystring_1.default.stringify(this.normalizeParams(this.formParams)));
            }
            else if (this.contentType === 'multipart/form-data') {
                const normalizedformParams = this.normalizeParams(this.formParams);
                for (const key in normalizedformParams) {
                    if (normalizedformParams.hasOwnProperty(key)) {
                        if (this.isFileParam(normalizedformParams[key])) {
                            // file field
                            request.attach(key, normalizedformParams[key]);
                        }
                        else {
                            request.field(key, normalizedformParams[key]);
                        }
                    }
                }
            }
            else if (body !== null && body !== undefined) {
                request.send(body);
            }
            if (this.responseType) {
                request.responseType(this.responseType);
            }
            return request;
        }
        catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
    /**
     * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
     * NOTE: query parameters are not handled here.
     * @param {String} path The path to append to the base URL.
     * @param {Object} pathParams The parameter values to append.
     * @param {String} apiBasePath Base path defined in the path, operation level to override the default one
     * @returns {String} The encoded path with parameter values substituted.
     */
    buildUrl(path, pathParams, apiBasePath) {
        if (!path.match(/^\//)) {
            path = '/' + path;
        }
        let url = this.basePath + path;
        // use API (operation, path) base path if defined
        if (apiBasePath !== null && apiBasePath !== undefined && apiBasePath !== '') {
            url = apiBasePath + path;
        }
        url = url.replace(/\{([\w-]+)\}/g, (fullMatch, key) => {
            let value;
            if (pathParams.hasOwnProperty(key)) {
                value = this.paramToString(pathParams[key]);
            }
            else {
                value = fullMatch;
            }
            return encodeURIComponent(value);
        });
        return url;
    }
    /**
     * Returns a string representation for an actual parameter.
     * @param param The actual parameter.
     * @returns {String} The string representation of <code>param</code>.
     */
    paramToString(param) {
        if (!param) {
            return '';
        }
        if (param instanceof Date) {
            return param.toJSON();
        }
        return param.toString();
    }
    /**
     * Applies authentication headers to the request.
     * @param {Object} request The request object created by a <code>superagent()</code> call.
     * @param {Array.<String>} authNames An array of authentication method names.
     */
    applyAuthToRequest(authNames) {
        authNames.forEach((authName) => {
            switch (authName) {
                case 'basic':
                    if (this.username || this.password) {
                        this.request.auth(this.username || '', this.password || '');
                    }
                    break;
                case 'bearer':
                    if (this.accessToken) {
                        this.request.set({ 'Authorization': 'Bearer ' + this.accessToken });
                    }
                    break;
                case 'apiKey':
                    if (this.apiKey) {
                        this.request.set({ 'x-api-key': this.apiKey });
                    }
                    break;
                case 'apiKeyQuery':
                    if (this.apiKey) {
                        this.request.query({ 'x-api-key': this.apiKey });
                    }
                    break;
                default:
                    throw new Error('Unknown authentication type: ' + authName);
            }
        });
    }
    /**
     * Normalizes parameter values:
     * <ul>
     * <li>remove nils</li>
     * <li>keep files and arrays</li>
     * <li>format to string with `paramToString` for other cases</li>
     * </ul>
     * @param {Object.<String, Object>} params The parameters as object properties.
     * @returns {Object.<String, Object>} normalized parameters.
     */
    normalizeParams(params) {
        const newParams = {};
        for (const key in params) {
            if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
                const value = params[key];
                if (this.isFileParam(value) || Array.isArray(value)) {
                    newParams[key] = value;
                }
                else {
                    newParams[key] = this.paramToString(value);
                }
            }
        }
        return newParams;
    }
    /**
     * Checks whether the given parameter value represents file-like content.
     * @param param The parameter to check.
     * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
     */
    isFileParam(param) {
        // fs.ReadStream in Node.js and Electron (but not in runtime like browserify)
        if (typeof require === 'function') {
            let fs;
            try {
                fs = require('fs');
            }
            catch (err) {
                return false;
            }
            if (fs && fs.ReadStream && param instanceof fs.ReadStream) {
                return true;
            }
        }
        // Buffer in Node.js
        if (typeof Buffer === 'function' && param instanceof Buffer) {
            return true;
        }
        // Blob in Node.js
        if (typeof Blob === 'function' && param instanceof Blob) {
            return true;
        }
        // File in Node.js (it seems File object is also instance of Blob, but keep this for safe)
        if (typeof File === 'function' && param instanceof File) {
            return true;
        }
        return false;
    }
}
exports.default = SuperAgentClientImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwZXJBZ2VudENsaWVudEltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpZW50cy9zdXBlckFnZW50Q2xpZW50SW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFvQztBQUNwQyw2Q0FBc0M7QUFDdEMsaUNBQTBCO0FBSzFCLE1BQXFCLG9CQUFvQjtJQWtCdkMsWUFBWSxNQUFXO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsb0JBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxxQ0FBcUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQztRQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksa0JBQWtCLENBQUM7UUFDNUQsSUFBSSxDQUFDLFVBQVUs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