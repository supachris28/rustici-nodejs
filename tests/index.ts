import { expect } from 'chai';
import 'mocha';
import Index from '../src/index';
import SuperAgentClient from '../src/clients/superAgentClient';

describe('Index', () => {
  const config = { username: 'Chandler Bing', password: 'Monica Geller', apiKey: 'qWeRty', accessToken: 'token', authTypes: ['basic'], pathParams: {}, queryParams: {}, headerParams: {}, formParams: {}, responseType: 'application/json', basePath: '', timeout: 6000, contentType: 'application/json'};
  it('Should instantiate the SuperAgent object when empty client not passed', () => {
    const client = new Index(undefined, config);
    expect(client).to.be.a('object');
    expect(client).to.have.ownProperty('clientImpl');
    expect(client.clientImpl).to.instanceof(SuperAgentClient);
  });
  it('Should instantiate the SuperAgent object', () => {
    const client = new Index('superagent', config);
    expect(client).to.be.a('object');
    expect(client).to.have.ownProperty('clientImpl');
    expect(client.clientImpl).to.instanceof(SuperAgentClient);
  });
  it('Should instantiate the empty ClientFactory object', () => {
    const client = new Index('Axios', config);
    expect(client).to.be.a('object');
    expect(client).to.have.ownProperty('clientImpl');
    expect(client.clientImpl).to.be.a('object');
    expect(Object.keys(client.clientImpl).length).to.be.eql(0);
  });
})
