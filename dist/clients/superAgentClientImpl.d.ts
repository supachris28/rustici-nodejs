import Superagent from "superagent";
import ISuperAgentClient from './ISuperAgentClient';
export default class SuperAgentClientImpl implements ISuperAgentClient {
    username: string;
    password: string;
    apiKey: string;
    accessToken: string;
    authTypes: Array<string>;
    basePath: string;
    headerParams: object;
    timeout: number;
    pathParams: object;
    queryParams: object;
    contentType: string;
    formParams: object;
    responseType: string;
    private request;
    constructor(config: any);
    postRequest(path: string, body: object): Promise<Superagent.Response>;
    getRequest(path: string, queryParams: object, pathParams: object): Promise<Object>;
    putRequest(path: string, body: object): Promise<Object>;
    deleteRequest(path: string, pathParams: object): Promise<Object>;
    /**
     * Creates the SuperAgent request.
     *
     * @param {string} path
     * @param {object} queryParams
     * @param {object} pathParams
     * @param {object} body
     */
    createRequest(httpMethod: string, path: string, body: object): Superagent.SuperAgentRequest;
    /**
     * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
     * NOTE: query parameters are not handled here.
     * @param {String} path The path to append to the base URL.
     * @param {Object} pathParams The parameter values to append.
     * @param {String} apiBasePath Base path defined in the path, operation level to override the default one
     * @returns {String} The encoded path with parameter values substituted.
     */
    buildUrl(path: string, pathParams: any, apiBasePath: string): string;
    /**
     * Returns a string representation for an actual parameter.
     * @param param The actual parameter.
     * @returns {String} The string representation of <code>param</code>.
     */
    paramToString(param: any): any;
    /**
      * Applies authentication headers to the request.
      * @param {Object} request The request object created by a <code>superagent()</code> call.
      * @param {Array.<String>} authNames An array of authentication method names.
      */
    applyAuthToRequest(authNames: Array<string>): void;
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
    normalizeParams(params: any): any;
    /**
      * Checks whether the given parameter value represents file-like content.
      * @param param The parameter to check.
      * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
      */
    isFileParam(param: any): boolean;
}
