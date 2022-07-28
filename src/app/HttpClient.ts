// http 请求封装
export default class HttpClient {
  private xhr: XMLHttpRequest;
  private body: string;
  constructor(props: HttpClientProps, callbackfn: (data: any) => void) {
    try {
      this.body = JSON.stringify(props.data);
    } catch (error) {
      this.body = JSON.stringify({});
    }
    this.xhr = new XMLHttpRequest();
    this.xhr.open("POST", props.url, true);
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.setRequestHeader("token", props.token);
    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState == 4) {
        if (this.xhr.status == 200 && this.xhr.status < 400) {
          try {
            const result: string = this.xhr.responseText;
            callbackfn && callbackfn(JSON.parse(result));
          } catch (error) {
            callbackfn && callbackfn(null);
          }
        }
      }
    };
    this.xhr.send(this.body);
  }
}
