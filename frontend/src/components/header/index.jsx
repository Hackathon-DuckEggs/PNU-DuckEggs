import React from "react";
import styled from "styled-components";
import { SearchBar } from "../searchBar";
import { Logo } from "../logo";

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: auto;
  min-height: 6em;
  display: flex;
  padding: 6px 8px;
  align-items: center;
`;

export function Header() {
  return (
    <HeaderContainer>
      <Logo width="300%" />
      <SearchBar />
    </HeaderContainer>
  );
}

export default Header;
