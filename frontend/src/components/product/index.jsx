import React from "react";
import styled from "styled-components";

const ProductContainer = styled.div`
  width: 100%;
  min-height: 6em;
  display: flex;
  border-bottom: 2px solid #d8d8d852;
  padding: 6px 8px;
  align-items: center;
`;

const Preview = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  flex: 0.4;
  img {
    width: auto;
    height: 100%;
  }
`;

const Title = styled.h3`
  font-size: 15px;
  color: #000;
  margin-left: 10px;
  flex: 2;
  display: flex;
`;


export function Product(props) {
  const { previewSrc, title } = props;

  return (
    <ProductContainer>
      <Preview>
        <img src={previewSrc} />
      </Preview>
      <Title>{title}</Title>
    </ProductContainer>
  );
}
