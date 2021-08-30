import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/header";
import Footer from "../components/footer";
import { Waiting } from "../components/waiting";
import SelectedImage from "../components/selectedImage";
import KeywordVersus from "../components/keywordVersus";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 6em 2em;
`;

const Title = styled.h3`
  font-size: 2em;
  word-break: keep-all;
  text-align: center;
  color: #383838;
  display: flex;
  flex-direction: row;
  justify-content: center;
  algin-items: center;
`;

const Summary = styled.div`
  font-family: "NotoSansKR-Bold";
  margin-top: -1em;
  font-weight: 700;
  font-size: 1.2em;
  color: #a5a4a2;
  display: block;
`;

const ProductSummaryContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const SmallTitle = styled.div`
  font-size: 1.2em;
  font-family: "NotoSansKR-Bold";
  font-weight: 700;
  color: #000;
  text-align: center;
`;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30%;
`;

const VersusResultContainer = styled.div`
  display: flex;
  padding: 1em;
  width: 60%;
  margin: 2em;
  justify-content: center;
  align-items: center;
`;

export const VersusLoading = (props) => {
  const { selectionFirst, selectionSecond } = props.location.state;
  const [dataFirst, setDataFirst] = useState(null);
  const [dataSecond, setDataSecond] = useState(null);
  const [show, setShow] = useState(false);

  const urlFirst = `http://duckegg.kro.kr/api/product/${selectionFirst["pCode"]}`;
  const urlSecond = `http://duckegg.kro.kr/api/product/${selectionSecond["pCode"]}`;

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

  if (show) {
    // 공통 키워드 검색 하기
    // 각각의 키워드 중 상위 10개의 키워드만 추출해서 배열을 만든 후, 공통 키워드를 걸러낸다.
    const rateFirst = dataFirst.productInfo.rates;
    const rateSecond = dataSecond.productInfo.rates;

    const sortedDataFirst = [];
    const sortedDataSecond = [];

    const sortedKeywordsFirst = [];
    const sortedKeywordsSecond = [];

    const processingData = (rate, sortedRate, keywordCnt, sortedKeywords) => {
      for (const keyword in rate) {
        sortedRate.push([keyword, rate[keyword]]);
      }

      sortedRate.sort(function (a, b) {
        return b[1]["cnt"] - a[1]["cnt"];
      });

      if (keywordCnt > 10) {
        sortedRate.length = 10;
      }

      for (const keyword of sortedRate) {
        sortedKeywords.push(keyword[0]);
      }
    };

    processingData(
      rateFirst,
      sortedDataFirst,
      Object.keys(rateFirst).length,
      sortedKeywordsFirst
    );
    processingData(
      rateSecond,
      sortedDataSecond,
      Object.keys(rateSecond).length,
      sortedKeywordsSecond
    );

    const filteredKeywords = sortedKeywordsFirst.filter((value) =>
      sortedKeywordsSecond.includes(value)
    );
    return (
      <AppContainer>
        <Header />
        <Title>상품 비교</Title>
        <Summary>공통 키워드 점수를 비교합니다.</Summary>
        <ProductSummaryContainer>
          <ProductContainer>
            <SelectedImage product={selectionFirst} />
            <SmallTitle>{selectionFirst.description}</SmallTitle>
          </ProductContainer>
          <ProductContainer>
            <SelectedImage product={selectionSecond} />
            <SmallTitle>{selectionSecond.description}</SmallTitle>
          </ProductContainer>
        </ProductSummaryContainer>
        <VersusResultContainer>
          <KeywordVersus
            productFirst={selectionFirst.description}
            productSecond={selectionSecond.description}
            sortedDataFirst={sortedDataFirst}
            sortedDataSecond={sortedDataSecond}
            filteredKeywords={filteredKeywords}
          />
        </VersusResultContainer>
      </AppContainer>
    );
  }

  return (
    <>
      <Waiting />
      <Footer />
    </>
  );
};

export default VersusLoading;
