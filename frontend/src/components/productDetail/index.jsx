import React from 'react';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { ProductSpec } from "../productSpec";

const StyledLink = styled(Link)`
    text-decoration: none;
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;

const ProductDetailContainer = styled.div`
  width: 20%;
  height: 50%;
  display: flex;
  flex-direction: column;
  padding: 6px 8px;
  margin: 2em;
`;

const ProductBasicContainer = styled.div`
  width: 100%;
  height: auto;
  padding: 6px;
  display: flex;
  flex-direction: column;
  algin-items: center;
  justify-content: center;
`;

const Preview = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  border: 1.5px solid #E8E8E8;
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
  width: 100%;
  padding: 1rem 0.7rem;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  algin-items: space-between;
  background: rgba(255, 170, 76, 0.5);
  border: none;
  border-radius: 3px;
  box-shadow: 0px 0px 0px 10px 5px black;
  &:hover {
    cursor: pointer;
  }
`;

export function ProductDetail(props) {
  const {previewSrc, title, pCode, spec} = props;
  return (
    <ProductDetailContainer>
      <ProductBasicContainer>
        <Preview>
          <img src={previewSrc} alt="preview"/>
        </Preview>
        <Title>{title}</Title>
        <ButtonContainer>
          <StyledLink to={{
            pathname: `/test`,
            state: {
            }
          }}>
            <Button>상품 비교하기</Button>
          </StyledLink>
          <ProductSpec spec={spec}/>
        </ButtonContainer>
      </ProductBasicContainer>
  </ProductDetailContainer> 
  );
}
