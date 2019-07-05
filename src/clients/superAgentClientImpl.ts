import Superagent from "superagent";
import Querystring from "querystring";
import debug from "debug";
import SuperAgentClient from './SuperAgentClient';
import Index from '../index';
import Logger from '../models/logger';

export default class SuperAgentClientImpl implements SuperAgentClient {
  public username: string;
  public password: string;
  public apiKey: string;
  public accessToken: string;
  public authTypes: string[];
  public basePath: string;
  public headerParams: object;
  public timeout: number;
  public pathParams: object;
  public queryParams: object;
  public contentType: string;
  public formParams: object;
  public responseType: string;

  private logger: Logger;
  private request: Superagent.SuperAgentRequest;

  constructor(config: any) {
    this.request = Superagent('', '');
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

    const infoLogger = debug('rustici-sdk:info');
    const errorLogger = debug('rustici-sdk:error');
    this.logger = {
      info: infoLogger,
      error: errorLogger,
    };
  }

  public postRequest(path: string, body: object) {
    this.request = this.createRequest('post', path, body);
    return this.request.then(response => response);
  }

  public getRequest(path: string) {
    this.request = this.createRequest('get', path, undefined);
    return this.request.then(response => response);
  }

  public putRequest(path: string, body: object) {
    this.request = this.createRequest('get', path, body);
    return this.request.then(response => response);
  }

  public deleteRequest(path: string) {
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
  private createRequest(httpMethod: string, path: string, body: any) {
    try {
      const url = this.buildUrl(path, this.pathParams, '');
      this.logger.info(url);

      const request = Superagent(httpMethod, url);
      this.applyAuthToRequest(this.authTypes);

      if (this.queryParams) {
        request.query(this.normalizeParams(this.queryParams));
      }

      if (this.headerParams) {
        request.set(this.normalizeParams(this.headerParams));
      }

      if (this.contentType === 'application/x-www-form-urlencoded') {
        request.send(Querystring.stringify(this.normalizeParams(this.formParams)));
      } else if (this.contentType === 'multipart/form-data') {
        const normalizedformParams = this.normalizeParams(this.formParams);
        for (const key in normalizedformParams) {
          if (normalizedformParams.hasOwnProperty(key)) {
            if (this.isFileParam(normalizedformParams[key])) {
              // file field
              request.attach(key, normalizedformParams[key]);
            } else {
              request.field(key, normalizedformParams[key]);
            }
          }
        }
      } else if (body !== null && body !== undefined) {
        request.send(body);
      }

      if (this.responseType) {
        request.responseType(this.responseType);
      }

      return request;
    } catch (error) {
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
  private buildUrl(path: string, pathParams: any, apiBasePath: string) {
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
      } else {
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
  private paramToString(param: any) {
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
  private applyAuthToRequest(authNames: string[]) {
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
  private normalizeParams(params: any) {
    const newParams: any = {};
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
        const value = params[key];
        if (this.isFileParam(value) || Array.isArray(value)) {
          newParams[key] = value;
        } else {
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
  private isFileParam(param: any) {
    // fs.ReadStream in Node.js and Electron (but not in runtime like browserify)
    if (typeof require === 'function') {
      let fs;
      try {
        fs = require('fs');
      } catch (err) { }
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