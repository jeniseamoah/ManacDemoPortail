function initModel() {
	var sUrl = "/Northwind/V2/northwind/northwind.svc/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}