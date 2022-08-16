import HttpClient from "./HttpClient";
import createErrorId from "../utils/createErrorId";

export default class BaseModel {
  data: { [key: string]: any };
  arrayDataType: DataType[] = [
    "promiseError",
    "jsRuntimeError",
    "httpError",
    "resourceLoadingError",
    "pv",
    "acquisitionError",
  ]; // 是数组类型数据
  token: string;
  url: string;
  pageUrl = window.location.href;
  userAgent = navigator.userAgent;
  constructor(props: ModelProps) {
    this.data = {};
    this.token = props.token;
    this.url = props.url;
  }
  getData(): { [key: string]: any } {
    return this.data;
  }
  add(type: DataType, data: any): void {
    // 如果不等于undefined并且是数组 直接push
    if (this.data[type] !== undefined && Array.isArray(this.data[type])) {
      Array.isArray(data)
        ? this.data[type].push(...data)
        : this.data[type].push(data);
    } else {
      // 否则都是没有初始化过的
      // 判断数据类型是否为数组
      if (this.arrayDataType.includes(type)) {
        this.data[type] = Array.isArray(data) ? data : [data];
      } else {
        this.data[type] = data;
      }
    }
  }
  /**
   * @description: 添加 采集错误
   * @param {*} type
   * @param {*} error
   * @return {*}
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
      userAgent: navigator.userAgent,
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

  /**
   * @description: 同步数据并清空原数据
   * @return {Promise<boolean>}
   */
  sync(async: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      new HttpClient(
        {
          url: this.url,
          token: this.token,
          data: this.data,
        },
        (res) => {
          if (res) {
            resolve(true);
            this.syncSuccess();
          } else {
            resolve(false);
            this.syncError();
          }
        },
        async
      );
    });
  }
  /**
   * @description: 成功调用方法
   * @return {*}
   */
  syncSuccess() {
    this.data = {};
  }
  /**
   * @description: 失败调用方法
   * @return {*}
   */
  syncError() {
    console.log("数据同步失败");
  }
}
