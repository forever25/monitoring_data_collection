import HttpError from "./modules/HttpError";
import createErrorId from "../utils/createErrorId";

let reportData: ReportData = initReportData();

HttpError(reportData);

/**
 * @description: 数据发送
 * @param {ReportData} data
 * @return {*}
 */
function sendData(data: ReportData, token: string, url: string): void {
  const fromData = new FormData();
  fromData.append("data", JSON.stringify(data));
  fromData.append("token", token);

  window.navigator.sendBeacon(url, fromData);
  reportData = initReportData();
}

/**
 * @description: 初始化上传数据对象
 * @return {*}
 */
function initReportData(): ReportData {
  const userAgent = window.navigator.userAgent;
  const pageUrl = window.location.href;
  const title = document.title;

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const viewPointW = window.innerWidth;
  const viewPointH = window.innerHeight;

  const data: ReportData = {
    promiseError: [],
    jsRuntimeError: [],
    httpError: [],
    resourceLoadingError: [],
    pv: [],
    acquisitionError: [],
    loadTime: [],
    addAcquisitionError({
      type = "",
      error = { message: "", stack: "" },
    }): void {
      this.acquisitionError.push({
        errorId: createErrorId(),
        type,
        msg: error.message,
        stack: error.stack,
        url: pageUrl, // url
        userAgent,
        timeStamp: new Date().getTime(),
      });
    },
    addResourceLoadingError({ tagName = "", type = "", fileName = "" }): void {
      this.resourceLoadingError.push({
        title: title,
        errorId: createErrorId(),
        type,
        tagName,
        fileName, //文件路径
        url: pageUrl,
        timeStamp: new Date().getTime(),
        userAgent: userAgent,
      });
    },
    addJsRuntimeError({
      msg = "",
      type = "",
      line = 0,
      clo = 0,
      error = "",
      fileName = "",
    }): void {
      this.jsRuntimeError.push({
        title: title,
        errorId: createErrorId(),
        msg, //错误原因
        type,
        line, //错误行号
        clo, //错误列号
        error, //错误堆栈
        url: pageUrl,
        fileName, //文件路径
        timeStamp: new Date().getTime(),
        userAgent: userAgent,
      });
    },
    addLoadTime({ timeConsumed = 0, type = "" }) {
      this.loadTime.push({
        type,
        errorId: createErrorId(), // 错误id
        timeConsumed, // 用时
        url: pageUrl, // url
        timeStamp: new Date().getTime(), // 时间戳
        userAgent, // 浏览器版本
        screenWidth: screenWidth, // 屏幕宽度
        screenHeight: screenHeight, // 屏幕高度
        viewPointW: viewPointW, // 视口宽度
        viewPointH: viewPointH, // 视口高度
      });
    },
    addPromiseError({ msg = "", type = "" }) {
      this.promiseErrors.push({
        errorId: createErrorId(),
        title,
        msg,
        type,
        url: pageUrl,
        timeStamp: new Date().getTime(),
        userAgent,
      });
    },
    addPv() {
      this.pv.push({
        userAgent,
      });
    },
  };

  return data;
}

window.DataCollection = (url: string, token: string) => {
  /**
   * @description: 数据上报
   * @return {*}
   */
  window.addEventListener(
    "beforeunload",
    () => {
      sendData(reportData, url, token);
    },
    false
  );

  /**
   * @description: 数据上报的时机
   * @return {*}
   */
  window.addEventListener(
    "load",
    () => {
      sendData(reportData, url, token);
    },
    false
  );
};
