const BINANCE =
"https://fapi.binance.com";

const BITGET =
"https://api.bitget.com";



export async function getBinanceOrderBook(symbol){

    const url =
    `${BINANCE}/fapi/v1/depth?symbol=${symbol}USDT&limit=100`;


    const res =
    await fetch(url);


    return await res.json();

}



export async function getBinanceFunding(symbol){

    const url =
    `${BINANCE}/fapi/v1/premiumIndex?symbol=${symbol}USDT`;


    const res =
    await fetch(url);


    return await res.json();

}



export async function getBinanceOI(symbol){

    const url =
    `${BINANCE}/fapi/v1/openInterest?symbol=${symbol}USDT`;


    const res =
    await fetch(url);


    return await res.json();

}





export async function getBitgetOrderBook(symbol){


    const url =
`${BITGET}/api/v2/mix/market/merge-depth?symbol=${symbol}USDT&productType=USDT-FUTURES&limit=100`;


    const res =
    await fetch(url);


    return await res.json();

}
