import React, { useState } from "react";
import styled from "styled-components";
import { CgSmile, CgSmileSad } from "react-icons/cg";

const ProgressbarContainer = styled.div`
  display: flex;
  justify-contents: center;
  align-item: center;
  text-align: center;
  margin: 0.5em;
`;

const Progressbar = styled.div`
  background-color: #d8d8d8;
  border-radius: 20px;
  position: relative;
  margin: 0.2em 1em;
  height: 30px;
  width: 300px;
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

const Title = styled.h3`
  text-align: center;
  font-size: 15px;
  color: #000;
  flex: 2;
  display: flex;
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

export const ProgressBar = () => {
  const [style, setStyle] = useState({});

  setTimeout(() => {
    const newStyle = {
      opacity: 1,
      // width: `${done}%`
      width: `70%`,
    };
    setStyle(newStyle);
  }, 200);

  return (
    <ProgressbarContainer>
      <SadIcon>
        <CgSmileSad />
      </SadIcon>
      <Progressbar>
        <ProgressDone style={style}>70점</ProgressDone>
      </Progressbar>
      <SmileIcon>
        <CgSmile />
      </SmileIcon>
    </ProgressbarContainer>
  );
};

export default ProgressBar;
