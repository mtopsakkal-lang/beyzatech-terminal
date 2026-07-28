import React from "react";
import {
View,
Text
} from "react-native";


export default function LiquidityWall({data}){


return(

<View style={{

backgroundColor:"#111827",
padding:15,
marginTop:10

}}>


<Text style={{color:"#38BDF8"}}>

LIKIDITE DUVARI

</Text>


{

data.map((x,i)=>(

<Text
key={i}
style={{color:"#fff"}}
>

{x.price}
$
-
{x.amount}

</Text>

))

}


</View>

);

}
