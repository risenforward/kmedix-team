/*****************************************************************************\

 Typescript "SOAP Client" library
 
 @author: Mohamed Selim (2017)

  based on code of Javascript "SOAP Client" library by Matteo Casati - http://www.guru4.net/
  version: 2.4 - 2007.12.21
 
\*****************************************************************************/

declare var XMLHttpRequest: any;
declare var ActiveXObject: any;
declare var $: any;

export class SOAPClientParameters {
	_pl = new Array();
	namespaces = null;

	public add(name: string, value: any): SOAPClientParameters {
		this._pl[name] = value;
		return this;
	}

	/**
	 * accepts an object that every field represents an ns name and value
	 */
	public setNamespaces(ns: any): SOAPClientParameters {

		this.namespaces = ns;
		return this;
	}

	public toXml(): string {
		var xml: string = "";
		for (var p in this._pl) {
			switch (typeof (this._pl[p])) {
				case "string":
				case "number":
				case "boolean":
				case "object":
					xml += "<" + p + ">" + SOAPClientParameters._serialize(this._pl[p]) + "</" + p + ">";
					break;
				default:
					break;
			}
		}
		return xml;
	}

	public static _serialize(o: any): string {
		if (o != 0 && !o) {
			return "";
		}
		var s: string = "";
		switch (typeof (o)) {
			case "string":
				s += o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); break;
			case "number":
			case "boolean":
				s += o.toString(); break;
			case "object":
				// Date
				if (o.constructor.toString().indexOf("function Date()") > -1) {

					var year = o.getFullYear().toString();
					var month = (o.getMonth() + 1).toString(); month = (month.length == 1) ? "0" + month : month;
					var date = o.getDate().toString(); date = (date.length == 1) ? "0" + date : date;
					var hours = o.getHours().toString(); hours = (hours.length == 1) ? "0" + hours : hours;
					var minutes = o.getMinutes().toString(); minutes = (minutes.length == 1) ? "0" + minutes : minutes;
					var seconds = o.getSeconds().toString(); seconds = (seconds.length == 1) ? "0" + seconds : seconds;
					var milliseconds = o.getMilliseconds().toString();
					var tzminutes: any = Math.abs(o.getTimezoneOffset());
					var tzhours: any = 0;
					while (tzminutes >= 60) {
						tzhours++;
						tzminutes -= 60;
					}
					tzminutes = (tzminutes.toString().length == 1) ? "0" + tzminutes.toString() : tzminutes.toString();
					tzhours = (tzhours.toString().length == 1) ? "0" + tzhours.toString() : tzhours.toString();
					var timezone = ((o.getTimezoneOffset() < 0) ? "+" : "-") + tzhours + ":" + tzminutes;
					s += year + "-" + month + "-" + date + "T" + hours + ":" + minutes + timezone; //+ ":" + seconds + "." + milliseconds
				}
				// Array
				else if (o.constructor.toString().indexOf("function Array()") > -1) {
					for (var p in o) {
						if (!isNaN(Number(p)))   // linear array
						{
							// (/function\s+(\w*)\s*\(/ig).exec(o[p].constructor.toString());
							// var type = RegExp.$1;
							// switch (type) {
							// 	case "":
							// 		type = typeof (o[p]);
							// 	case "String":
							// 		type = "string"; break;
							// 	case "Number":
							// 		type = "int"; break;
							// 	case "Boolean":
							// 		type = "bool"; break;
							// 	case "Date":
							// 		type = "DateTime"; break;
							// }
							s += /*"<" + type + ">" + */ SOAPClientParameters._serialize(o[p]) /* + "</" + type + ">" */
						}
						else    // associative array
							s += "<" + p + ">" + SOAPClientParameters._serialize(o[p]) + "</" + p + ">"
					}
				}
				// Object or custom function
				else
					for (var p in o)
						s += "<" + p + ">" + SOAPClientParameters._serialize(o[p]) + "</" + p + ">";
				break;
			default:
				break; // throw new Error(500, "SOAPClientParameters: type '" + typeof(o) + "' is not supported");
		}
		return s;
	}

}

export class SOAPClient {

	public static userName = null;
	public static password = null;

	public static invoke(url: string, method: string, parameters: SOAPClientParameters, async: boolean, callback: (data: any, resXml: any) => void): any {
		if (async)
			SOAPClient._loadWsdl(url, method, parameters, async, callback);
		else
			return SOAPClient._loadWsdl(url, method, parameters, async, callback);
	}

	// private: wsdl cache
	private static SOAPClient_cacheWsdl = new Array();

	// private: invoke async
	private static _loadWsdl(url: string, method: string, parameters: SOAPClientParameters, async: boolean, callback: (data: any, resXml: any) => void): void {
		// load from cache?
		var wsdl = SOAPClient.SOAPClient_cacheWsdl[url];

		if (wsdl + "" != "" && wsdl + "" != "undefined")
			return SOAPClient._sendSoapRequest(url, method, parameters, async, callback, wsdl);
		// get wsdl
		var xmlHttp = SOAPClient._getXmlHttp();
		xmlHttp.open("GET", url + "?wsdl", async);
		if (async) {
			xmlHttp.onreadystatechange = function () {
				if (xmlHttp.readyState == 4)
					SOAPClient._onLoadWsdl(url, method, parameters, async, callback, xmlHttp);
			}
		}
		xmlHttp.send(null);
		if (!async)
			return SOAPClient._onLoadWsdl(url, method, parameters, async, callback, xmlHttp);
	}

	private static _onLoadWsdl(url, method, parameters, async, callback, req) {
		try {
			var wsdl = req.responseXML;
			SOAPClient.SOAPClient_cacheWsdl[url] = wsdl;	// save a copy in cache
			return SOAPClient._sendSoapRequest(url, method, parameters, async, callback, wsdl);
		}
		catch (e) {
			SOAPClient.SOAPClient_cacheWsdl[url] = undefined;
			callback(new Error(e.message));
		}
	}

	private static _sendSoapRequest(url, method, parameters, async, callback, wsdl) {
		// get namespace
		var ns = (wsdl.documentElement.attributes["targetNamespace"] + "" == "undefined") ? wsdl.documentElement.attributes.getNamedItem("targetNamespace").nodeValue : wsdl.documentElement.attributes["targetNamespace"].value;
		// build SOAP request
		var sr =
			"<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
			"<soap:Envelope " +
			"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
			"xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
			"xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"";

		if (parameters.namespaces) {
			for (var n in parameters.namespaces) {
				sr += " xmlns:" + n + "=\"" + parameters.namespaces[n] + "\"";
			}
		}

		sr += ">" +
			"<soap:Body>";
		if (!parameters.namespaces) {
			sr += "<m:" + method + " xmlns:m=\"" + ns + "\">";
		}

		sr += parameters.toXml();

		if (!parameters.namespaces) {
			sr += "</m:" + method + ">";
		}

		sr += "</soap:Body></soap:Envelope>";
		// send request
		var xmlHttp = SOAPClient._getXmlHttp();
		if (SOAPClient.userName && SOAPClient.password) {
			xmlHttp.open("POST", url, async, SOAPClient.userName, SOAPClient.password);
			// Some WS implementations (i.e. BEA WebLogic Server 10.0 JAX-WS) don't support Challenge/Response HTTP BASIC, so we send authorization headers in the first request
			xmlHttp.setRequestHeader("Authorization", "Basic " + SOAPClient._toBase64(SOAPClient.userName + ":" + SOAPClient.password));

		}
		else
			xmlHttp.open("POST", url, async);
		if (!parameters.namespaces) {
			var soapaction = ((ns.lastIndexOf("/") != ns.length - 1) ? ns + "/" : ns) + method;
		}
		else {
			var soapaction = method;
		}

		xmlHttp.setRequestHeader("SOAPAction", soapaction);
		xmlHttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
		if (async) {
			xmlHttp.onreadystatechange = function () {
				if (xmlHttp.readyState == 4)
					SOAPClient._onSendSoapRequest(method, async, callback, wsdl, xmlHttp);
			}
		}
		xmlHttp.send(sr);
		if (!async)
			return SOAPClient._onSendSoapRequest(method, async, callback, wsdl, xmlHttp);
	}

	private static _onSendSoapRequest(method, async, callback, wsdl, req) {
		var o = null;

		if (!req.responseXML) { //no response at all
			if (callback)
				callback(o, req.responseXML);
			if (!async)
				return o;
			return;
		}
		try {

			var nd = SOAPClient._getElementsByTagName(req.responseXML, "return");
			if (nd.length == 0) {

				var resp = $(req.responseXML).children().children().children();
				for (var i = 0; i < resp.length; i++) {
					// var r = resp[i];
					// var j = $(resp[i]);
					if (resp[i].tagName.indexOf("Response") > -1) {
						nd = [resp[i]];
						break;
					}
				}

			}
			//
			if (nd.length == 0) {
				if (req.responseXML.getElementsByTagName("faultcode").length > 0) {
					if (async || callback)
						o = new Error(req.responseXML.getElementsByTagName("faultstring")[0].textContent);
					else
						throw new Error(req.responseXML.getElementsByTagName("faultstring")[0].textContent);
				}
				else { //no return and no fault - empty resp
					o = {}
				}
			}
			else if (nd.length == 1) {
				o = SOAPClient._soapresult2object(nd[0], wsdl);
			}
			else { //the weblogic server returns an array as each value inside a <return> element not, an array inside inside one return element
				o = [];
				for (var i = 0; i < nd.length; i++) {
					o.push(SOAPClient._soapresult2object(nd[i], wsdl));
				}
			}
		}
		catch (ex) {
			o = ex;
		}
		if (callback)
			callback(o, req.responseXML);
		if (!async)
			return o;
	}

	private static _soapresult2object(node, wsdl) {
		var wsdlTypes = SOAPClient._getTypesFromWsdl(wsdl);
		return SOAPClient._node2object(node, wsdlTypes);
	}

	private static _node2object(node, wsdlTypes) {
		// null node
		if (node == null)
			return null;
		// text node
		if (node.nodeType == 3 || node.nodeType == 4)
			return SOAPClient._extractValue(node, wsdlTypes);
		// leaf node
		if (node.childNodes.length == 1 && (node.childNodes[0].nodeType == 3 || node.childNodes[0].nodeType == 4))
			return SOAPClient._node2object(node.childNodes[0], wsdlTypes);
		var isarray = SOAPClient._getTypeFromWsdl(node.nodeName, wsdlTypes).toLowerCase().indexOf("arrayof") != -1;
		// object node
		if (!isarray && node.tagName.indexOf("List") == -1) {
			var obj = null;
			if (node.hasChildNodes())
				obj = new Object();
			for (var i = 0; i < node.childNodes.length; i++) {
				var p = SOAPClient._node2object(node.childNodes[i], wsdlTypes);
				obj[node.childNodes[i].nodeName] = p;
			}
			return obj;
		}
		// list node
		else {
			// create node ref
			var l = new Array();
			for (var i = 0; i < node.childNodes.length; i++)
				l[l.length] = SOAPClient._node2object(node.childNodes[i], wsdlTypes);
			return l;
		}

	}

	private static _extractValue(node, wsdlTypes) {
		var value = node.nodeValue;
		switch (SOAPClient._getTypeFromWsdl(node.parentNode.nodeName, wsdlTypes).toLowerCase()) {
			default:
			case "s:string":
				return (value != null) ? value + "" : "";
			case "s:boolean":
				return value + "" == "true";
			case "s:int":
			case "s:long":
				return (value != null) ? parseInt(value + "", 10) : 0;
			case "s:double":
				return (value != null) ? parseFloat(value + "") : 0;
			case "s:datetime":
				if (value == null)
					return null;
				else {
					value = value + "";
					value = value.substring(0, (value.lastIndexOf(".") == -1 ? value.length : value.lastIndexOf(".")));
					value = value.replace(/T/gi, " ");
					value = value.replace(/-/gi, "/");
					var d = new Date();
					d.setTime(Date.parse(value));
					return d;
				}
		}
	}

	private static _getTypesFromWsdl(wsdl) {
		var wsdlTypes = new Array();
		// IE
		var ell = wsdl.getElementsByTagName("s:element");
		var useNamedItem = true;
		// MOZ
		if (ell.length == 0) {
			ell = wsdl.getElementsByTagName("element");
			useNamedItem = false;
		}
		for (var i = 0; i < ell.length; i++) {
			if (useNamedItem) {
				if (ell[i].attributes.getNamedItem("name") != null && ell[i].attributes.getNamedItem("type") != null)
					wsdlTypes[ell[i].attributes.getNamedItem("name").nodeValue] = ell[i].attributes.getNamedItem("type").nodeValue;
			}
			else {
				if (ell[i].attributes["name"] != null && ell[i].attributes["type"] != null)
					wsdlTypes[ell[i].attributes["name"].value] = ell[i].attributes["type"].value;
			}
		}
		return wsdlTypes;
	}
	private static _getTypeFromWsdl(elementname, wsdlTypes) {
		var type = wsdlTypes[elementname] + "";
		return (type == "undefined") ? "" : type;
	}

	// private: utils
	private static _getElementsByTagName(document, tagName) {
		try {
			// trying to get node omitting any namespaces (latest versions of MSXML.XMLDocument)
			return document.selectNodes(".//*[local-name()=\"" + tagName + "\"]");
		}
		catch (ex) { }
		// old XML parser support
		return document.getElementsByTagName(tagName);
	}



	// private: xmlhttp factory
	private static _getXmlHttp() {
		try {
			if (XMLHttpRequest) {
				var req = new XMLHttpRequest();
				// some versions of Moz do not support the readyState property and the onreadystate event so we patch it!
				if (req.readyState == null) {
					req.readyState = 1;
					req.addEventListener("load",
						() => {
							req.readyState = 4;
							if (typeof req.onreadystatechange == "function")
								req.onreadystatechange();
						},
						false);
				}
				return req;
			}
			if (ActiveXObject)
				return new ActiveXObject(SOAPClient._getXmlHttpProgID());
		}
		catch (ex) { }
		throw new Error("Your browser does not support XmlHttp objects");
	}

	private static progid: any = null;
	private static progids = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];

	private static _getXmlHttpProgID() {
		if (SOAPClient.progid)
			return SOAPClient.progid;
		var o;
		for (var i = 0; i < SOAPClient.progids.length; i++) {
			try {
				o = new ActiveXObject(SOAPClient.progids[i]);
				return SOAPClient.progid = SOAPClient.progids[i];
			}
			catch (ex) { };
		}
		throw new Error("Could not find an installed XML parser");
	}

	private static _toBase64(input) {
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			}
			else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
				keyStr.charAt(enc3) + keyStr.charAt(enc4);
		}
		while (i < input.length);

		return output;
	}

}
