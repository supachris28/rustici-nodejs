import SuperAgentClientImpl from './clients/superAgentClient';
import ClientFactory from './clients/clientFactory';
import Client from './models/client';
import Response from './models/response';
import CourseSchema from './models/rustici-course-schema';

export default class RusticiSdk {
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

  /**
   * Returns a list of all courses
   * @returns {Promise<Response<CourseSchema>>}
   */
  public async getCourses(): Promise<Response<CourseSchema>> {
    return await this.clientImpl.getRequest<CourseSchema>('/courses');
  }
}
