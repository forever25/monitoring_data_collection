import TypeModel from "../app/TypeModel";
import createErrorId from "../utils/createErrorId";

export default class PromiseError {
  typeModel: TypeModel;
  constructor(props: TypeModel) {
    this.typeModel = props;
    this.init();
  }
  /**
   * @description: Promise 错误捕获
   * @return {*}
   */
  init(): void {
    this.listenerHash();
  }

  listenerHash(): void {
    window.addEventListener("hashchange", () => {});
  }
  history(): void {
    window.addEventListener("hashchange", () => {});
  }
  /**
   * @description: 开始计时
   * @return {*}
   */
  startTimer() {}
}
