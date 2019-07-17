import SuperAgentClientImpl from './clients/superAgentClient';
import ClientFactory from './clients/clientFactory';
import Client from './models/client';

export default class ClientSdk {
  /**
   * Http client.
   * @type {ClientFactory}
   */
  public clientImpl: ClientFactory;

  /**
   * Instantiate class
   * @param {String} client
   * @param {Object} config
   */
  constructor(client: string = 'superagent', config: Client) {
    if (client === 'superagent') {
      this.clientImpl = new SuperAgentClientImpl(config);
    } else {
      // for future use, if want to use other http client.
      this.clientImpl = {} as ClientFactory;
    }
  }

}