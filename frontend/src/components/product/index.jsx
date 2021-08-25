import React from "react";
import { useHistory } from 'react-router-dom';
import styled from "styled-components";
import { ProductDetail } from "../productDetail";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

const ProductContainer = styled.div`
  width: 100%;
  min-height: 6em;
  display: flex;
  border-bottom: 2px solid rgba(255, 170, 76, 0.2);
  padding: 6px 8px;
  align-items: center;

  &:hover {
    background-color: #EEEEEE;
    cursor: pointer;
  }
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

// pCode 확인용 (임시)
const Pcode = styled.span`
  color: #a1a1a1;
  font-size: 16px;
  display: flex;
  flex: 0.2;
`;

export function Product(props) {
  const {previewSrc, title, pCode} = props;
  const history = useHistory();

  const movePath = path => {
    history.push(path);
  };

  return (
    <Link to={{
      pathname: `/analysis/${pCode}`,
      state: {
        pCode: pCode,
      }
    }}>
        <ProductContainer>
          <Preview>
            <img src={previewSrc} />
          </Preview>
          <Title>{title}</Title>
          <Pcode>{pCode}</Pcode>
        </ProductContainer>
    </Link>
  );
  
}
