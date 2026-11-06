/*global QUnit*/

sap.ui.define([
	"project1/controller/JSON.controller"
], function (Controller) {
	"use strict";

	QUnit.module("JSON Controller");

	QUnit.test("I should test the JSON controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
