import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const LogoImage = styled.div.attrs((props) => ({
  width: props.width || "50%",
  height: props.width || "auto",
}))`
  margin: -1em;
  height: auto;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
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
  const movePath = (path) => {
    history.push(path);
  };

  return (
    <LogoImage width={props.width} onClick={() => movePath("/")}>
      <img src="/imgs/fullLogo.png" alt="logo" />
    </LogoImage>
  );
}

export default Logo;
