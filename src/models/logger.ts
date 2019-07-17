import debug from 'debug';

export default interface Logger {
  /**
   * Info logger
   */
  info: debug.Debugger;

  /**
   * Error logger
   */
  error: debug.Debugger;
}