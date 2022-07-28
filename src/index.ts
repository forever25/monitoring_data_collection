import PromiseError from "./modules/PromiseError";
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

  init(params: ModelProps) {
    new PromiseError(params);
  }
}

window.DataCollection = DataCollection;
