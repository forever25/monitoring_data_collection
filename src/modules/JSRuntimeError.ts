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
  init(): void {
    window.addEventListener("error", (event) => {
      try {
        this.add("jsRuntimeError", {
          title: document.title,
          errorId: createErrorId(),
          msg: event.message, //错误原因
          type: event.type,
          line: event.lineno, //错误行号
          clo: event.colno, //错误列号
          tarck: event.error.tarck, //错误堆栈
          url: window.location.href,
          filename: event.filename, //文件路径
          timeStamp: new Date().getTime(),
          userAgent: navigator.userAgent,
        });
        event.preventDefault();
      } catch (error) {
        console.error(error);
      }
      this.sync(); // 测试同步功能
    });
  }
}
