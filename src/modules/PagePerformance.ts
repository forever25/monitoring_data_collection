import BaseModel from "../app/BaseModel";
import createErrorId from "../utils/createErrorId";

export default class PagePerformance extends BaseModel {
  constructor(props: ModelProps) {
    super(props);
    this.init();
  }
  /**
   * @description: 页面性能
   * @return {*}
   */
  init(): void {}
}
