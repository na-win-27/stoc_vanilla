
let selectedStock='AAPL';
let year='5y'
let chartData;
let stockData;
let stockSummary;
document.addEventListener('DOMContentLoaded', function () {

  
  fetch('https://stocks3.onrender.com/api/stocks/getstocksdata')
  .then(response => response.json())
  .then(data =>{ 
    chartData=data.stocksData;
    console.log(chartData[0]['AAPL'])
    
    return fetch('https://stocks3.onrender.com/api/stocks/getstocksprofiledata');
  })
  .catch(error => console.error('Error:', error))
  .then(response => response.json())
  .then(data =>{ 
    stockSummary=data.stocksProfileData;
    console.log(stockSummary);
    return fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata');
  })
  .catch(error => console.error('Error:', error))
  .then(response => response.json())
  .then(data =>{ 
    stockData=data.stocksStatsData;
    console.log(stockData)
    loadFooter(stockData[0])
    addOnclick(stockData[0])
    refreshChart();
    // console.log(stockSummary)
  
  })
  .catch(error => console.error('Error:', error));






  // fetch('https://stocks3.onrender.com/api/stocks/getstocksprofiledata')
  // .then(response => response.json())
  // .then(data =>{ 
  //   stockSummary=data.stocksProfileData;
  //   console.log(stockSummary)


  
  // })
  // .catch(error => console.error('Error:', error));

  // fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata')
  // .then(response => response.json())
  // .then(data =>{ 
  //   stockData=data.stocksStatsData;
  //   console.log(stockData)
  //   loadFooter(stockData[0])
  //   addOnclick(stockData[0])
  //   // console.log(stockSummary)
  
  // })
  // .catch(error => console.error('Error:', error));

  
  


})


function loadChart(data){
  const fil=selectedStock?selectedStock:"AAPL"
  const w = document.getElementById('features');
  const wrapper=document.createElement("div");
  const d=document.createElement("div");
  d.classList.add("chart")
  w.innerHTML='';
  const ctx=document.createElement("canvas");


  // ctx.innerHTML='';

  // document.getElementById("myChart").remove();
let summary=stockSummary?stockSummary[0][fil].summary:""
let profit=stockData[0]?stockData[0][fil].profit:""
let value=stockData[0]?stockData[0][fil].bookValue:""
console.log(summary)
wrapper.classList.add("features")

  data=data[fil][year]

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.timeStamp.map((d)=>new Date(d*1000).toLocaleDateString()),
      datasets: [{
        label: 'Stock Price',
        data: data.value,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const btn5=document.createElement("button");
  btn5.textContent="5y";

  btn5.addEventListener("click",function(){
    year='5y';
    refreshChart();
  })

  const btn1=document.createElement("button");
  btn1.textContent="1y";
  btn1.addEventListener("click",function(){
    year='1y';
    refreshChart();
  })

  const btn3=document.createElement("button");
  btn3.textContent="1m";
  btn3.addEventListener("click",function(){
    year='1mo';
    refreshChart();
  })


  if(year==='5y'){
    btn5.classList.add("selected")
  }
  else if(year==='1y'){
    btn1.classList.add("selected")
  }
  else if(year==='1mo'){
    btn3.classList.add("selected")
  }

  


  const sum=document.createElement("div");
  sum.classList.add("summary")

  sum.innerHTML=`

  <h3>${fil}</h3>
  <h5>Profit <span class=${profit>0?"positive":"negative"}>${profit}</span></h5>
  <h5>Value: $${value}</h5>
  <p>${summary.split(" ").splice(0,100).join(" ")}
  </p>

  `

  d.appendChild(ctx);
  d.append(btn5,btn1,btn3)
  // w.appendChild(d)
  // w.appendChild(sum)

  wrapper.appendChild(d);
  wrapper.appendChild(sum);
  w.appendChild(wrapper)
}


function loadFooter(data){
  const list=document.getElementById("stocksFooter");
  list.innerHTML=''
  Object.keys(data).forEach((k,i)=>{
    const p=data[k].profit>0;
    if(i<10){
      const n=document.createElement("li");
      n.innerHTML=`<button id=${"btn-"+k} class="name" >${k}</button>
      <p>$${data[k].bookValue}</p>
      <p class=${p?"positive":"negative"}>${data[k].profit}</p>`;

      list.appendChild(n);

    }
  })
}

function addOnclick(data){
  Object.keys(data).forEach((k,i)=>{
    const btn=document.getElementById(`${"btn-"+k}`);
    btn.addEventListener("click", function(){
     selectedStock=k;
     console.log(selectedStock)
     loadChart(chartData[0])
  })
  })
}

function refreshChart(){
  loadChart(chartData[0]);
}