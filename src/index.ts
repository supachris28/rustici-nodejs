import SuperAgentClientImpl from './clients/superAgentClientImpl';

export default class ClientSdkFactory {
  /**
   * Http client.
   * @type {Object<SuperAgent | Axios | any>}
   */
  public clientImpl: any;

  /**
   * Instantiate implemented client object
   * @param {String} client
   * @param {Object} config
   * @returns {Object}
   */
  constructor(client: string, config: any) {
    if (!client) throw new Error('client is required');
    if (!config) throw new Error('config is required');

    if (client === 'superagent') {
      this.clientImpl = new SuperAgentClientImpl(config);
    }
  }

}