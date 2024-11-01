import { createContext, useContext, useState } from "react";
import './App.css'

const AppContext = createContext(null);

const StockContext = ({ children }) => {
  const [stocklist, setStocklist] = useState([]);

  const updStocklist = (stockName) => {
    setStocklist((prevStocklist) => [...prevStocklist, stockName]);
  };

  return (
    <AppContext.Provider value={{ stocklist, updStocklist }}>
      {children}
    </AppContext.Provider>
  );
};


const StocklistDetails = () => {
  const { stocklist } = useContext(AppContext);
  let list=[];
  let i=0;
  let profitloss=0;
  
  for (i=0; i<StockDataArray.length;i++)
    {
     list.push(<li class={"li_first"}>Symbol: {StockDataArray[i][0]}</li>)
     list.push(<li>Quantity: {StockDataArray[i][1]}</li>)
     list.push(<li>Purchase Price: {StockDataArray[i][2]}</li>)
    list.push(<li>Current Price: {StockDataArray[i][3]}</li>) 
    profitloss=(Number(StockDataArray[i][3])-Number(StockDataArray[i][2]))*Number(StockDataArray[i][1])
    
    if (profitloss>0)
    {
      list.push(<li class={"li_green"}>Profit/Loss: +{profitloss.toFixed(2)}</li>) 
      }
    else if (profitloss<0)
    {
      list.push(<li class={"li_red"}><strong>Profit/Loss: {profitloss.toFixed(2)}</strong></li>) 
    }
    else
    {
      list.push(<li><strong>Profit/Loss: {profitloss.toFixed(2)}</strong></li>)
    }
    list.push(<li> </li>)

    }

  if (stocklist.length === 0) {
    return null;
  }

  return (
    <>
    <div id="stocklist" >
     <h2>Stock List</h2>
     
    
       <ul> {list} </ul>
   
    </div>

    </>
  );
};

const StockDataArray = [];
const AddSongForm = ({ firstlabel, secondlabel, thirdlabel }) => {
  const { updStocklist } = useContext(AppContext);
  const [stkcode, setstkcode] = useState(null);
    const [qty, setqty] = useState(null);
    const [price, setprice] = useState(null);

    const handleOnChange = event => {
      const result = event.target.value.replace(/\D/g, '');
 
    }; 

    const handleOnChangePrice = event => {
      const result = event.target.value.replace(/\D/g, '');
      setprice(result);
    }; 

    const handleOnChangeStock = event => {
      const result = event.target.value;
      setstkcode(result);
    };  

  return (
    <form class="my-form"
      onSubmit={(e) => {
               fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo'
             /*    https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stkcode}&apikey=GFPMXJD7GKNLYSHN */
       // https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo'
       )
      .then(response => {
          return response.json()
      })
      .then(stockdata => { 
        if(stockdata['Global Quote']['05. price']!==undefined)
        {
        StockDataArray.push([stkcode,qty,price,stockdata['Global Quote']['05. price']])
        updStocklist(StockDataArray) 
        }
        else
        {
          StockDataArray.push(['Symbol is not valid','0','0','0'])
        updStocklist(StockDataArray) 
          }
      })
        .catch(error => {
          
            console.log('error: ', error)
        }) 
        
             e.preventDefault();
    
       }}
    >
       <label><h1>Finance Dashboard</h1></label>
      <input type="text" placeholder={firstlabel} onChange={(x) => setstkcode(x.target.value)} /> 
      <input type="number" placeholder={secondlabel} onChange={(y) => setqty(y.target.value)}  />
      <input type="number" step="0.01" placeholder={thirdlabel} onChange={(z) => setprice(z.target.value)} />

      {/*   <input type="text" onChange={(e) => setSongName(e.target.value)} /> */}
     {/*  <input type="text" placeholder={firstlabel} onChange={(x) => setstkcode(x.target.value)}/> 
      <input type="text" placeholder={secondlabel} onChange={(y) => setqty(y.target.value)}/> 
      <input type="text" placeholder={thirdlabel} onChange={(z) => setprice(z.target.value)}/>  */}
     {/*  <input type="text" onChange={(e) => setSongName(StockDataArray)} /> */}
    
      <button type="submit">Add Stock</button>
    </form>
  );
};

export default function App() {
  return (
    <StockContext>
         <AddSongForm firstlabel='Stock Symbol' secondlabel='Quantity' thirdlabel='Purchase Price'/>

      <StocklistDetails />
      
    </StockContext>
  );
}