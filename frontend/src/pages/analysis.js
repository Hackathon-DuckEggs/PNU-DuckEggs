import React, { useState, useEffect } from 'react';
import { Waiting } from "../components/waiting";

// http://duckegg.kro.kr/api/product/${pCode}
const Analysis = (props) => {
  const pCode = props.location.state['pCode'];
  const url = `http://duckegg.kro.kr/api/product/${pCode}`;

  const [data, setData] = useState(null);
  const [show, setShow] = useState(false);

  const fetchData = async () => {
    try {
    console.log(`show: ${show}`);
    if(!show){
      const result = await fetch(url);
      const data = await result.json();
      setData(data);
      if(data['analyzed'] == 1) setShow(true);
    }
    } catch(err) {
      setShow(false);
    } 
  }

  useEffect(() => {
    let id = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(id);
  }, [])

  console.log(data);
  
  return show ? (
    <div>show is true, display review data</div>
  ) : (
    <Waiting />
  );
}

export default Analysis;