import TypeModel from "../app/TypeModel";

export default class JSRuntimeError {
  typeModel: TypeModel;
  constructor(typeModel: TypeModel) {
    this.typeModel = typeModel;
    this.init();
  }
  /**
   * @description: 监听error事件
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
        } catch (error: any) {
          this.typeModel.addAcquisitionError({
            type: "监听error事件",
            error,
          });
        }
      },
      true
    );
  }
  /**
   * @description: 资源加载错误
   * @param {ErrorEvent} event
   * @return {*}
   */
  resourceLoadingError(event: ErrorEvent) {
    const { tagName, fileName } = this.getFileName(event);
    // tagName 和 fileName 不存在那么就返回
    if (!tagName && !fileName) {
      return;
    }

    this.typeModel.arrResourceLoadingError({
      tagName: tagName, //加载失败的标签名
      fileName, //加载失败的资源路径
      type: event.type,
    });
  }

  /**
   * @description: 获取文件名
   * @param {ErrorEvent} event
   * @return {*}
   */
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

  /**
   * @description: js 运行时错误
   * @param {ErrorEvent} event
   * @return {*}
   */
  jsRuntimeError(event: ErrorEvent) {
    this.typeModel.addJsRuntimeError({
      msg: event.message, //错误原因
      type: event.type,
      line: event.lineno, //错误行号
      clo: event.colno, //错误列号
      error: event.error.error, //错误堆栈
      fileName: event.filename, //文件路径
    });
  }
}
