/*
Aaron Silvers
Nathan Truong

CSC 337, Spring 2019
Final Project


*/


(function() {
	"use strict";
	
window.onload = function() {
	document.getElementById("getTicker").onclick = daChart;
	
	getPastSearches();
};

/**sends the values the user input into the page as post parameters
 to a service and logs the response. */
function saveChart() {
	let ticker = document.getElementById("tickerInput").value.toUpperCase();
	
	console.log(ticker);
	const Smessage = {ticker: ticker 
                };
	const fetchOptions = {
		method : 'POST',
		headers : {
			'Accept': 'application/json',
		
	'Content-Type' : 'application/json'
		},
		body : JSON.stringify(Smessage)
	};

	console.log(Smessage);

	let url = "http://stockcheckercsc337-5.herokuapp.com";
	fetch(url, fetchOptions)
		.then(checkStatus)
		.then(function(responseText) {
			console.log(responseText);
			document.getElementById("confirmation").innerHTML = "";
			document.getElementById("confirmation").innerHTML = responseText;
		})
		.catch(function(error) {
			console.log(error);
			document.getElementById("confirmation").innerHTML = "";
			document.getElementById("confirmation").innerHTML = error;
		});

}
/**fetches the messages from the server */
function daChart(){
	let stock = document.getElementById("tickerInput").value;
	let nUrl = "https://api.iextrading.com/1.0/stock/" + stock + "/chart/1y";
	let Sclose = [];
	let sDate = [];
	
		fetch(nUrl)
			.then(checkStatus)
			.then(function(response){
				//console.log(JSON.parse(response));
				let Sdata = JSON.parse(response);
				for (let i = 0; i< Sdata.length; ++i){
					
				Sclose.push(Sdata[i].close);
				}
				sDate.push(Sdata[0].date);
				sDate.push(Sdata[Sdata.length-1].date);
				//console.log(Sclose,Sclose.length);
				createChart(Sclose, sDate);
			})
			.catch(function(error) {
				console.log(error);
				document.getElementById("confirmation").innerHTML = "";
				document.getElementById("confirmation").innerHTML = error;
			});
			
			daNews(stock);
			saveChart(stock);
			setTimeout(getPastSearches,100);
			
	
}

/** uses stock*/
function daNews(stock){ /* uses stock */
	let nUrl = "https://api.iextrading.com/1.0/stock/" + stock  + "/news";
	let sNewsH;
	let sNewsS;
	let sUrl;
	
	fetch(nUrl)
			.then(checkStatus)
			.then(function(response){
				console.log(JSON.parse(response), "hello");
				let sData = JSON.parse(response);
				document.getElementById("news").innerHTML = "";
				let sClear = document.createElement("h3");
				let node = document.createTextNode("News");
				sClear.appendChild(node);
				document.getElementById("news").appendChild(sClear);
				
				for (let i = 0; i< sData.length; ++i){
					sNewsH = sData[i].headline;
					sNewsS = sData[i].summary;
					sUrl = sData[i].url;
					
					let cDiv = document.createElement("div");
					let cHead = document.createElement("h4");
					let cSum = document.createElement("p");
					let cUrl = document.createElement("p");
					
					node = document.createTextNode(sNewsH);
					cHead.appendChild(node);
					
					node = document.createTextNode(sNewsS);
					cSum.appendChild(node);
					
					node = document.createTextNode(sUrl);
					cUrl.appendChild(node);
					
					cDiv.appendChild(cHead);
					cDiv.appendChild(cSum);
					cDiv.appendChild(cUrl);
					
					console.log(cHead);
					
					document.getElementById("news").appendChild(cDiv);
				}
				
			})
			.catch(function(error) {
				console.log(error);
				document.getElementById("confirmation").innerHTML = "";
				document.getElementById("confirmation").innerHTML = error;
			});
	
}

/**fetches the messages from the server */
function getPastSearches(){
	let url = "http://stockcheckercsc337-5.herokuapp.com";
	
	fetch(url)
			.then(checkStatus)
			.then(function(response){
				console.log(JSON.parse(response));
				let sData = JSON.parse(response);
				document.getElementById("pastSearches").innerHTML = "";
				for(let i = 0; i <sData.tickers.length; i++){
					if(sData.tickers[i] != ""){
					let cButton = document.createElement("button");
					let node = document.createTextNode(sData.tickers[i]);
					cButton.onmousedown = startSearch;
					//cButton.value = sData.tickers[i];
					cButton.appendChild(node);
					document.getElementById("pastSearches").appendChild(cButton);
					}
				}
				
			})
			.catch(function(error) {
				console.log(error);
				document.getElementById("confirmation").innerHTML = "";
				document.getElementById("confirmation").innerHTML = error;
			});
}


/**fetches the messages from the server */
function startSearch(){
	let stock = this.innerHTML;
	document.getElementById("tickerInput").value = stock;
	daChart();
	
}


/**fetches the messages from the server */
function createChart(daData, daDate){ /* */
	
	let nData = [];
	let stockMathMax = Math.max.apply(null, daData);
	let stockMathMin = Math.min.apply(null, daData);
	let sCanvas = document.getElementById("canvas");
	let cHeight = sCanvas.height;
	let cWidth = sCanvas.width;
	let context = sCanvas.getContext("2d");
	let nDataX = [];
	
	context.clearRect(0, 0, sCanvas.width, sCanvas.height);
	
	//sCanvas.width = daData.length;
	for (let i = 0; i < daData.length; i++){ 
	nData.push(cHeight - (daData[i]/stockMathMax)*cHeight + (cHeight/4));
	nDataX.push(cWidth/daData.length * i);
	}
	
	//console.log(nData);
	
	context.beginPath();
	for(let i = 0; i< nData.length; i++){
	context.lineTo(nDataX[i] , nData[i]);	
	context.stroke();
	}	
	
	context.font = "20px Helvetica";
	context.fillText("Stock: " + document.getElementById("tickerInput").value.toUpperCase(), 5, 25);
	context.fillText("High: " + stockMathMax + "    " + "Low: " + stockMathMin, 5, 45);
	context.fillText("Date: " + daDate[0] + " to " + daDate[1] , 5, 65);
}


//returns the response text if the status is in the 200s
/**otherwise rejects the promise with a message including the status 
 @param response is the response*/
function checkStatus(response) {  
    if (response.status >= 200 && response.status < 300) {  
        return response.text();
    } else if (response.status == 404) {
		//sends back a different error when we have a 404 than when we have
		//a different error
		return Promise.reject(new Error("Sorry, we couldn't find that page")); 
    } else {  
        return Promise.reject(new Error(response.status+": "+response.statusText)); 
    } 
}
})();
