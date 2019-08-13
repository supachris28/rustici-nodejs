import SuperAgentClientImpl from './clients/superAgentClient';
import ClientFactory from './clients/clientFactory';
import Client from './models/client';
import Response from './models/response';
import ICourseSchema from './models/rustici-course-schema';
import IRegistrationSchema from './models/rustici-registration-schema';
import ILaunchLinkRequest from './models/rustici-launch-link-request-interface';
import ILaunchLink from './models/rustici-launch-link-interface';

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
   * @returns {Promise<Response<ICourseSchema>>} course details
   */
  public async getCourses(): Promise<Response<ICourseSchema>> {
    return this.clientImpl.getRequest<ICourseSchema>('/courses');
  }

  /**
   * Registers a user
   * @param registrationDetails registration details
   * @returns {Promise<Response<void>>} no response
   */
  public async registerUser(registrationDetails: IRegistrationSchema):
  Promise<Response<void>> {
    return this.clientImpl.postRequest('/registrations', registrationDetails);
  }

  /**
   * Get launch url from registration id
   * @param registrationId registration id
   * @param launchDetails launch details
   * @returns {Promise<Response<ILaunchLink>>} launch link
   */
  public async getLaunchLink(registrationId: string, launchDetails: ILaunchLinkRequest): Promise<Response<ILaunchLink>> {
    return this.clientImpl.getRequest(`/registrations/${registrationId}/launchLink`);
  }
}
