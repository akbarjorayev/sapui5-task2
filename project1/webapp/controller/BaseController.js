sap.ui.define([
    "sap/ui/core/mvc/Controller",
], (Controller) => {
    "use strict";

    return Controller.extend("project1.controller.BaseController", {
      getModel(sName) {
        return this.getView().getModel(sName);
      },

      getText(sKey) {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey);
      }
    });
});