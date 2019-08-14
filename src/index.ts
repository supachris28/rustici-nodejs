import SuperAgentClientImpl from './clients/superAgentClient';
import ClientFactory from './clients/clientFactory';
import IClient from './models/client-interface';
import IResponse from './models/response-interface';
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
  constructor(client: string = 'superagent', config: IClient) {
    if (client === 'superagent') {
      this.clientImpl = new SuperAgentClientImpl(config);
    } else {
      // for future use, if want to use other http client.
      this.clientImpl = {} as ClientFactory;
    }
  }

  /**
   * Returns a list of all courses
   * @returns {Promise<IResponse<ICourseSchema>>} course details
   */
  public async getCourses(): Promise<IResponse<ICourseSchema>> {
    return this.clientImpl.getRequest<ICourseSchema>('/courses');
  }

  /**
   * Registers a user
   * @param registrationDetails registration details
   * @returns {Promise<IResponse<void>>} no response
   */
  public async registerUser(registrationDetails: IRegistrationSchema):
  Promise<IResponse<void>> {
    return this.clientImpl.postRequest('/registrations', registrationDetails);
  }

  /**
   * Get launch url from registration id
   * @param registrationId registration id
   * @param launchDetails launch details
   * @returns {Promise<IResponse<ILaunchLink>>} launch link
   */
  public async getLaunchLink(registrationId: string, launchDetails: ILaunchLinkRequest): Promise<IResponse<ILaunchLink>> {
    return this.clientImpl.getRequest(`/registrations/${registrationId}/launchLink`);
  }
}
