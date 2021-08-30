import React from "react";
import styled from "styled-components";
import { EmojiSymbolsTwoTone, ExpandMore } from "@material-ui/icons";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";

const ProductSpecContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  margin-top: 0.5em;
`;

const SpecContentsContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  margin-top: -1em;
`;

const Specs = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 16px;
  word-break: keep-all;
  color: #383838;
  font-family: "NotoSansKR-Bold";
  font-weight: 700;
`;

const Contents = styled.span`
  font-size: 16px;
  word-break: keep-all;
  font-family: "NotoSansKR-Medium";
  font-weight: 500;
  color: #000;
  margin-bottom: 4px;
`;

export const ProductSpec = (props) => {
  return (
    <ProductSpecContainer>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Title>상세 정보</Title>
        </AccordionSummary>
        <AccordionDetails>
          <SpecContentsContainer>
            {Object.keys(props.spec).map((item) => (
              <Specs>
                <Title>{item}</Title>
                <Contents>{props.spec[item].toString()}</Contents>
              </Specs>
            ))}
          </SpecContentsContainer>
        </AccordionDetails>
      </Accordion>
    </ProductSpecContainer>
  );
};

export default ProductSpec;
