import React from "react";
import styled from "styled-components";

const LogoContainer = styled.div`
  width: 40%;
  height: 20%;
  min-height: 6em;
  display: flex;
  padding: 6px 8px;
  align-items: center;
  margin-bottom: 2em;
`;

const Logo = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  flex: 0.4;
  img {
    width: auto;
    height: 100%;
  }
`;

const Title = styled.h3`
  width: auto;
  height: 100%;
  display: flex;
  flex: 0.4;
  img {
    width: auto;
    height: 100%;
  }
`;

export function Header(props) {
  return (
    <LogoContainer>
      <Logo>
        <img src={require("./img/logo.png").default} />
      </Logo>
      <Title>
      <img src={require("./img/title.png").default} />
      </Title>
    </LogoContainer>
  );
}
