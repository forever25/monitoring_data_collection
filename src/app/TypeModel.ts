import BaseModel from "./BaseModel";
import createErrorId from "../utils/createErrorId";

class TypeModel extends BaseModel {
  constructor(props: ModelProps) {
    super(props);
  }

  /**
   * @description: 添加 采集错误
   */
  addAcquisitionError({ type = "", error = { message: "", stack: "" } }): void {
    this.add("acquisitionError", {
      errorId: createErrorId(),
      type,
      msg: error.message,
      stack: error.stack,
      url: this.pageUrl, // url
      userAgent: this.userAgent,
      timeStamp: new Date().getTime(),
    });
  }
  /**
   * @description: 添加httpError
   * @return {*}
   */
  addHttpError({
    method = "GET",
    url = "",
    type = "",
    body = "",
    status = 0,
    res = "",
  }): void {
    this.add("httpError", {
      errorId: createErrorId(),
      method,
      url,
      type,
      body,
      status,
      res,
      timeStamp: new Date().getTime(),
      userAgent: this.userAgent,
    });
  }
}

export default TypeModel;
