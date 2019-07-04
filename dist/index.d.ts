export default class ClientSdkFactory {
    /**
     * Http client.
     * @type {Object<SuperAgent | Axios | any>}
     */
    clientImpl: any;
    /**
     * Instantiate implemented client object
     * @param {String} client
     * @param {Object} config
     * @returns {Object}
     */
    constructor(client: string, config: any);
}
