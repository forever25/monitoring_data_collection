import BaseModel from "../app/BaseModel";
import createErrorId from "../utils/createErrorId";

export default class PromiseError extends BaseModel {
  constructor(props: ModelProps) {
    super(props);
    this.init();
  }
  /**
   * @description: Promise 错误捕获
   * @return {*}
   */
  init(): void {
    window.addEventListener(
      "unhandledrejection",
      (event) => {
        try {
          this.add("promiseError", {
            title: document.title,
            errorId: createErrorId(),
            msg: event.reason,
            type: event.type,
            url: window.location.href,
            timeStamp: new Date().getTime(),
            userAgent: navigator.userAgent,
          });
          event.preventDefault();
        } catch (error) {
          console.error(error);
        }
        this.sync(); // 测试同步功能
      },
      true
    );
  }
}
