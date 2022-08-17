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
    window.addEventListener(
      "unhandledrejection",
      (event) => {
        try {
          this.typeModel.add("promiseError", {
            title: document.title,
            errorId: createErrorId(),
            msg: event.reason,
            type: event.type,
            url: window.location.href,
            timeStamp: new Date().getTime(),
            userAgent: navigator.userAgent,
          });
          event.preventDefault();
        } catch (error: any) {
          this.typeModel.addAcquisitionError({
            type: "捕获promise错误",
            error,
          });
        }
      },
      true
    );
  }
}
