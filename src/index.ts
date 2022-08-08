import PromiseError from "./modules/PromiseError";
import LoadTime from "./modules/LoadTime";
// import HttpError from "./modules/HttpError";
import JSRuntimeError from "./modules/JSRuntimeError";
import PagePerformance from "./modules/PagePerformance";
class DataCollection {
  url: string;
  token: string;
  params: ModelProps;
  constructor(props: DataCollectionProps) {
    this.token = props.token;
    this.url = props.url;
    this.params = {
      url: this.url,
      token: this.token,
    };
    this.init(this.params);
  }

  init(params: ModelProps): void {
    new PromiseError(params);
    new LoadTime(params);
    // new HttpError(params);
    new JSRuntimeError(params);
    new PagePerformance(params);
  }
  // /**
  //  * @description: 注册模块
  //  * @param {any} any
  //  * @return {*}
  //  */
  // registerModules(any: any): void {
  //   // TODO 可以通过配置动态添加模块
  // }
}

window.DataCollection = DataCollection;
