sap.ui.define(
  ["./BaseController", "sap/m/MessageToast", "sap/m/MessageBox"],
  (BaseController, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("project1.controller.V2Model", {
      onDeleteRecord() {
        const oTable = this.byId("v2ProductsTable");
        const oSelectedItems = oTable.getSelectedItems();

        if (oSelectedItems.length === 0) {
          MessageToast.show(this.getText("selectRecordToDeleteMessage"));
          return;
        }

        const oModel = this.getModel("v2");
        oSelectedItems.forEach((oSelectedItem) => {
          const sPath = oSelectedItem.getBindingContext("v2").getPath();
          oModel.remove(sPath);
        });

        oModel.submitChanges({
          success: () =>
            MessageToast.show(this.getText("deleteSuccessMessage")),
          error: () => MessageBox.error(this.getText("deleteErrorMessage")),
        });
      },
    });
  },
);
