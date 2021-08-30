import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const HeaderContainer = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 8%;
  max-height: 6em;
  min-height: 2em;
  display: flex;
  align-items: center;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
  box-shadow:0 1px 4px rgba(32,33,36,0.28);
  background-color: white;
  img {
    margin: 1em 2em 1em 1em;
    width: 15%;
    height: auto;
    max-width: 150px;
    &:hover {
      cursor: pointer;
    }
`;

export function Header() {
  const history = useHistory();
  const movePath = (path) => {
    history.push(path);
  };

  return (
    <HeaderContainer>
      <img src="/imgs/textLogo.png" alt="logo" onClick={() => movePath("/")} />
    </HeaderContainer>
  );
}

export default Header;
