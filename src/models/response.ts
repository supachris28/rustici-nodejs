export default interface Response<T> {
  /**
   * Response status
   */
  status: number;

  /**
   * Response body
   */
  data: T;
}
