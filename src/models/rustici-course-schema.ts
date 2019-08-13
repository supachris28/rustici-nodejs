import ICourseActivitySchema from './rustici-course-activity-schema';
import ICourseMetadataSchema from './rustici-course-metadata-schema';

export default interface ICourseSchema {
  id: string;
  title: string;
  xapiActivityId: string;
  updated: Date;
  webPath: string;
  version: number;
  registrationCount: number;
  activityId: string;
  courseLearningStandard: string;
  metadata: ICourseMetadataSchema;
  rootActivity: ICourseActivitySchema;
}
