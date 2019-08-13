interface MetadataSchema {
  title: string;
  titleLanguage: string;
  description: string;
  descriptionLanguage: string;
  duration: string;
  typicalTime: string;
  keywords: string[];
};

interface CourseActivitySchema {
  externalIdentifier: string;
  itemIdentifier: string;
  resourceIdentifier: string;
  activityType: string;
  href: string;
  scaledPassingScore: string;
  title: string;
  children: any[];
}

export default interface CourseSchema {
  id: string;
  title: string;
  xapiActivityId: string;
  updated: Date;
  webPath: string;
  version: number;
  registrationCount: number;
  activityId: string;
  courseLearningStandard: string;
  metadata: MetadataSchema;
  rootActivity: CourseActivitySchema;
}
