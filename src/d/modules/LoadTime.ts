const typeMap = new Map();
const performanceTiming = window.performance.timing;

/**
 * @description: 开始计算各项性能指标
 * @return {*}
 */
function startCalculating(reportData: ReportData): void {
  try {
    typeMap.forEach((value: PerformanceTimingKeys[], key: DataType): void => {
      const timeConsumed =
        Number(performanceTiming[value[0]]) -
        Number(performanceTiming[value[1]]);
      reportData.addLoadTime({
        key,
        timeConsumed: timeConsumed < 0 ? 0 : timeConsumed,
      }); // 判断指标数值是否小于0 如果小于0那么就等于0
    });
  } catch (error: any) {
    reportData.addAcquisitionError({
      type: "页面性能计算",
      error,
    });
  }
}
/**
 * @description: 注册指标
 * @return {*}
 */
function initTypeMap(): void {
  typeMap.set("dns", ["domainLookupEnd", "domainLookupStart"]); // dns解析时长
  typeMap.set("tcp", ["connectEnd", "connectStart"]); // tcp
  typeMap.set("ssl", ["connectEnd", "secureConnectionStart"]);
  typeMap.set("ttfb", ["responseStart", "requestStart"]);
  typeMap.set("unload", ["unloadEventEnd", "unloadEventStart"]);
  typeMap.set("redirect", ["redirectEnd", "redirectStart"]);
  typeMap.set("appCache", ["domainLookupStart", "fetchStart"]);
  typeMap.set("response", ["responseEnd", "responseStart"]);
  typeMap.set("dom", ["domInteractive", "responseEnd"]);
  typeMap.set("dcl", [
    "domContentLoadedEventEnd",
    "domContentLoadedEventStart",
  ]);
  typeMap.set("resources", ["domComplete", "domContentLoadedEventEnd"]);
  typeMap.set("domReady", ["domContentLoadedEventEnd", "fetchStart"]);
  typeMap.set("firstRenderTime", ["responseEnd", "fetchStart"]);
  typeMap.set("firstInteractiveTime", ["domInteractive", "fetchStart"]);
  typeMap.set("onLoadTime", ["loadEventEnd", "loadEventStart"]);
  typeMap.set("firstDataPackTime", ["responseStart", "domainLookupStart"]);
  typeMap.set("fullyLoadedTime", ["responseStart", "domainLookupStart"]);
  typeMap.set("FCP", ["loadEventEnd", "navigationStart"]);
  typeMap.set("DCL", [
    "domContentLoadedEventEnd",
    "domContentLoadedEventStart",
  ]);
  typeMap.set("L", ["loadEventStart", "fetchStart"]);
  typeMap.set("TTI", ["domContentLoadedEventEnd", "navigationStart"]);
  typeMap.set("FP", ["responseStart", "navigationStart"]);
}

export default (reportData: ReportData) => {
  initTypeMap();
  startCalculating(reportData);
};
