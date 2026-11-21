sap.ui.define(["./BaseController"], (BaseController) => {
  "use strict";

  const TAB_KEYS = ["json", "v2", "v4"];
  const DEFAULT_TAB_KEY = "json";

  return BaseController.extend("project1.controller.Main", {
    onInit() {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter
        .getRoute("RouteTab")
        .attachPatternMatched(this._onTabMatched, this);
    },

    onTabSelect(oEvent) {
      const sKey = oEvent.getParameter("key");
      const router = this.getOwnerComponent().getRouter();

      router.navTo("RouteTab", {
        tabKey: sKey,
      });
    },

    _onTabMatched(oEvent) {
      let sTabKey = oEvent.getParameter("arguments").tabKey;
      const oTabBar = this.byId("modelTabBar");

      if (!TAB_KEYS.includes(sTabKey)) {
        sTabKey = DEFAULT_TAB_KEY;
      }

      oTabBar.setSelectedKey(sTabKey);
    },
  });
});
