let httpList: any[] = [];
/**
 * @description: 重写XMLHttpRequest
 * @return {*}
 */
function overrideXMLHttpRequest(reportData: ReportData): void {
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method: string, url: string) {
    try {
      httpList.push({
        method,
        type: "XMLHttpRequest",
        url,
        httpClient: this,
      });
    } catch (error: any) {
      reportData.addAcquisitionError.push({
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
          if (this.status < 200 && this.status > 300) {
            const errorClient = httpList.find((it) => {
              return it.httpClient === this;
            });

            if (errorClient) {
              errorClient.body = body;
              errorClient.status = this.status;
              errorClient.res = this.responseText;
              delete errorClient.httpClient;
              reportData.HttpError.push(errorClient);
            }
          }
          httpList = httpList.filter((it) => {
            return it.httpClient !== this;
          });
        }
      } catch (error: any) {
        reportData.addAcquisitionError({
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
function overrideFetch(reportData: ReportData): void {
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
                    reportData.HttpError.push({
                      type: "fetch",
                      method: options.method,
                      body: options.body || options.params,
                      url,
                      res: data,
                      status: res.status,
                    });
                  });
                } catch (error: any) {
                  reportData.addAcquisitionError({
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

export default (data: ReportData) => {
  overrideXMLHttpRequest(data);
  overrideFetch(data);
};
