import BaseModel from "../app/BaseModel";
import createErrorId from "../utils/createErrorId";

export default class ResourceLoadingError extends BaseModel {
  constructor(props: ModelProps) {
    super(props);
    this.init();
  }
  /**
   * @description: 资源加载错误
   * @return {*}
   */
  init(): void {
    window.addEventListener(
      "error",
      (event) => {
        try {
          // 有 e.target.src(href) 的认定为资源加载错误
          if (event.target && (event.target.src || event.target.href)) {
            this.add("resourceLoadingError", {
              title: document.title,
              errorId: createErrorId(),
              tagName: event.target.tagName, //加载失败的标签名
              filename: event.target.src || event.target.href, //加载失败的资源路径
              type: event.type,
              url: window.location.href,
              timeStamp: new Date().getTime(),
              userAgent: navigator.userAgent,
            });
          }
          event.preventDefault();
        } catch (error) {
          console.error(error);
        }
        this.sync(); // 测试同步功能
      },
      true
    );
  }
}
