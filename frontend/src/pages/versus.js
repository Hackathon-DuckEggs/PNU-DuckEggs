import React from "react";
import styled from "styled-components";
import Header from "../components/header";
import ProductSelect from "../components/productSelect";

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
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;
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

const Versus = (props) => {
  console.log(props);
  return (
    <AppContainer>
      <Header />
      <Title>제품 비교하기</Title>
      <VersusContainer>
        <ProductSelect />
        <ProductSelect />
      </VersusContainer>
    </AppContainer>
  );
};

export default Versus;
