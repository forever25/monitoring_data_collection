export default (reportData: ReportData) => {
  window.addEventListener(
    "unhandledrejection",
    (event) => {
      try {
        reportData.addPromiseError({
          msg: event.reason,
          type: event.type,
        });
        event.preventDefault();
      } catch (error: any) {
        reportData.addAcquisitionError({
          type: "捕获promise错误",
          error,
        });
      }
    },
    true
  );
};
