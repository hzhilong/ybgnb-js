import {BaseUtils} from "../utils/base-utils.ts";

/**
 * 通用异常
 */
export class CommonError {
  message: string;
  error?: unknown;

  constructor(message: string, error?: unknown) {
    this.message = error ? `${message} ${BaseUtils.getErrorMessage(error)}` : message;
    this.error = error;
  }
}

/**
 * 终止异常
 */
export class AbortedError extends CommonError {
  constructor() {
    super("操作已取消");
  }
}
