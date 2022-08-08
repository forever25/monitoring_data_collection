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
    window.addEventListener(
      "error",
      (event) => {
        try {
          if (event.target === window) {
            this.jsRuntimeError(event);
          } else {
            this.resourceLoadingError(event);
          }
        } catch (error) {
          console.error(error);
        }
        this.sync(); // 测试同步功能
      },
      true
    );
  }
  resourceLoadingError(event: ErrorEvent) {
    const { tagName, fileName } = this.getFileName(event);
    // tagName 和 fileName 不存在那么就返回
    if (!tagName && !fileName) {
      return;
    }

    this.add("resourceLoadingError", {
      title: document.title,
      errorId: createErrorId(),
      tagName: tagName, //加载失败的标签名
      fileName, //加载失败的资源路径
      type: event.type,
      url: window.location.href,
      timeStamp: new Date().getTime(),
      userAgent: navigator.userAgent,
    });
  }

  getFileName(event: ErrorEvent) {
    const target = <Element>event.target;
    const tagName = target.tagName;
    let fileName = "";
    switch (tagName) {
      case "LINK":
        {
          const targetLink = <HTMLLinkElement>target;
          fileName = targetLink.href;
        }
        break;
      case "IMG":
        {
          const targetLink = <HTMLImageElement>target;
          fileName = targetLink.src;
        }
        break;
      case "SCRIPT":
        {
          const targetLink = <HTMLScriptElement>target;
          fileName = targetLink.src;
        }
        break;
    }
    return { fileName, tagName };
  }

  jsRuntimeError(event: ErrorEvent) {
    this.add("jsRuntimeError", {
      title: document.title,
      errorId: createErrorId(),
      msg: event.message, //错误原因
      type: event.type,
      line: event.lineno, //错误行号
      clo: event.colno, //错误列号
      tarck: event.error.tarck, //错误堆栈
      error: event.error.error, //错误堆栈
      url: window.location.href,
      filename: event.filename, //文件路径
      timeStamp: new Date().getTime(),
      userAgent: navigator.userAgent,
    });
  }
}
