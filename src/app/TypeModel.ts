import BaseModel from "./BaseModel";
import createErrorId from "../utils/createErrorId";

class TypeModel extends BaseModel {
  constructor(props: ModelProps) {
    super(props);
  }

  /**
   * @description: 添加 采集错误
   */
  addAcquisitionError({ type = "", error = { message: "", stack: "" } }): void {
    this.add("acquisitionError", {
      errorId: createErrorId(),
      type,
      msg: error.message,
      stack: error.stack,
      url: this.pageUrl, // url
      userAgent: this.userAgent,
      timeStamp: new Date().getTime(),
    });
  }
  /**
   * @description: 添加httpError
   * @return {*}
   */
  addHttpError({
    method = "GET",
    url = "",
    type = "",
    body = "",
    status = 0,
    res = "",
  }): void {
    this.add("httpError", {
      errorId: createErrorId(),
      method,
      url,
      type,
      body,
      status,
      res,
      timeStamp: new Date().getTime(),
      userAgent: this.userAgent,
    });
  }
  /**
   * @description: 添加js运行时错误
   * @return {*}
   */
  arrResourceLoadingError({ tagName = "", type = "", fileName = "" }): void {
    this.add("resourceLoadingError", {
      title: document.title,
      errorId: createErrorId(),
      type,
      tagName,
      fileName, //文件路径
      url: this.pageUrl,
      timeStamp: new Date().getTime(),
      userAgent: this.userAgent,
    });
  }
  /**
   * @description: 添加js运行时错误
   * @return {*}
   */
  addJsRuntimeError({
    msg = "",
    type = "",
    line = 0,
    clo = 0,
    error = "",
    fileName = "",
  }): void {
    this.add("jsRuntimeError", {
      title: document.title,
      errorId: createErrorId(),
      msg, //错误原因
      type,
      line, //错误行号
      clo, //错误列号
      error, //错误堆栈
      url: this.pageUrl,
      fileName, //文件路径
      timeStamp: new Date().getTime(),
      userAgent: this.userAgent,
    });
  }
}

export default TypeModel;
