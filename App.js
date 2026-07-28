import React, {useEffect, useState} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";


export default function App(){

  const [coin,setCoin] = useState("BTC");
  const [exchange,setExchange] = useState("BITGET");

  const [ratio,setRatio] = useState("50 / 50");
  const [signal,setSignal] = useState("NÖTR / BEKLE");

  const [longAvg,setLongAvg] = useState("0.0000");
  const [shortAvg,setShortAvg] = useState("0.0000");

  const [entry,setEntry] = useState("0.0000");
  const [stop,setStop] = useState("0.0000");
  const [tp1,setTp1] = useState("0.0000");
  const [tp2,setTp2] = useState("0.0000");

  const [leverage,setLeverage] = useState("10x");


  async function fetchAnalysis(){

    try{

      const symbol =
        coin.toUpperCase()+"USDT";


      const url =
      `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=100`;


      const response =
      await fetch(url);


      const data =
      await response.json();



      let bidVol=0;
      let askVol=0;

      let bidValue=0;
      let askValue=0;



      data.bids.forEach(item=>{

        let price =
        Number(item[0]);

        let amount =
        Number(item[1]);

        bidVol += amount;
        bidValue += price*amount;

      });



      data.asks.forEach(item=>{

        let price =
        Number(item[0]);

        let amount =
        Number(item[1]);

        askVol += amount;
        askValue += price*amount;

      });



      const current =
      (
        Number(data.bids[0][0])+
        Number(data.asks[0][0])
      )/2;



      const longAverage =
      bidValue/bidVol;


      const shortAverage =
      askValue/askVol;



      const longPercent =
      Math.round(
       (bidVol/(bidVol+askVol))*100
      );



      const isLong =
      current >
      ((longAverage+shortAverage)/2);



      setSignal(
        isLong ? "LONG" : "SHORT"
      );


      setRatio(
       `${longPercent} / ${100-longPercent}`
      );


      setLongAvg(
       longAverage.toFixed(4)
      );


      setShortAvg(
       shortAverage.toFixed(4)
      );


      let giris =
      isLong
      ? current*0.998
      : current*1.002;



      let sl =
      isLong
      ? giris*0.982
      : giris*1.018;



      setEntry(
        giris.toFixed(4)
      );


      setStop(
        sl.toFixed(4)
      );


      setTp1(
       (
        isLong
        ? giris*1.03
        : giris*0.97
       ).toFixed(4)
      );


      setTp2(
       (
        isLong
        ? giris*1.045
        : giris*0.955
       ).toFixed(4)
      );



      setLeverage("15x");


    }
    catch(error){

      console.log(error);

    }

  }



  useEffect(()=>{

    fetchAnalysis();


    const timer =
    setInterval(
      fetchAnalysis,
      5000
    );


    return ()=>clearInterval(timer);


  },[coin]);




return (

<ScrollView style={styles.page}>


<Text style={styles.title}>
⚡ BEYZATECH TERMINAL v10.0
</Text>


<Text style={styles.sub}>
Maliyet Analizi & Kripto Formasyon Sinyal Motoru
</Text>



<Text style={styles.coin}>
{coin}/USDT ({exchange})
</Text>



<View style={styles.card}>
<Text>
LONG / SHORT ORANI
</Text>

<Text style={styles.value}>
{ratio}
</Text>
</View>



<View
style={[
styles.signal,
{
backgroundColor:
signal==="LONG"
?"#10B981"
:"#EF4444"
}
]}
>

<Text style={styles.signalText}>
{signal}
</Text>

</View>



<View style={styles.card}>
<Text>
LONG Ortalama:
${longAvg}
</Text>

<Text>
SHORT Ortalama:
${shortAvg}
</Text>

</View>



<View style={styles.card}>

<Text>
Risk Motoru:
{leverage}
</Text>


<Text>
Giriş:
${entry}
</Text>


<Text>
SL:
${stop}
</Text>


<Text>
TP1:
${tp1}
</Text>


<Text>
TP2:
${tp2}
</Text>

</View>



<TextInput

style={styles.input}

value={coin}

onChangeText={setCoin}

/>



<TouchableOpacity
style={styles.button}
onPress={fetchAnalysis}
>

<Text>
TARA
</Text>

</TouchableOpacity>


</ScrollView>

);

}



const styles =
StyleSheet.create({

page:{
backgroundColor:"#090D16",
padding:20
},

title:{
color:"#fff",
fontSize:22,
fontWeight:"bold",
marginTop:40
},

sub:{
color:"#38BDF8",
marginBottom:20
},

coin:{
color:"#fff",
fontSize:20
},

card:{
backgroundColor:"#111827",
padding:15,
marginTop:10,
borderRadius:8
},

value:{
color:"#38BDF8",
fontSize:18
},

signal:{
padding:15,
marginTop:15,
borderRadius:8
},

signalText:{
color:"#fff",
textAlign:"center",
fontSize:20,
fontWeight:"bold"
},

input:{
backgroundColor:"#1E293B",
color:"#fff",
marginTop:20,
padding:12
},

button:{
backgroundColor:"#2563EB",
padding:15,
marginTop:10,
alignItems:"center"
}

});
