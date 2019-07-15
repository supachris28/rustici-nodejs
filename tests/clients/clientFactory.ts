import { expect } from 'chai';
import fs = require('fs');
import SuperAgentClient from '../../src/clients/superAgentClient';
import { Response } from 'superagent';

const config = { username: 'Chandler Bing', password: 'Monica Geller', apiKey: 'qWeRty', accessToken: 'token', authTypes: ['basic'], pathParams: {}, queryParams: {}, headerParams: {}, formParams: {}, responseType: 'application/json', basePath: 'https://fake.url.com', timeout: 60000, contentType: 'application/json'};

const defaultConfig = { username: '', password: '', apiKey: '', accessToken: '', authTypes: [], pathParams: {}, queryParams: {}, headerParams: {}, formParams: {}, responseType: '', basePath: '', timeout: 0, contentType: ''};

describe('Client factory', () => {
  describe('Constructor', () => {
    it('Should instantiate the SuperAgent object', () => {
      const implementation = new SuperAgentClient(config);
      expect(implementation).to.be.instanceof(SuperAgentClient);
      expect(implementation.timeout).to.be.eql(60000);
      expect(implementation.basePath).to.be.eql('https://fake.url.com');
      expect(implementation.username).to.be.eql('Chandler Bing');
    });
    it('Should instantiate the SuperAgent object with default values', () => {
      const implementation = new SuperAgentClient(defaultConfig);
      expect(implementation).to.be.instanceof(SuperAgentClient);
      expect(implementation.timeout).to.be.eql(60000);
      expect(implementation.contentType).to.be.eql('application/json');
    });
  });

  describe('Build url', () => {
    it('Should build successfully with no path parameters', () => {
      const implementation = new SuperAgentClient(config);
      const url = implementation.buildUrl('/get/tenants', {}, '');
      expect(url).to.be.a('string');
      expect(url).to.be.eql('https://fake.url.com/get/tenants');
    });
    it('Should build successfully with path parameters', () => {
      const implementation = new SuperAgentClient(config);
      const url = implementation.buildUrl('/get/tenant/{tenantId}', { tenantId: 'a145' }, '');
      expect(url).to.be.a('string');
      expect(url).to.be.eql('https://fake.url.com/get/tenant/a145');
    });
    it('Should build successfully with path parameters as string', () => {
      const implementation = new SuperAgentClient(config);
      const url = implementation.buildUrl('get/tenant/{tenantId}', 'a145', '');
      expect(url).to.be.a('string');
      expect(url).to.be.eql('https://fake.url.com/get/tenant/a145');
    });
  });

  describe('Param to string', () => {
    it('Should convert successfully', () => {
      const implementation = new SuperAgentClient(config);
      const param = implementation.paramToString(145);
      expect(param).to.be.a('string');
      expect(param).to.be.eql('145');
    });
    it('Should convert successfully with date as param', () => {
      const implementation = new SuperAgentClient(config);
      const date = new Date();
      const param = implementation.paramToString(date);
      expect(param).to.be.a('string');
      expect(param).to.be.eql(date.toJSON());
    });
    it('Should return empty string', () => {
      const implementation = new SuperAgentClient(config);
      const param = implementation.paramToString('');
      expect(param).to.be.a('string');
      expect(param).to.be.eql('');
    });
  });

  describe('Normalize param', () => {
    it('When param passed as object', () => {
      const implementation = new SuperAgentClient(config);
      const param = implementation.normalizeParams({ apiKey: 'a41sF42sdf' });
      expect(param).to.be.a('object');
      expect(param).to.have.ownProperty('apiKey');
      expect(param.apiKey).to.be.eql('a41sF42sdf');
    });
    it('When param passed as array', () => {
      const implementation = new SuperAgentClient(config);
      const param = implementation.normalizeParams({ headers: [{ contentType: 'application/json', apiKey: 'a41sF42sdf' }]});
      expect(param).to.be.a('object');
      expect(param).to.have.ownProperty('headers');
      expect(param.headers).to.be.a('array');
      expect(param.headers[0]).to.have.ownProperty('contentType');
      expect(param.headers[0]).to.have.ownProperty('apiKey');
      expect(param.headers[0].contentType).to.be.eql('application/json');
      expect(param.headers[0].apiKey).to.be.eql('a41sF42sdf');
    });
  });

  describe('Is file Param', () => {
    const filename = __dirname + '/../../src/index.ts';
    it('When param passed as fs object', () => {
      const implementation = new SuperAgentClient(config);
      const result = implementation.isFileParam(fs.createReadStream(filename));
      expect(result).to.be.a('boolean');
      expect(result).to.be.eql(true);
    });
    it('When param passed as buffer', () => {
      const implementation = new SuperAgentClient(config);
      const result = implementation.isFileParam(Buffer.from(filename));
      expect(result).to.be.a('boolean');
      expect(result).to.be.eql(true);
    });
  });

  describe('Deserialize response', () => {
    it('Should return empty response for 204 status code', () => {
      const implementation = new SuperAgentClient(config);
      const response = implementation.deserialize({ status: 204} as Response, config.responseType);
      expect(Object.keys(response).length).to.be.eql(0);
    });
    it('Should return response when body is empty', () => {
      const implementation = new SuperAgentClient(config);
      const response = implementation.deserialize({ body: {}, text: "success", status: 200} as Response, config.responseType);
      expect(response.status).to.be.eql(200);
      expect(response.data).to.be.eql('success');
    })
  });
})