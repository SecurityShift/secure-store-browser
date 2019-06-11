# secure-store-browser
Secure Store client browser library

HOW TO USE:

1. Add the javascript file as a script to the HTML page

2. Construct an instance of the class as follows:

	const ccStore = new SecShiftSecureStoreCC(API_KEY,API_URL)

3. Use the class to get the type of a credit card:

	ccStore.getCardType(CREDIT_CARD_NUMBER)

4. Use the class to validate credit card details:

	ccStore.validateCardDetails(CARD_HOLDER_NAME,CREDIT_CARD_NUMBER,CREDIT_CARD_EXPIRY)

NOTE: CREDIT_CARD_EXPIRY format is MM/YY

5. Use the class to store a credit card:

	ccStore.store(STORE_AUTH_TOKEN,CARD_HOLDER_NAME,CREDIT_CARD_NUMBER,CREDIT_CARD_EXPIRY,RESPONSE_CALLBACK)

	RESPONSE_CALLBACK should take one parameter which is the response object from the storage api, this should be sent back to the server for verification and storage

6. Use the class to retrieve a credit card:

	ccStore.retrieve(RETRIEVE_AUTH_TOKEN,RESPONSE_CALLBACK)

	RESPONSE_CALLBACK should take one parameter which is the details stored in the storage system

