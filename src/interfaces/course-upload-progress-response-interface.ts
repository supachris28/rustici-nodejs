import ICourseUploadImportResult from "./course-upload-import-result-interface";

export default interface ICourseUploadProgressResponse {
  jobId: string;
  status: string;
  message: string;
  importResult: ICourseUploadImportResult;
};
