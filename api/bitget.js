export async function getBitgetDepth(symbol){


const url =
`https://api.bitget.com/api/v2/mix/market/merge-depth?symbol=${symbol}USDT&productType=USDT-FUTURES&limit=100`;



const response =
await fetch(url);


const data =
await response.json();



return {

bids:data.data?.bids || [],
asks:data.data?.asks || []

};


}
