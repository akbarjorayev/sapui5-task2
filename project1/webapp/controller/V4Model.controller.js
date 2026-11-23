sap.ui.define(
  ["./BaseController", "sap/m/MessageToast", "sap/m/MessageBox"],
  (BaseController, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("project1.controller.V4Model", {
      onDeleteRecord() {
        const oTable = this.byId("v4ProductsTable");
        const oSelectedItems = oTable.getSelectedItems();

        if (oSelectedItems.length === 0) {
          MessageToast.show(this.getText("v4SelectRecordToDeleteMessage"));
          return;
        }

        const aPromises = oSelectedItems.map((oItem) => {
          return oItem.getBindingContext("v4").delete();
        });

        Promise.all(aPromises)
          .then(() => {
            MessageToast.show(this.getText("v4DeleteSuccessMessage"));
          })
          .catch(() => {
            MessageBox.error(this.getText("v4DeleteErrorMessage"));
          });
      },
    });
  },
);
