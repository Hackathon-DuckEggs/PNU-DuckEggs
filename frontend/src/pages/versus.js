import React, { useState } from "react";
import styled from "styled-components";
import Header from "../components/header";
import ProductSelect from "../components/productSelect";
import { Link } from "react-router-dom";

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

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 8em 2em;
`;

const VersusContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  algin-items: center;
  margin: 3em;
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

const Summary = styled.div`
  font-family: "NotoSansKR-Bold";
  font-weight: 700;
  margin-left: 10px;
  font-size: 1.5em;
  color: #a5a4a2;
  display: block;
  margin-top: -1em;
`;

const GoButton = styled.div`
  background: #a5a4a2;
  margin-top: -8em;
  color: #fff;
  width: 3em;
  height: 3em;
  line-height: 70px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-family: "NotoSansKR-Black";
  font-size: 3em;
  font-weight: 900;
  text-align: center;
  text-decoration: none;
  border: 3px solid #fff;
  box-shadow: 0px 0px 0px 3px #a5a4a2;
  &:hover {
    background-color: #ff9472;
    box-shadow: 0px 0px 0px 3px #ff9472;
    cursor: pointer;
    transition: all 300ms ease-in;
  }
`;

const Versus = (props) => {
  const [selectionFirst, setselectionFirst] = useState(false);
  const [selectionSecond, setselectionSecond] = useState(false);

  return (
    <AppContainer>
      <Header />
      <Title>제품 비교하기</Title>
      <Summary>키워드 점수를 비교합니다.</Summary>
      <VersusContainer>
        <ProductSelect setData={setselectionFirst} />
        <ProductSelect setData={setselectionSecond} />
      </VersusContainer>
      {selectionFirst && selectionSecond && (
        <StyledLink
          to={{
            pathname: `/loading/`,
            state: {
              pCodeFirst: selectionFirst,
              pCodeSecond: selectionSecond,
            },
          }}
        >
          <GoButton>Go!</GoButton>
        </StyledLink>
      )}
    </AppContainer>
  );
};

export default Versus;
