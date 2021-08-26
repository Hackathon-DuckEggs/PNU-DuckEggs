import React from "react";
import styled from "styled-components";
import { useHistory } from 'react-router-dom';

const Preview = styled.div.attrs(props => ({
  width: props.width || "50%",
  height: props.width || "auto",
}))`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex: 0.4;
  padding: 0 2em;
  img {
    width: ${(props) => props.width || "50%"};
    height: ${(props) => props.height || "auto"};
    &:hover {
      cursor: pointer;
    }
  }
`;

export function Logo(props) {
  const history = useHistory();
  const movePath = path => {
    history.push(path);
  };

  return (
    <Preview width={props.width} onClick={() => movePath('/')}>
      <img src="/imgs/textLogo.png" alt="logo"/>
    </Preview>
  );
}
  
  export default Logo;
