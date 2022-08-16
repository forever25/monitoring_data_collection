import PromiseError from "./modules/PromiseError";
import LoadTime from "./modules/LoadTime";
import HttpError from "./modules/HttpError";
import JSRuntimeError from "./modules/JSRuntimeError";
import BaseModel from "./app/BaseModel";
class DataCollection {
  params: ModelProps;
  baseModel: BaseModel;
  include: moduleTypes[];
  includeModules = {
    HttpError: HttpError,
    JSRuntimeError: JSRuntimeError,
    LoadTime: LoadTime,
    PromiseError: PromiseError,
  };
  timer: NodeJS.Timeout;
  reportFrequency: number;
  constructor({
    token,
    url,
    include = ["HttpError", "JSRuntimeError", "LoadTime", "PromiseError"],
    reportFrequency = 10000,
  }: DataCollectionProps) {
    this.params = {
      url: url,
      token: token,
    };
    this.baseModel = new BaseModel(this.params);
    this.include = include;
    this.reportFrequency = reportFrequency;
    this.registerModules(this.include);
    this.setReportFrequency();

    window.addEventListener("beforeunload", () => {
      this.baseModel.sync(false);
    });
  }

  /**
   * @description: 设置同步周期
   * @return {*}
   */
  setReportFrequency() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.baseModel.sync(true);
      this.setReportFrequency();
    }, this.reportFrequency);
  }

  /**
   * @description: 注册模块
   * @param {any} any
   * @return {*}
   */
  registerModules(include: moduleTypes[]): void {
    const keys = Object.keys(this.includeModules);
    for (let i = 0; i < include.length; i++) {
      if (keys.includes(include[i])) {
        new this.includeModules[include[i]](this.baseModel);
      }
    }
  }
}

window.DataCollection = DataCollection;
