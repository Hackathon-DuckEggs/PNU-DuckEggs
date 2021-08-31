import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import ReactTooltip from "react-tooltip";

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
  justify-content: space-between;
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

const MenuContainer = styled.div`
  display: flex;
  margin-top: 0.3em;
`;

const MenuIcon = styled.span`
  color: #565656;
  font-size: 2.5em;
  vertical-align: middle;
  cursor: pointer;
  &:hover {
    cursor: pointer;
  }
  margin-left: 0.6em;
  margin-top: 0.2em;
`;

const MenuImage = styled.div`
  width: 30%;
  color: #565656;
  vertical-align: middle;
  cursor: pointer;
  &:hover {
    cursor: pointer;
  }

  img {
    width: 3em;
    height: auto;
    vertical-align: middle;
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
      <MenuContainer>
        <MenuImage data-tip="비교하기">
          <ReactTooltip />
          <img
            src="/imgs/versusIcon.svg"
            alt="logo"
            onClick={() => movePath("/versus/")}
          />
        </MenuImage>
        <MenuIcon data-tip="홈">
          <ReactTooltip />
          <IoHome onClick={() => movePath("/")} />
        </MenuIcon>
      </MenuContainer>
    </HeaderContainer>
  );
}

export default Header;
