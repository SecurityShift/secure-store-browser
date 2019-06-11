class SecShiftSecureStoreCC {

	constructor(api_key,api_endpoint) {
		this.api_key = api_key
		this.api_endpoint = api_endpoint
		this.checkJQuery()
	}

	async checkJQuery() {
		if (typeof jQuery == "undefined") {
			await this.loadScript("https://code.jquery.com/jquery-3.4.1.min.js")
			console.log("jQuery " + jQuery.fn.jquery + " injected.")
		} else {
			console.log("jQuery " + jQuery.fn.jquery + " present")
		}
	}

	loadScript(scriptSource) {
		return new Promise((resolve, reject) => {
			const script = document.createElement("script")
			script.type = "text/javascript"
			script.async = true
			script.src = scriptSource

			const el = document.getElementsByTagName("script")[0]
			el.parentNode.insertBefore(script, el)

			script.addEventListener("load", () => {
				this.isLoaded = true
				resolve(script)
			})

			script.addEventListener("error", () => {
				reject(new Error("${this.src} failed to load."))
			})
		})
	}

	retrieve(authToken, callback) {
		this.do_retrieve(authToken).then(callback)
	}

	do_retrieve(authToken) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.api_endpoint + "/retrieve",
				type: "POST",
				cache: false,
				contentType: "application/json; charset=utf-8",
				headers: {
					"x-api-key": this.api_key
				},
				dataType: "json",
				data: JSON.stringify({
					auth_token: authToken
				}),
				success: function (data, textStatus, jqXHR) {
					resolve(JSON.parse(atob(data.data)))
				},
				error: function (jqXHR, textStatus, errorThrown) {
					reject(errorThrown)
				}
			})
		})
	}
	
	store(authToken, cardHolderName, cardNumber, cardExpiry, callback) {
		this.do_store(authToken, cardHolderName, cardNumber, cardExpiry).then(callback)
	}

	do_store(authToken, cardHolderName, cardNumber, cardExpiry) {
		//TODO strip all whitespace and clean up inputs
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.api_endpoint + "/store",
				type: "POST",
				cache: false,
				contentType: "application/json; charset=utf-8",
				headers: {
					"x-api-key": this.api_key
				},
				dataType: "json",
				data: JSON.stringify({
					auth_token: authToken,
					data_type: "creditcard",
					data: btoa(JSON.stringify({
						cc_holder_name: cardHolderName,
						cc_number: cardNumber,
						cc_expiry: cardExpiry
					}))
				}),
				success: function (data, textStatus, jqXHR) {
					resolve(data)
				},
				error: function (jqXHR, textStatus, errorThrown) {
					reject(errorThrown)
				}
			})
		})
	}

	getCardType(e){
		var n=new RegExp("^4");return null!=e.match(n)?"Visa":/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(e)?"Mastercard":(n=new RegExp("^3[47]"),null!=e.match(n)?"American Express":(n=new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)"),null!=e.match(n)?"Discover":(n=new RegExp("^36"),null!=e.match(n)?"Diners":(n=new RegExp("^30[0-5]"),null!=e.match(n)?"Diners - Carte Blanche":(n=new RegExp("^35(2[89]|[3-8][0-9])"),null!=e.match(n)?"JCB":(n=new RegExp("^(4026|417500|4508|4844|491(3|7))"),null!=e.match(n)?"Visa Electron":"Unknown"))))))
	}

	validateCardDetails(cardHolderName, cardNumber, cardExpiryMonth, cardExpiryYear) {
		return validateCardDetails(cardHolderName, cardNumber, cardExpiryMonth + "/" + cardExpiryYear)
	}

	validateCardDetails(cardHolderName, cardNumber, cardExpiry) {
		var result = {
			status: "valid",
			validCardNumber: true,
			validCardHolderName: true,
			validCardExpiry: true
		}
		if(!this.validateCardHolderName(cardHolderName)) {
			result.status="invalid"
			result.validCardHolderName=false
		}
		if(!this.validateCardNumber(cardNumber)){
			result.status="invalid"
			result.validCardNumber=false
		}
		if(!this.validateExpiry(cardExpiry)){
			result.status="invalid"
			result.validCardExpiry=false
		}
		return result
	}

	validateCardHolderName(cardHolderName) {
		return cardHolderName.length > 0
	}

	validateCVC(cardCVC){
		return cardCVC = this.trim(cardCVC), /^\d+$/.test(cardCVC) && cardCVC.length >= 3 && cardCVC.length <= 4
	}

	validateCardNumber(cardNumber) {
		return cardNumber = (cardNumber + "").replace(/\s+|-/g, ""), cardNumber.length >= 10 && cardNumber.length <= 16 && this.luhnCheck(cardNumber)
	}

	validateExpiry(t){
		var e,n,i,r,s=t.split("/"),h=s[0],l=s[1];if(null!=l)i=this.trim(h),l=this.trim(l);else{try{i=(r=a.utils.parseExpString(h))[0],l=r[1]}catch(h){return!1}i+="",l+=""}return!!/^\d+$/.test(i)&&!!/^\d+$/.test(l)&&1<=i&&i<=12&&(2===l.length&&(l=l<70?"20"+l:"19"+l),4===l.length&&(n=new Date(l,i),e=new Date,n.setMonth(n.getMonth()-1),n.setMonth(n.getMonth()+1,1),e<n))
	}

	trim(x){
		return null===x?"":(x+"")
	}

	luhnCheck(e){
		var r,n,t,h,l,s;for(t=!0,l=h=0,s=(n=(e+"").split("").reverse()).length;l<s;l++)r=n[l],r=parseInt(r,10),(t=!t)&&(r*=2),9<r&&(r-=9),h+=r;return h%10==0
	}
}



