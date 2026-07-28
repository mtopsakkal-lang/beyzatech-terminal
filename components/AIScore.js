import React from "react";
import {
View,
Text
} from "react-native";


export default function AIScore({score}){


return(

<View style={{

backgroundColor:"#111827",
padding:15,
borderRadius:8

}}>


<Text style={{
color:"#38BDF8"
}}>

AI MARKET SKORU

</Text>


<Text style={{

color:"#fff",
fontSize:30,
fontWeight:"bold"

}}>

{score}/100

</Text>


</View>

);


}
