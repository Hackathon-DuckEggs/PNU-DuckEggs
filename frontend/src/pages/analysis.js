import React, { useState, useEffect } from "react";
import { Waiting } from "../components/waiting";
import { ProductDetail } from "../components/productDetail";
import { ReviewScore } from "../components/reviewScore";

const Analysis = (props) => {
  const pCode = props.location.state["pCode"];
  // console.log(props.location);

  const url = `http://duckegg.kro.kr/api/product/${pCode}`;
  const [data, setData] = useState(null);
  const [show, setShow] = useState(false);

  const fetchData = async () => {
    try {
      if (!show) {
        const result = await fetch(url);
        const data = await result.json();
        setData(data);
        if (Number(data["analyzed"]) === 1) setShow(true);
      }
    } catch (err) {
      setShow(false);
    }
  };

  useEffect(() => {
    let timer = setInterval(() => {
      fetchData();
      // console.log(data);
    }, 10000);
    return () => clearInterval(timer);
  }, [fetchData, data]);

  if (data == null) return <Waiting />;

  // console.log(data["productInfo"]["specs"]);

  return show ? (
    // display review data
    <>
      <ProductDetail
        pCode={props.location.state["pCode"]}
        title={props.location.state["title"]}
        previewSrc={props.location.state["previewSrc"]}
        spec={data["productInfo"]["specs"]}
      />
      <ReviewScore rate={data["productInfo"]["rates"]} />
    </>
  ) : (
    <Waiting />
  );
};

export default Analysis;
