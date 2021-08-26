import React from 'react';
import styled from "styled-components";
import { Logo } from "../logo"

const FooterContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
`;

const Footer = () => {
    return (
        <FooterContainer>
            <Logo />
        </FooterContainer>
    );
};

export default Footer;