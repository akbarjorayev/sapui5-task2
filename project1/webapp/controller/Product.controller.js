sap.ui.define(["./BaseController"], (BaseController) => {
  "use strict";

  return BaseController.extend("project1.controller.Product", {
    onInit() {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter
        .getRoute("RouteProduct")
        .attachPatternMatched(this._onProductMatched, this);
    },

    _onProductMatched(oEvent) {
      const sProductID = oEvent.getParameter("arguments").ProductID;

      this.getView().bindElement({
        path: `/Products(${sProductID})`,
        model: "v2",
        parameters: { expand: "Supplier" },
      });
    },
  });
});
