sap.ui.define([], () => {
  "use strict";

  return {
    /**
     * Formats a release date as the translated "Published: {Year}" text.
     * Called with the controller as "this", so it can use the controller's getText.
     * @param {Date} oDate The book's release date.
     * @returns {string} The formatted text, or an empty string if there is no date.
     */
    publishedYear(oDate) {
      if (!oDate) {
        return "";
      }

      return this.getText("publishedYear", [oDate.getFullYear()]);
    },
  };
});
