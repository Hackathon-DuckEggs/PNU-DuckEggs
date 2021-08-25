import React from "react";
import styled from "styled-components";
import { useHistory } from 'react-router-dom';

const Preview = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex: 0.4;
  img {
    width: 15%;
    height: 15%;

    &:hover {
      cursor: pointer;
    }
  }
`;

export function Logo() {
  const history = useHistory();
  const movePath = path => {
    history.push(path);
  };
    return (
      <Preview onClick={() => movePath('/')}>
        <img src="/imgs/textLogo.png" />
      </Preview>
    );
  }
  
  export default Logo;
