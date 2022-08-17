import HttpClient from "./HttpClient";

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
  syncSuccess(): void {
    this.data = {};
  }
  /**
   * @description: 失败调用方法
   * @return {*}
   */
  syncError(): void {
    console.log("数据同步失败");
  }
}
