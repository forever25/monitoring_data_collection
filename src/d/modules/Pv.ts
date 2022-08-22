// import TypeModel from "../app/TypeModel";
// import createErrorId from "../utils/createErrorId";

// export default class PromiseError {
//   typeModel: TypeModel;
//   constructor(props: TypeModel) {
//     this.typeModel = props;
//     this.init();
//   }
//   /**
//    * @description: Promise 错误捕获
//    * @return {*}
//    */
//   init(): void {
//     this.listenerHash();
//   }

//   listenerHash(): void {
//     window.addEventListener("hashchange", () => {});
//   }
//   history(): void {
//     window.addEventListener("hashchange", () => {});
//   }
//   /**
//    * @description: 开始计时
//    * @return {*}
//    */
//   startTimer() {}
// }
let timer = 0;

function startTimer(): void {
  timer = new Date().getTime();
}

function listenerHash(reportData: ReportData): void {
  window.addEventListener("hashchange", (event) => {
    const oldTimer = timer;
    timer = new Date().getTime();
    console.log(event);
    reportData.addPv({
      newURL: event.newURL,
      oldURL: event.oldURL,
      pageRetentionTime: timer - oldTimer,
      type: event.type,
    });
  });
}

function listenerHistory(reportData: ReportData): void {
  let oldURL = window.location.href;
  window.addEventListener("popstate", (event) => {
    const oldTimer = timer;
    timer = new Date().getTime();
    const wind = event.currentTarget as Window;
    reportData.addPv({
      newURL: wind.location?.href,
      oldURL,
      pageRetentionTime: timer - oldTimer,
      type: event.type,
    });

    oldURL = wind.location?.href;
  });
}

function listenerReplaceState(reportData: ReportData): void {
  let oldURL = window.location.href;
  window.addEventListener("replaceState", (event) => {
    const oldTimer = timer;
    timer = new Date().getTime();
    const wind = event.currentTarget as Window;
    reportData.addPv({
      newURL: wind.location?.href,
      oldURL,
      pageRetentionTime: timer - oldTimer,
      type: event.type,
    });
    oldURL = wind.location?.href;
  });
}

function listenerPushState(reportData: ReportData): void {
  let oldURL = window.location.href;
  window.addEventListener("pushState", (event) => {
    const oldTimer = timer;
    timer = new Date().getTime();
    const wind = event.currentTarget as Window;
    reportData.addPv({
      newURL: wind.location?.href,
      oldURL,
      pageRetentionTime: timer - oldTimer,
      type: event.type,
    });
    oldURL = wind.location?.href;
  });
}

function wr(history: History, type: historyKey, ...args: any[]) {
  const orig = history[type];
  return function () {
    const rv = orig.apply(history, args);
    const e = new Event(type);
    window.dispatchEvent(e);
    return rv;
  };
}

history.pushState = wr(history, "pushState");
history.replaceState = wr(history, "replaceState");

export default (reportData: ReportData) => {
  startTimer();
  listenerHash(reportData);
  listenerHistory(reportData);
  listenerPushState(reportData);
  listenerReplaceState(reportData);
};
