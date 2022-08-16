import BaseModel from "../app/BaseModel";
import createErrorId from "../utils/createErrorId";

// 页面加载时间指标
export default class LoadTime {
  screenWidth: number;
  screenHeight: number;
  viewPointW: number;
  viewPointH: number;
  performance: Performance;
  performanceTiming: PerformanceTiming;
  typeMap: Map<DataType, PerformanceTimingKeys[]>;
  baseModel: BaseModel;
  constructor(props: BaseModel) {
    this.baseModel = props;
    this.typeMap = new Map();
    this.screenWidth = window.screen.width;
    this.screenHeight = window.screen.height;
    this.viewPointW = window.innerWidth;
    this.viewPointH = window.innerHeight;
    this.performance = window.performance;
    this.performanceTiming = window.performance.timing;
    this.init();
  }
  /**
   * @description: Promise 错误捕获
   * @return {*}
   */
  init(): void {
    this.initTypeMap();
    window.addEventListener(
      "load",
      () => {
        this.startCalculating();
      },
      false
    );
  }
  /**
   * @description: 初始化页面加载时间
   * @return {*}
   */
  initTypeMap(): void {
    this.typeMap.set("dns", ["domainLookupEnd", "domainLookupStart"]);
    this.typeMap.set("tcp", ["connectEnd", "connectStart"]);
    this.typeMap.set("ssl", ["connectEnd", "secureConnectionStart"]);
    this.typeMap.set("ttfb", ["responseStart", "requestStart"]);
    this.typeMap.set("unload", ["unloadEventEnd", "unloadEventStart"]);
    this.typeMap.set("redirect", ["redirectEnd", "redirectStart"]);
    this.typeMap.set("appCache", ["domainLookupStart", "fetchStart"]);
    this.typeMap.set("response", ["responseEnd", "responseStart"]);
    this.typeMap.set("dom", ["domInteractive", "responseEnd"]);
    this.typeMap.set("dcl", [
      "domContentLoadedEventEnd",
      "domContentLoadedEventStart",
    ]);
    this.typeMap.set("resources", ["domComplete", "domContentLoadedEventEnd"]);
    this.typeMap.set("domReady", ["domContentLoadedEventEnd", "fetchStart"]);
    this.typeMap.set("firstRenderTime", ["responseEnd", "fetchStart"]);
    this.typeMap.set("firstInteractiveTime", ["domInteractive", "fetchStart"]);
    this.typeMap.set("onLoadTime", ["loadEventEnd", "loadEventStart"]);
    this.typeMap.set("firstDataPackTime", [
      "responseStart",
      "domainLookupStart",
    ]);
    this.typeMap.set("fullyLoadedTime", ["responseStart", "domainLookupStart"]);
    this.typeMap.set("FCP", ["loadEventEnd", "navigationStart"]);
    this.typeMap.set("DCL", [
      "domContentLoadedEventEnd",
      "domContentLoadedEventStart",
    ]);
    this.typeMap.set("L", ["loadEventStart", "fetchStart"]);
    this.typeMap.set("TTI", ["domContentLoadedEventEnd", "navigationStart"]);
    this.typeMap.set("FP", ["responseStart", "navigationStart"]);
  }
  /**
   * @description: 开始计算
   * @return {*}
   */
  startCalculating(): void {
    this.typeMap.forEach(
      (value: PerformanceTimingKeys[], key: DataType): void => {
        const timeConsumed =
          Number(this.performanceTiming[value[0]]) -
          Number(this.performanceTiming[value[1]]);
        this.setData(key, timeConsumed < 0 ? 0 : timeConsumed);
      }
    );
  }
  /**
   * @description: 页面性能
   * @param {string} type
   * @param {number} timeConsumed 用时
   * @return {*}
   */
  setData(type: DataType, timeConsumed: number): void {
    this.baseModel.add(type, {
      errorId: createErrorId(), // 错误id
      timeConsumed: timeConsumed, // 用时
      url: window.location.href, // url
      timeStamp: new Date().getTime(), // 时间戳
      userAgent: navigator.userAgent, // 浏览器版本
      screenWidth: this.screenWidth, // 屏幕宽度
      screenHeight: this.screenHeight, // 屏幕高度
      viewPointW: this.viewPointW, // 视口宽度
      viewPointH: this.viewPointH, // 视口高度
    });
  }
}
