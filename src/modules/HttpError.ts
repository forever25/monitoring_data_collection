import BaseModel from "../app/BaseModel";
import createErrorId from "../utils/createErrorId";

export default class HttpError extends BaseModel {
  constructor(props: ModelProps) {
    super(props);
    this.init();
  }
  /**
   * @description: http请求链路错误/ 这里也可以记录正确的请求
   * @return {*}
   */
  init(): void {}
}
