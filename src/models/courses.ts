import ClientFactory from "../clients/clientFactory";
import IResponse from "../interfaces/response-interface";
import ICourseList from "../interfaces/rustici-course-list-interface";
import IExportCourseResponse from "../interfaces/export-course-response-interface";
import IExportCourseRequestBody from "../interfaces/export-course-request-body-interface";
import ICourseUploadProgressResponse from "../interfaces/course-upload-progress-response-interface";
import ILaunchLinkRequest from "../interfaces/rustici-launch-link-request-interface";
import ILaunchLink from "../interfaces/rustici-launch-link-interface";

export default class Courses {
  private client: ClientFactory;

  constructor(clientFactory: ClientFactory) {
    this.client = clientFactory;
  }

  /**
   * Returns a list of all courses
   * @returns {Promise<IResponse<ICourseList>>} course details
   */
  public async get(): Promise<IResponse<ICourseList>> {
    return this.client.getRequest<ICourseList>('/courses');
  }

  /**
   * Export the course into Rustici engine
   * @param courseId 
   * @param body
   * @param mayCreateNewVersion 
   * @returns {Promise<IResponse<IExportCourseResponse>>}
   */
  public async exportCourse(courseId: string, body: IExportCourseRequestBody, mayCreateNewVersion: boolean = true): Promise<IResponse<IExportCourseResponse>> {
    return this.client.postRequest<IExportCourseResponse>(
      `/courses/importJobs?courseId=${courseId}&mayCreateNewVersion=${mayCreateNewVersion}`,
      body,
    );
  }

  /**
   * Gets course upload progress
   * @param importJobId 
   * @returns {Promise<IResponse<ICourseUploadProgressResponse>>}
   */
  public async getCourseUploadProgress(importJobId: string): Promise<IResponse<ICourseUploadProgressResponse>> {
    return this.client.getRequest<ICourseUploadProgressResponse>(`/courses/importJobs/${importJobId}`);
  }

  /**
   * Gets the course preview link against 
   * course id.
   * @param courseId 
   * @param body 
   * @returns { Promise<IResponse<ILaunchLink>> }
   */
  public async getCoursePreviewLink(courseId: string, body: ILaunchLinkRequest): Promise<IResponse<ILaunchLink>> {
    return this.client.postRequest(`/courses/${courseId}/preview`, body);
  }
}
