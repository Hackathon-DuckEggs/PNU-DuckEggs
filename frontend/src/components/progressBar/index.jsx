import React, { useState } from "react";
import styled from "styled-components";
import { CgSmile, CgSmileSad } from "react-icons/cg";

const ProgressbarContainer = styled.div`
  displey: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ProgressbarContent = styled.div`
  display: flex;
  margin-left: 0.2em;
`;

const Progressbar = styled.div`
  background-color: #d8d8d8;
  border-radius: 20px;
  position: relative;
  margin: 0.2em 1em;
  height: 2em;
  width: 40em;
`;

const ProgressDone = styled.div`
  background: linear-gradient(to left, #f2709c, #ff9472);
  box-shadow: 0 3px 3px -5px #f2709c, 0 2px 5px #f2709c;
  border-radius: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 0;
  opacity: 0;
  transition: 1s ease 0.3s;
`;

const Keyword = styled.h3`
  display: inline-block;
  font-size: 15px;
  text-align: center;
  color: #000;
`;

const SadIcon = styled.span`
  color: #ff9472;
  font-size: 30px;
  vertical-align: middle;
`;

const SmileIcon = styled.span`
  color: #ff9472;
  font-size: 30px;
  vertical-align: middle;
`;

export const ProgressBar = (props) => {
  const [style, setStyle] = useState({});
  const keyword = props.review[0];
  const keywordCnt = props.review[1]["cnt"];
  const score = Math.round(props.review[1]["score"] * 100).toFixed(0);

  setTimeout(() => {
    const newStyle = {
      opacity: 1,
      width: `${score}%`,
    };
    setStyle(newStyle);
  }, 200);

  return (
    <ProgressbarContainer>
      <Keyword>
        {keyword} (언급횟수: {keywordCnt}번)
      </Keyword>
      <ProgressbarContent>
        <SadIcon>
          <CgSmileSad />
        </SadIcon>
        <Progressbar>
          <ProgressDone style={style}>{score}점</ProgressDone>
        </Progressbar>
        <SmileIcon>
          <CgSmile />
        </SmileIcon>
      </ProgressbarContent>
    </ProgressbarContainer>
  );
};

export default ProgressBar;
