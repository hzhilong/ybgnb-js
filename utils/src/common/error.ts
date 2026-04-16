import {getErrorMessage} from "../utils/error.js";

/**
 * 通用异常
 */
export class CommonError {
  message: string;
  error?: unknown;

  constructor(message: string, error?: unknown) {
    this.message = error ? `${message} ${getErrorMessage(error)}` : message;
    this.error = error;
  }
}

/**
 * 中止异常
 */
export class AbortedError extends CommonError {
  constructor() {
    super("操作已取消");
  }
}
