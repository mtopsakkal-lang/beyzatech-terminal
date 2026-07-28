export function calculateRisk(
current,
longAvg,
shortAvg,
ratio
){


const isLong =
current >
(
longAvg+
shortAvg
)/2;



const entry =
isLong
?
current*0.998
:
current*1.002;



const stop =
isLong
?
entry*0.982
:
entry*1.018;



let score=50;


if(ratio>60)
score+=20;


if(ratio<40)
score-=20;



if(score>100)
score=100;


if(score<0)
score=0;



let leverage=5;


if(score>80)
leverage=20;

else if(score>65)
leverage=10;



return {

signal:
isLong?"LONG":"SHORT",

entry,

stop,

tp1:
isLong?
entry*1.03:
entry*0.97,


tp2:
isLong?
entry*1.045:
entry*0.955,


score,


leverage

};


}
