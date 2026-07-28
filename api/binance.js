export async function getBinanceDepth(symbol){

const url =
`https://fapi.binance.com/fapi/v1/depth?symbol=${symbol}USDT&limit=100`;


const response =
await fetch(url);


const data =
await response.json();


return {

bids:data.bids || [],
asks:data.asks || []

};

}
