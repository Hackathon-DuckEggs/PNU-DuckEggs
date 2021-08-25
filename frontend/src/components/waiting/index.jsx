import React from "react";
import styled from "styled-components";
import { Spinner } from "react-awesome-spinners";

const WaitContainer = styled.div`
  width: 100%;
  min-height: 6em;
  display: flex;
  flex-direction: column;
  padding: 6px 8px;
  align-items: center;
  margin-bottom: 2em;
`;

const Message = styled.h3`
  font-size: 15px;
  color: #000;
  margin-left: 10px;
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export function Waiting(props) {
  return (
    <>
    <WaitContainer>
      <Message>리뷰 분석 중입니다. 조금만 기다려 주세요.<br />(약 1분 소요)</Message>
      <Spinner color= '#FFAA4C'/>
    </WaitContainer>
    </>
  );
}

export default Waiting;