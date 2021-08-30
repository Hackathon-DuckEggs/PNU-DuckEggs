import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ProductSpec } from "../productSpec";

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

const ProductDetailContainer = styled.div`
  width: 20%;
  max-width: 300px;
  height: 50%;
  display: flex;
  flex-direction: column;
  padding: 0 1em;
`;

const ProductBasicContainer = styled.div`
  width: 100%;
  height: auto;
  padding: 6px;
  display: flex;
  flex-direction: column;
  algin-items: center;
  justify-content: center;
  border: 1.5px solid #e8e8e8;
`;

const Preview = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex: 0.4;
  justify-content: center;
  algin-items: center;
  img {
    width: 90%;
  }
`;

const Title = styled.h3`
  font-size: 20px;
  word-break: keep-all;
  text-align: center;
  color: #383838;
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  algin-items: center;
`;

const ButtonContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  algin-items: space-between;
`;

const Button = styled.button`
  background: #eeeeee;
  width: 100%;
  padding: 1rem 0.7rem;
  font-family: "NotoSansKR-Bold";
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  algin-items: space-between;
  color: #2b2b2b;
  border: none;
  border-radius: 3px;
  box-shadow: 0px 0px 0px 10px 5px black;
  &:hover {
    cursor: pointer;
    border: 2px solid #d6d6d8;
  }
`;

export function ProductDetail(props) {
  const { previewSrc, title, pCode, spec } = props;
  console.log(spec);
  return (
    <ProductDetailContainer>
      <ProductBasicContainer>
        <Preview>
          <img src={previewSrc} alt="preview" />
        </Preview>
        <Title>{title}</Title>
        <ButtonContainer>
          <StyledLink
            to={{
              pathname: `/versus/${pCode}`,
              state: { pCode: pCode },
            }}
          >
            <Button>상품 비교하기</Button>
          </StyledLink>
          <ProductSpec spec={spec} />
        </ButtonContainer>
      </ProductBasicContainer>
    </ProductDetailContainer>
  );
}
