import { expect } from 'chai';
import 'mocha';
import Index from '../src/index';
import SuperAgentClient from '../src/clients/superAgentClient';
import ClientFactory from '../src/clients/clientFactory';

describe('Index', () => {
  const config = { username: 'Chandler Bing', password: 'Monica Geller', apiKey: 'qWeRty', accessToken: 'token', authTypes: ['basic'], pathParams: {}, queryParams: {}, headerParams: {}, formParams: {}, responseType: 'application/json', basePath: '', timeout: 6000, contentType: 'application/json'};
  it('Should reject a configuration without a client', () => {
    expect(() => new Index('', config))
      .to.throw(Error)
      .and.have.property('message', 'client is required');
  });
  it('Should instantiate the SuperAgent object', () => {
    const client = new Index('superagent', config);
    expect(client.clientImpl).to.instanceof(SuperAgentClient);
  });
  it('Should instantiate the empty ClientFactory object', () => {
    const client = new Index('Axios', config);
    expect(client.clientImpl).to.be.empty;
  });
})
