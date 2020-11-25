import ICourse from "./rustici-course-interface";

export default interface ICourseUploadImportResult {
  webPathToCourse: string;
  parserWarnings: string[];
  courseLanguages: string[];
  course: ICourse;
};
