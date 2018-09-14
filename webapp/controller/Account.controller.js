sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function (jQuery, Fragment, Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.Manac_Mon_Compte.controller.Account", {

		onInit: function (oEvent) {
			//jQuery.sap.require("sap.ui.core.util.MockServer");
			// 		var myUri = "/V2/northwind/northwind.svc";

			// 		var oMockServer = new sap.ui.core.util.MockServer({
			// 			rootUri: myUri
			// 		});

			// oMockServer.simulate("model/Organization_metadata.xml", "model/");

			// oMockServer.start();

			jQuery.sap.require("sap.ui.core.util.MockServer");
			//create the ApplicationHeader control

			var oTable = this.getView().byId("lineItemsList");
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("localService/Order_Details.json");
			oTable.setModel(oModel);
			this.getView().setModel(oModel);

			var orderModel = new sap.ui.model.json.JSONModel();
			orderModel.loadData("localService/Orders.json");
			this.getView().setModel(oModel, "Orders");

			// Set the initial form to be the display one
			this._showFormFragment("Display");

			this._oAccount = this.getView().getModel().getData();

		},
		onExit: function () {
			for (var sPropertyName in this._formFragments) {
				if (!this._formFragments.hasOwnProperty(sPropertyName) || this._formFragments[sPropertyName] === null) {
					return;
				}

				this._formFragments[sPropertyName].destroy();
				this._formFragments[sPropertyName] = null;
			}
		},

		handleEditPress: function () {

			//Clone the data

			this._oAccount = jQuery.extend({}, this.getView().getModel().getData().Orders[0]);

			this._toggleButtonsAndView(true);

			this.byId("streetText").setValue(this._oAccount.ShipVia);
			this.byId("streetNumberText").setValue(this._oAccount.ShipAddress);
			this.byId("postalCodeText").setValue(this._oAccount.ShipPostalCode);
			this.byId("cityText").setValue(this._oAccount.ShipCity);
			this.byId("countryText").setValue(this._oAccount.ShipCountry);
			this.byId("regionText").setValue(this._oAccount.ShipRegion);
			this.byId("idLanguage").setValue(this._oAccount.ShipName);

		},

		handleCancelPress: function () {

			//Restore the data
			var oModel = this.getView().getModel();
			var oData = oModel.getData();

			oModel.setData(oData);
			this._toggleButtonsAndView(false);

		},

		handleSavePress: function () {
			this._oAccount.ShipVia = this.byId("streetText").getValue();
			this._oAccount.ShipAddress = this.byId("streetNumberText").getValue();
			this._oAccount.ShipPostalCode = this.byId("postalCodeText").getValue();
			this._oAccount.ShipCity = this.byId("cityText").getValue();
			this._oAccount.ShipCountry = this.byId("countryText").getValue();
			this._oAccount.ShipRegion = this.byId("regionText").getValue();
			this._oAccount.ShipName = this.byId("idLanguage").getValue();

			var oModel = this.getView().getModel();

			oModel.oData.Orders[0]['ShipVia'] = this._oAccount.ShipVia;
			oModel.oData.Orders[0]['ShipAddress'] = this._oAccount.ShipAddress;
			oModel.oData.Orders[0]['ShipPostalCode'] = this._oAccount.ShipPostalCode;
			oModel.oData.Orders[0]['ShipCity'] = this._oAccount.ShipCity;
			oModel.oData.Orders[0]['ShipCountry'] = this._oAccount.ShipCountry;
			oModel.oData.Orders[0]['ShipRegion'] = this._oAccount.ShipRegion;
			oModel.oData.Orders[0]['ShipName'] = this._oAccount.ShipName;

			oModel.setData(oModel.oData);

			this._toggleButtonsAndView(false);

			this.byId("idStreet").setProperty("text", this._oAccount.ShipVia);
			this.byId("idStreetNumber").setProperty("text", this._oAccount.ShipAddress);
			this.byId("idPostalCode").setProperty("text", this._oAccount.ShipPostalCode);
			this.byId("idCity").setProperty("text", this._oAccount.ShipCity);
			this.byId("idCountry").setProperty("text", this._oAccount.ShipCountry);
			this.byId("idRegion").setProperty("text", this._oAccount.ShipRegion);
			this.getView().byId("languageAttribute").setProperty("text", this._oAccount.ShipName);

		},

		_formFragments: {},

		_toggleButtonsAndView: function (bEdit) {
			var oView = this.getView();

			// Show the appropriate action buttons
			oView.byId("edit").setVisible(!bEdit);
			oView.byId("save").setVisible(bEdit);
			oView.byId("cancel").setVisible(bEdit);

			// Set the right form type
			this._showFormFragment(bEdit ? "Change" : "Display");
		},
		_setValue: function (entity) {

			this.byId("streetText").setValue(entity.ShipVia);
			this.byId("streetNumberText").setValue(entity.ShipAddress);
			this.byId("postalCodeText").setValue(entity.ShipPostalCode);
			this.byId("cityText").setValue(entity.ShipCity);
			this.byId("countryText").setValue(entity.ShipCountry);
			this.byId("regionText").setValue(entity.ShipRegion);

		},
		_getFormFragment: function (sFragmentName) {
			var oFormFragment = this._formFragments[sFragmentName];

			if (oFormFragment) {
				return oFormFragment;
			}

			oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "com.Manac_Mon_Compte.view.fragment." + sFragmentName);

			this._formFragments[sFragmentName] = oFormFragment;
			return this._formFragments[sFragmentName];
		},

		_showFormFragment: function (sFragmentName) {
			var oPage = this.byId("panelForm");
			oPage.removeAllContent();
			oPage.insertContent(this._getFormFragment(sFragmentName));
		},
		onBack: function () {
			sap.m.URLHelper.redirect("https://flpnwc-a93f93181.dispatcher.hana.ondemand.com/sites/manac-portail", false);
		}
	});
});