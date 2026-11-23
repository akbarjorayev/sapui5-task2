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

    return BaseController.extend("project1.controller.V4Model", {
      verifyProduct(oProduct) {
        const sName = (oProduct.Name || "").trim();
        const sDescription = (oProduct.Description || "").trim();
        const sPrice = String(oProduct.Price || "").trim();
        const fPrice = Number(sPrice);
        const iRating = Number(oProduct.Rating);
        const oReleaseDate = oProduct.ReleaseDate
          ? new Date(oProduct.ReleaseDate)
          : null;
        const oDiscontinuedDate = oProduct.DiscontinuedDate
          ? new Date(oProduct.DiscontinuedDate)
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
          editMode: oProduct.editMode,
          editContext: oProduct.editContext,
          product: {
            Name: sName,
            Description: sDescription,
            ReleaseDate: oReleaseDate.toISOString(),
            DiscontinuedDate: oDiscontinuedDate.toISOString(),
            Rating: iRating,
            Price: fPrice,
          },
        };
      },

      setFieldState(sControlId, bInvalid) {
        const oModel = this.getModel("productDialog");
        oModel.setProperty(`/${sControlId}State`, bInvalid ? "Error" : "None");
      },

      onProductDialogFieldChange(oEvent) {
        const sPath = oEvent.getSource().getBinding("value").getPath();
        this.getModel("productDialog").setProperty(`${sPath}State`, "None");
      },

      onSaveRecord() {
        const oResult = this.verifyProduct(
          this.getModel("productDialog").getData(),
        );
        if (!oResult.ok) {
          return;
        }

        if (oResult.editMode) {
          const oContext = oResult.editContext;
          const oProduct = oResult.product;

          Promise.all([
            oContext.setProperty("Name", oProduct.Name),
            oContext.setProperty("Description", oProduct.Description),
            oContext.setProperty("ReleaseDate", oProduct.ReleaseDate),
            oContext.setProperty("DiscontinuedDate", oProduct.DiscontinuedDate),
            oContext.setProperty("Rating", oProduct.Rating),
            oContext.setProperty("Price", oProduct.Price),
          ])
            .then(() => {
              MessageToast.show(this.getText("v4EditSuccessMessage"));
              this.onProductDialogClose();
            })
            .catch(() => {
              MessageBox.error(this.getText("v4EditErrorMessage"));
            });
          return;
        }

        const oBinding = this.byId("v4ProductsTable").getBinding("items");
        const oContext = oBinding.create(oResult.product);

        oContext
          .created()
          .then(() => {
            MessageToast.show(this.getText("v4AddSuccessMessage"));
            this.onProductDialogClose();
          })
          .catch(() => {
            MessageBox.error(this.getText("v4AddErrorMessage"));
          });
      },

      onAddRecord() {
        Fragment.load({
          id: this.getView().getId(),
          name: "project1.view.fragment.V4ProductDialog",
          controller: this,
        }).then((oDialog) => {
          const oProduct = {
            Name: "",
            Description: "",
            ReleaseDate: null,
            DiscontinuedDate: null,
            Rating: 0,
            Price: "",
            editMode: false,
          };

          const oProductDialogModel = new JSONModel(oProduct);
          this.getView().setModel(oProductDialogModel, "productDialog");

          this.getView().addDependent(oDialog);
          oDialog.open();
        });
      },

      onProductDialogClose() {
        this.byId("v4ProductDialog").close();
      },

      onProductDialogAfterClose() {
        this.byId("v4ProductDialog").destroy();
      },

      onEditRecord(oEvent) {
        const oContext = oEvent.getSource().getBindingContext("v4");
        const oProductData = oContext.getObject();

        Fragment.load({
          id: this.getView().getId(),
          name: "project1.view.fragment.V4ProductDialog",
          controller: this,
        }).then((oDialog) => {
          const oProduct = {
            Name: oProductData.Name,
            Description: oProductData.Description,
            ReleaseDate: this._toDateString(oProductData.ReleaseDate),
            DiscontinuedDate: this._toDateString(oProductData.DiscontinuedDate),
            Rating: oProductData.Rating,
            Price: oProductData.Price,
            editMode: true,
            editContext: oContext,
          };

          const oProductDialogModel = new JSONModel(oProduct);
          this.getView().setModel(oProductDialogModel, "productDialog");

          this.getView().addDependent(oDialog);
          oDialog.open();
        });
      },

      _toDateString(sDate) {
        return sDate ? sDate.split("T")[0] : "";
      },

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
