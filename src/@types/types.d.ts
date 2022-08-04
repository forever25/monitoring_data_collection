declare interface Window {
  DataCollection: any;
}
interface ModelProps {
  url: string;
  token: string;
}

interface DataCollectionProps {
  url: string;
  token: string;
}
interface HttpClientProps {
  url: string;
  token: string;
  data: { [key: string]: string };
}

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
