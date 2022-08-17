import TypeModel from "../app/TypeModel";

export default class HttpError {
  httpList: any[];
  typeModel: TypeModel;
  constructor(props: TypeModel) {
    this.typeModel = props;
    this.httpList = [];
    this.init();
  }
  /**
   * @description: http请求链路错误/ 这里也可以记录正确的请求
   * @return {*}
   */
  init(): void {
    this.overrideXMLHttpRequest();
    this.overrideFetch();
    window.addEventListener("beforeunload", () => {
      this.setData();
    });

    setInterval(() => {
      this.setData();
    }, 5000);
  }
  /**
   * @description: 设置同步数据
   * @return {*}
   */
  setData(): void {
    this.httpList.forEach((it) => {
      if (it.status) {
        this.typeModel.addHttpError(it);
      }
    });

    this.httpList = this.httpList.filter((it) => !it.status);
  }
  /**
   * @description: 重写XMLHttpRequest
   * @return {*}
   */
  overrideXMLHttpRequest(): void {
    const self = this;
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method: string, url: string) {
      try {
        if (url !== self.typeModel.url) {
          self.httpList.push({
            method,
            type: "XMLHttpRequest",
            url,
            httpClient: this,
          });
        }
      } catch (error: any) {
        self.typeModel.addAcquisitionError({
          type: "XMLHttpRequest.open",
          error,
        });
      }
      return open.call(this, method, url, true);
    };
    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (...rest: any[]) {
      const body = rest[0];
      this.addEventListener("readystatechange", function () {
        try {
          if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 300) {
              self.httpList = self.httpList.filter((it) => {
                return it.httpClient !== this;
              });
            } else {
              const errorClient = self.httpList.find((it) => {
                return it.httpClient === this;
              });

              if (errorClient) {
                errorClient.body = body;
                errorClient.status = this.status;
                errorClient.res = this.responseText;

                delete errorClient.httpClient;
              }
            }
          }
        } catch (error: any) {
          self.typeModel.addAcquisitionError({
            type: "XMLHttpRequest 返回",
            error,
          });
        }
      });
      return send.call(this, body);
    };
  }
  /**
   * @description: 重写 fetch
   * @return {*}
   */
  overrideFetch(): void {
    const self = this;
    const originFetch = fetch;
    Object.defineProperty(window, "fetch", {
      configurable: true,
      enumerable: true,
      get() {
        return (url: string, options: any = {}) => {
          return new Promise<Response>((resolve, reject) => {
            originFetch(url, options)
              .then((res) => {
                if (res.status !== 200) {
                  resolve(res);
                  try {
                    res.text().then((data) => {
                      self.pushFetch(url, options, res, data);
                    });
                  } catch (error: any) {
                    self.typeModel.addAcquisitionError({
                      type: "fetch接收请求",
                      error,
                    });
                  }
                }
              })
              .catch((error) => {
                reject(error);
              });
          });
        };
      },
    });
  }
  /**
   * @description: 添加fetch 数据到列表中
   * @param {string} url
   * @param {any} options
   * @param {Response} res
   * @return {*}
   */
  pushFetch(url: string, options: any = {}, res: Response, data?: any): void {
    if (url === this.typeModel.url) return;
    this.httpList.push({
      type: "fetch",
      method: options.method,
      body: options.body || options.params,
      url,
      res: data,
      status: res.status,
    });
  }
}
