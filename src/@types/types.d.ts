declare interface Window {
  DataCollection: any;
}
interface ModelProps {
  url: string;
  token: string;
}

interface DataCollectionProps {
  url: string; // 上报url
  token: string; // 项目token
  reportFrequency: number; // 上报频率 毫秒
  include: moduleTypes[];
}
interface HttpClientProps {
  url: string;
  token: string;
  data: { [key: string]: string };
}

type moduleTypes =
  | "HttpError"
  | "JSRuntimeError"
  | "LoadTime"
  | "PagePerformance"
  | "PromiseError";

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
  | "firstDataPackTime"
  | "fullyLoadedTime"
  | "onLoadTime"
  | "promiseError"
  | "jsRuntimeError"
  | "httpError"
  | "resourceLoadingError"
  | "FCP"
  | "DCL"
  | "L"
  | "TTI"
  | "FP";

type PerformanceTimingKeys = keyof typeof PerformanceTiming.prototype;
