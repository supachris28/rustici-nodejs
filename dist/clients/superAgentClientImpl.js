"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = require("superagent");
const querystring_1 = require("querystring");
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
    }
    postRequest(path, body) {
        this.request = this.createRequest('post', path, body);
        return this.request.then(response => response);
    }
    getRequest(path, queryParams, pathParams) {
        return Promise.resolve(new Object());
    }
    putRequest(path, body) {
        return Promise.resolve(new Object());
    }
    deleteRequest(path, pathParams) {
        return Promise.resolve(new Object());
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
        const url = this.buildUrl(path, this.pathParams, '');
        let request = superagent_1.default(httpMethod, url);
        this.applyAuthToRequest(this.authTypes);
        if (this.queryParams)
            request.query(this.normalizeParams(this.queryParams));
        if (this.headerParams)
            request.set(this.normalizeParams(this.headerParams));
        if (this.contentType === 'application/x-www-form-urlencoded') {
            request.send(querystring_1.default.stringify(this.normalizeParams(this.formParams)));
        }
        else if (this.contentType == 'multipart/form-data') {
            var _formParams = this.normalizeParams(this.formParams);
            for (var key in _formParams) {
                if (_formParams.hasOwnProperty(key)) {
                    if (this.isFileParam(_formParams[key])) {
                        // file field
                        request.attach(key, _formParams[key]);
                    }
                    else {
                        request.field(key, _formParams[key]);
                    }
                }
            }
        }
        else if (body !== null && body !== undefined) {
            request.send(body);
        }
        if (this.responseType)
            request.responseType(this.responseType);
        return request;
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
        let newParams = {};
        for (let key in params) {
            if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
                let value = params[key];
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
            catch (err) { }
            if (fs && fs.ReadStream && param instanceof fs.ReadStream) {
                return true;
            }
        }
        // Buffer in Node.js
        if (typeof Buffer === 'function' && param instanceof Buffer) {
            return true;
        }
        // Blob in browser
        if (typeof Blob === 'function' && param instanceof Blob) {
            return true;
        }
        // File in browser (it seems File object is also instance of Blob, but keep this for safe)
        if (typeof File === 'function' && param instanceof File) {
            return true;
        }
        return false;
    }
}
exports.default = SuperAgentClientImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwZXJBZ2VudENsaWVudEltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpZW50cy9zdXBlckFnZW50Q2xpZW50SW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFvQztBQUNwQyw2Q0FBc0M7QUFJdEMsTUFBcUIsb0JBQW9CO0lBaUJ2QyxZQUFZLE1BQVc7UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxvQkFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLHFDQUFxQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsSUFBSSxrQkFBa0IsQ0FBQztRQUM1RCxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FB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