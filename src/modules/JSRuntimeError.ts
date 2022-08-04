import BaseModel from "../app/BaseModel";
import createErrorId from "../utils/createErrorId";

export default class JSRuntimeError extends BaseModel {
  constructor(props: ModelProps) {
    super(props);
    this.init();
  }
  /**
   * @description: js 运行时 错误捕获
   * @return {*}
   */
  init(): void {}
}
