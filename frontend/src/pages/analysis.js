import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Waiting } from "../components/waiting";
import { ProductDetail } from "../components/productDetail";
import { ReviewScore } from "../components/reviewScore";
import { KeywordCloud } from "../components/keywordCloud";
import Footer from "../components/footer";
import Header from "../components/header";
import { Link } from "react-router-dom";
import { HiCursorClick } from "react-icons/hi";

const Title = styled.div`
  font-family: "NotoSansKR-Black";
  font-weight: 900;
  font-size: 2em;
  word-break: keep-all;
  margin-top: -0.1em;
  color: #000;
  margin-left: 10px;
  display: inline-block;
`;

const AnalysisContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  margin: 8em 2em;
`;

const ReviewResultContainer = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1.5px solid #e8e8e8;
  padding: 1em;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const SmallTitle = styled.div`
  font-size: 1.2em;
  margin-left: 0.5em;
  font-family: "NotoSansKR-Bold";
  font-weight: 700;
  color: #000;
  text-decoration: underline;
  &:hover {
    color: #f67824;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

const Analysis = (props) => {
  const pCode = props.location.state["pCode"];
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
    }, 10000);
    return () => clearInterval(timer);
  }, [fetchData, data]);

  if (data == null)
    return (
      <>
        <Waiting />
        <Footer />
      </>
    );

  return show ? (
    <AnalysisContainer>
      <Header />
      <ProductDetail
        pCode={props.location.state["pCode"]}
        title={props.location.state["title"]}
        previewSrc={props.location.state["previewSrc"]}
        spec={data["productInfo"]["specs"]}
      />
      <ReviewResultContainer>
        <Title>Keyword 분석</Title>
        <KeywordCloud keyword={data["productInfo"]["rates"]} />
        <TitleContainer>
          <Title>Keyword 점수</Title>
          <StyledLink
            to={{
              pathname: `/review/${pCode}`,
              state: { pCode: pCode },
            }}
            target="_blank"
          >
            <SmallTitle>
              <HiCursorClick />
              리뷰 별로 조회하기
            </SmallTitle>
          </StyledLink>
        </TitleContainer>
        <ReviewScore rate={data["productInfo"]["rates"]} />
      </ReviewResultContainer>
    </AnalysisContainer>
  ) : (
    <>
      <Waiting />
      <Footer />
    </>
  );
};

export default Analysis;
