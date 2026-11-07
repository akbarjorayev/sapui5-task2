sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  (
    BaseController,
    JSONModel,
    MessageToast,
    MessageBox,
    Fragment,
    Filter,
    FilterOperator,
  ) => {
    "use strict";

    return BaseController.extend("project1.controller.V2Model", {
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
          editPath: oProduct.editPath,
          product: {
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

        const oModel = this.getModel("v2");

        if (oResult.editMode) {
          oModel.update(oResult.editPath, oResult.product, {
            success: () => {
              MessageToast.show(this.getText("v2EditSuccessMessage"));
              this.onProductDialogClose();
            },
            error: () => {
              MessageBox.error(this.getText("v2EditErrorMessage"));
            },
          });
          return;
        }

        oModel.create("/Products", oResult.product, {
          success: () => {
            MessageToast.show(this.getText("v2AddSuccessMessage"));
            this.onProductDialogClose();
          },
          error: () => {
            MessageBox.error(this.getText("v2AddErrorMessage"));
          },
        });
      },

      onAddRecord() {
        Fragment.load({
          id: this.getView().getId(),
          name: "project1.view.fragment.V2ProductDialog",
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
        this.byId("v2ProductDialog").close();
      },

      onProductDialogAfterClose() {
        this.byId("v2ProductDialog").destroy();
      },

      onEditRecord(oEvent) {
        const oSelectedItem = oEvent.getSource().getParent();
        const sPath = oSelectedItem.getBindingContext("v2").getPath();
        const oModel = this.getModel("v2");
        const oProductData = oModel.getProperty(sPath);

        Fragment.load({
          id: this.getView().getId(),
          name: "project1.view.fragment.V2ProductDialog",
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
            editPath: sPath,
          };

          const oProductDialogModel = new JSONModel(oProduct);
          this.getView().setModel(oProductDialogModel, "productDialog");

          this.getView().addDependent(oDialog);
          oDialog.open();
        });
      },

      _toDateString(oDate) {
        return oDate ? oDate.toISOString().split("T")[0] : "";
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

      onProductNameFilter(oEvent) {
        const sQuery = oEvent.getParameter("value");
        const oTable = this.byId("v2ProductsTable");
        const oBinding = oTable.getBinding("items");

        if (!sQuery) {
          oBinding.filter([]);
          return;
        }

        const oFilter = new Filter("Name", FilterOperator.Contains, sQuery);
        oBinding.filter(oFilter);
      },
    });
  },
);
