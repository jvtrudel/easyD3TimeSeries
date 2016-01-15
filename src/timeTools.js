// these functions are designed to work with timestamps, but are also valid for integers and floats.

function commonRange(serieA,serieB){
   //Find the common
   na=serieA.length-1;
   nb=serieB.length-1;
   if (serieA[0]<serieB[0]) {
      var bi=0;
      var i=1;
      for (var i=1;i<na+1; i++){
         if (serieA[i]>serieB[0]){
            ai=i-1;
            i=na+1;
         }
      }
   } else if (serieB[0]<serieA[0]){
      ai=0;
      var i=1;
      for (var i=1;i<nb+1; i++){
         if (serieB[i]>serieA[0]){
            bi=i-1;
            i=nb+1;
         }
      }
   } else if (serieA[0]==serieB[0]){
      ai=0;
      bi=0;
   }else {
      console.log("erreur...");
   }
  la=serieA[serieA.length-1];
  lb=serieB[serieB.length-1];
   if (la<lb) {
      af=na;
      for (var i=nb;i>=0; i--){
         if (serieB[i]>serieA[na]){
            bf=i;
            i=-1;
         }
      }
   } else if (lb<la){
      bf=nb;
      for (var i=na;i>=0; i--){
         if (serieA[i]>serieB[nb]){
            af=i;
            i=-1;
         }
      }
   } else if (la==lb){
      af=na;
      bf=nb;
   }else {
      console.log("erreur...");
   }
   return [ai,af,bi,bf]
}



function tsCaracterize(serie,rang){
   di=rang[0];
   df=rang[1];
   min=serie[di];
   max=serie[df];
   nt=df-di;
   L=max-min;
   dt=L/(nt-1);
   Dt=[];
   for (var i=0;i<nt;i++){
      Dt.push(Math.abs(serie[di+i+1]-serie[di+i]));
   }

   meanDt=0;
   Dt.forEach(function(elem){meanDt+=elem;});
   meanDt=Math.abs(meanDt/nt);

   standardDev=0;
   Dt.forEach(function(elem){standardDev+=Math.pow(elem-meanDt,2)});
   standardDev=Math.sqrt(standardDev/nt);

   return {"dt":dt,"min":min,"max":max,"nt":nt,"meanDt":meanDt,"stdDev":standardDev,"extend":L,"resolution":7*meanDt}

}

function commonGrid(paramA,paramB){
   min=Math.max(paramA.min,paramB.min);
   max=Math.min(paramA.max,paramB.max);
   nt=Math.max(paramA.nt,paramB.nt);
   L=max-min;
   dt=L/(nt-1);
   return {"dt":dt,"min":min,"max":max,"nt":nt,"L":L};
}



// Conversions

function tStamps2Months(ts){
      return Int(ts/31536000000);
}

function tStamps2Months(ts){
      return Int(ts/2635200000);
}

function tStamps2Weeks(ts){
      return Int(ts/604800000);
}

function tStamps2Days(ts){
   return Int(ts/86400000);
}



function compare2timeSeries(tA,vA,tB,vB,callBack){
   // assume que les échantillonages sont presques identiques.
   cr=commonRange(tA,tB);
   ga=tsCaracterize(tA,cr.slice(0,2));
   gb=tsCaracterize(tB,cr.slice(2,4));
   g=commonGrid(ga,gb);
  tG=[];
  for (var i=0;i<g.nt;i++){
   //  alert(g.min+" "+i+" "+g.dt);
     tG.push(g.min+i*g.dt);
 }

 nmax=2;
 b1=0;
b2=nmax+1;
vGA=[];
vGB=[];

while(b2<tA.length){
   nx=tG.slice(b1,b2);// attention: mauvais si les 2 échantillonnages sont très différents.
//   alert("nx "+nx);
   x=tA.slice(b1,b2);
//   alert("x "+x);
   y=vA.slice(b1,b2);
//   alert("y "+y);
   vGA=vGA.concat(everpolate.polynomial(nx,x,y));
//   alert(vGA);
   x=tB.slice(b1,b2);
   y=vB.slice(b1,b2);
   vGB=vGB.concat(everpolate.polynomial(nx,x,y));
   b1=b2;
   b2+=nmax;
}
b1=b2-=nmax;
b2=tA.length;
nx=tG.slice(b1,b2);// attention: mauvais si les 2 échantillonnages sont très différents.
x=tA.slice(b1,b2);
y=vA.slice(b1,b2);
vGA=vGA.concat(everpolate.polynomial(nx,x,y));
x=tB.slice(b1,b2);
y=vB.slice(b1,b2);
vGB=vGB.concat(everpolate.polynomial(nx,x,y));


return [tG,callBack(vGA,vGB)];
}

function sumSeries(d1,d2){
   var d=[];
   for(var i=0;i<d1.length;i++){
      d.push(d1[i]+d2[i])}
       return d;}

       function diffSeries(d1,d2){
          var d=[];
          for(var i=0;i<d1.length;i++){
             d.push(d1[i]-d2[i])}
              return d;}
