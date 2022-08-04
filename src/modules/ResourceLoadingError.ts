import BaseModel from "../app/BaseModel";
import createErrorId from "../utils/createErrorId";

export default class ResourceLoadingError extends BaseModel {
  constructor(props: ModelProps) {
    super(props);
    this.init();
  }
  /**
   * @description: 资源加载错误
   * @return {*}
   */
  init(): void {}
}
