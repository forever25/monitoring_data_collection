import HttpClient from "./HttpClient";

type DataType =
  | "pv"
  | "retentionTime"
  | "unload"
  | "redirect"
  | "appCache"
  | "dns"
  | "tcp"
  | "ssl"
  | "ttfb"
  | "response"
  | "dom"
  | "dcl"
  | "resources"
  | "domReady"
  | "firstRenderTime"
  | "firstInteractiveTime"
  | "onLoadTime"
  | "promiseError"
  | "jsRuntimeError"
  | "apiError"
  | "resourceLoadingError"
  | "FCP"
  | "DCL"
  | "L"
  | "TTI"
  | "FP";

export default class DataModel {
  data: { [key: string]: any };
  arrayDataType: string[] = [
    "promiseError",
    "jsRuntimeError",
    "apiError",
    "resourceLoadingError",
  ];
  constructor() {
    this.data = {};
  }
  add(type: DataType, data: any) {
    if (this.data[type] !== undefined && Array.isArray(this.data[type])) {
      this.data[type].push(data);
    } else {
      if (this.arrayDataType.includes(type)) {
        this.data = [data];
      } else {
        this.data[type] = data;
      }
    }
  }
  sync() {
    new HttpClient(
      {
        url: `fsdjfls/skfjas/`,
        token: "sfasfkjsfkls",
        data: this.data,
      },
      (res) => {}
    );
  }
}
