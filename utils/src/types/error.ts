/**
 * 通用异常
 */
export class CommonError {
  message: string;

  constructor(message: string) {
    this.message = message;
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
