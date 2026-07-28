import React,{
useEffect,
useState
} from "react";


import {

View,
Text,
ScrollView,
TouchableOpacity,
StyleSheet

} from "react-native";


import {
getBinanceDepth
} from "./api/binance";


import {
getBitgetDepth
} from "./api/bitget";


import {
calculateRisk
} from "./engine/riskEngine";


import SignalCard from "./components/SignalCard";
import AIScore from "./components/AIScore";
import LiquidityWall from "./components/LiquidityWall";



export default function App(){


const [coin,setCoin]=useState("BTC");

const [exchange,setExchange]=useState("BINANCE");


const [result,setResult]=useState({

signal:"NÖTR",

score:50

});


const [walls,setWalls]=useState([]);



async function scan(){


let book;


if(exchange==="BINANCE")

book=
await getBinanceDepth(coin);


else

book=
await getBitgetDepth(coin);



let bidVol=0;
let askVol=0;

let bidValue=0;
let askValue=0;



book.bids.forEach(x=>{

let p=Number(x[0]);
let a=Number(x[1]);

bidVol+=a;
bidValue+=p*a;

});



book.asks.forEach(x=>{

let p=Number(x[0]);
let a=Number(x[1]);

askVol+=a;
askValue+=p*a;

});



let price=

(
Number(book.bids[0][0])
+
Number(book.asks[0][0])

)/2;



let longAvg=
bidValue/bidVol;


let shortAvg=
askValue/askVol;


let ratio=

Math.round(

bidVol/
(bidVol+askVol)
*100

);



let risk=

calculateRisk(

price,
longAvg,
shortAvg,
ratio

);



setResult(risk);



setWalls(

[...book.bids,...book.asks]

.sort(
(a,b)=>
Number(b[1])-Number(a[1])
)

.slice(0,10)

.map(x=>({

price:x[0],
amount:x[1]

}))

);


}



useEffect(()=>{


scan();


const timer=
setInterval(
scan,
5000
);


return()=>clearInterval(timer);


},[coin,exchange]);



return(

<ScrollView style={styles.page}>


<Text style={styles.title}>

⚡ BEYZATECH TERMINAL v11

</Text>


<Text style={styles.sub}>

AI Futures Trading Engine

</Text>



<View style={styles.row}>


<TouchableOpacity
onPress={()=>setExchange("BINANCE")}
style={styles.button}
>

<Text>BINANCE</Text>

</TouchableOpacity>



<TouchableOpacity
onPress={()=>setExchange("BITGET")}
style={styles.button}
>

<Text>BITGET</Text>

</TouchableOpacity>


</View>



<Text style={styles.coin}>

{coin}/USDT {exchange}

</Text>



<AIScore score={result.score}/>


<SignalCard signal={result.signal}/>


<LiquidityWall data={walls}/>



<View style={styles.card}>


<Text>

Giriş:
{result.entry}

</Text>


<Text>

SL:
{result.stop}

</Text>


<Text>

TP1:
{result.tp1}

</Text>


<Text>

TP2:
{result.tp2}

</Text>


<Text>

Kaldıraç:
{result.leverage}x

</Text>


</View>


</ScrollView>

);


}



const styles=StyleSheet.create({

page:{
backgroundColor:"#090D16",
padding:20
},

title:{
color:"#fff",
fontSize:24,
fontWeight:"bold",
marginTop:40
},

sub:{
color:"#38BDF8"
},

coin:{
color:"#fff",
fontSize:20,
marginTop:20
},

row:{
flexDirection:"row",
gap:10,
marginTop:20
},

button:{
backgroundColor:"#2563EB",
padding:15,
borderRadius:8
},

card:{
backgroundColor:"#111827",
padding:15,
marginTop:15
}

});
