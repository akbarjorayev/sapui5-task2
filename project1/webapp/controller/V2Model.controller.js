sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
  ],
  (BaseController, JSONModel, MessageToast, MessageBox, Fragment) => {
    "use strict";

    return BaseController.extend("project1.controller.V2Model", {
      verifyNewProduct(oNewProduct) {
        const sName = (oNewProduct.Name || "").trim();
        const sDescription = (oNewProduct.Description || "").trim();
        const sPrice = String(oNewProduct.Price || "").trim();
        const fPrice = Number(sPrice);
        const iRating = Number(oNewProduct.Rating);
        const oReleaseDate = oNewProduct.ReleaseDate
          ? new Date(oNewProduct.ReleaseDate)
          : null;
        const oDiscontinuedDate = oNewProduct.DiscontinuedDate
          ? new Date(oNewProduct.DiscontinuedDate)
          : null;

        const bNameValid = !!sName;
        const bDescriptionValid = !!sDescription;
        const bReleaseDateValid = !!oReleaseDate;
        const bDiscontinuedDateValid = !!oDiscontinuedDate;
        const bRatingValid = iRating > 0;
        const bPriceValid = fPrice > 0;

        this.setFieldState("Name", !bNameValid);
        this.setFieldState("Description", !bDescriptionValid);
        this.setFieldState("ReleaseDate", !bReleaseDateValid);
        this.setFieldState("DiscontinuedDate", !bDiscontinuedDateValid);
        this.setFieldState("Rating", !bRatingValid);
        this.setFieldState("Price", !bPriceValid);

        if (
          !bNameValid ||
          !bDescriptionValid ||
          !bReleaseDateValid ||
          !bDiscontinuedDateValid ||
          !bRatingValid ||
          !bPriceValid
        ) {
          return { ok: false };
        }

        return {
          ok: true,
          product: {
            ...oNewProduct,
            Name: sName,
            Description: sDescription,
            ReleaseDate: oReleaseDate,
            DiscontinuedDate: oDiscontinuedDate,
            Rating: iRating,
            Price: fPrice,
          },
        };
      },

      setFieldState(sControlId, bInvalid) {
        const oModel = this.getModel("newProduct");
        oModel.setProperty(`/${sControlId}State`, bInvalid ? "Error" : "None");
      },

      onAddDialogFieldChange(oEvent) {
        const sPath = oEvent.getSource().getBinding("value").getPath();
        this.getModel("newProduct").setProperty(`${sPath}State`, "None");
      },

      onSaveRecord() {
        const oResult = this.verifyNewProduct(
          this.getModel("newProduct").getData(),
        );
        if (!oResult.ok) {
          return;
        }

        const oModel = this.getModel("v2");
        oModel.create("/Products", oResult.product, {
          success: () => {
            MessageToast.show(this.getText("v2AddSuccessMessage"));
            this.onAddDialogClose();
          },
          error: () => {
            MessageBox.error(this.getText("v2AddErrorMessage"));
          },
        });
      },

      onAddRecord() {
        Fragment.load({
          id: this.getView().getId(),
          name: "project1.view.fragment.V2AddDialog",
          controller: this,
        }).then((oDialog) => {
          const oNewProduct = {
            Name: "",
            Description: "",
            ReleaseDate: null,
            DiscontinuedDate: null,
            Rating: 0,
            Price: "",
          };

          const oNewProductModel = new JSONModel(oNewProduct);
          this.getView().setModel(oNewProductModel, "newProduct");

          this.getView().addDependent(oDialog);
          oDialog.open();
        });
      },

      onAddDialogClose() {
        this.byId("v2AddDialog").close();
      },

      onAddDialogAfterClose() {
        this.byId("v2AddDialog").destroy();
      },

      onDeleteRecord() {
        const oTable = this.byId("v2ProductsTable");
        const oSelectedItems = oTable.getSelectedItems();

        if (oSelectedItems.length === 0) {
          MessageToast.show(this.getText("v2SelectRecordToDeleteMessage"));
          return;
        }

        const oModel = this.getModel("v2");
        oSelectedItems.forEach((oSelectedItem) => {
          const sPath = oSelectedItem.getBindingContext("v2").getPath();
          oModel.remove(sPath);
        });

        oModel.submitChanges({
          success: () =>
            MessageToast.show(this.getText("v2DeleteSuccessMessage")),
          error: () => MessageBox.error(this.getText("v2DeleteErrorMessage")),
        });
      },
    });
  },
);
