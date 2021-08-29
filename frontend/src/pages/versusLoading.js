import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/header";
import Footer from "../components/footer";
import { Waiting } from "../components/waiting";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 8em 2em;
`;

const Title = styled.h3`
  font-size: 2em;
  word-break: keep-all;
  text-align: center;
  color: #383838;
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  algin-items: center;
`;

export const VersusLoading = (props) => {
  const { pCodeFirst, pCodeSecond } = props.location.state;
  const [dataFirst, setDataFirst] = useState(null);
  const [dataSecond, setDataSecond] = useState(null);
  const [show, setShow] = useState(false);

  const urlFirst = `http://duckegg.kro.kr/api/product/${pCodeFirst}`;
  const urlSecond = `http://duckegg.kro.kr/api/product/${pCodeSecond}`;

  const fetchData = async () => {
    try {
      if (!show) {
        const resultFirst = await fetch(urlFirst);
        const resultSecond = await fetch(urlSecond);
        const dataFirst = await resultFirst.json();
        const dataSecond = await resultSecond.json();
        setDataFirst(dataFirst);
        setDataSecond(dataSecond);
        if (
          Number(dataFirst["analyzed"]) === 1 &&
          Number(dataSecond["analyzed"]) === 1
        )
          setShow(true);
      }
    } catch (err) {
      setShow(false);
    }
  };

  useEffect(() => {
    let timer = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  if (dataFirst == null && dataSecond == null)
    return (
      <>
        <Waiting />
        <Footer />
      </>
    );

  // 공통 키워드 검색 하기

  return show ? (
    <AppContainer>
      <Header />
      <Title>공통 키워드를 고릅니다.</Title>
    </AppContainer>
  ) : (
    <>
      <Waiting />
      <Footer />
    </>
  );
};

export default VersusLoading;
