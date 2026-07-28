import React from "react";
import {
View,
Text
} from "react-native";


export default function SignalCard({signal}){


return(

<View style={{

backgroundColor:
signal==="LONG"
?"#10B981"
:"#EF4444",

padding:20,

borderRadius:10,

marginTop:15

}}>


<Text style={{

color:"#fff",
fontSize:22,
fontWeight:"bold",
textAlign:"center"

}}>

{signal}

</Text>


</View>

);

}
