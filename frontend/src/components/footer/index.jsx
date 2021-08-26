import React from 'react';
import styled from "styled-components";
import { useHistory } from 'react-router-dom';

const FooterContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  img {
    &:hover {
      cursor: pointer;
    }
`;

const Footer = () => {
    const history = useHistory();
    const movePath = path => {
        history.push(path);
    };

    return (
        <FooterContainer>
            <img src="/imgs/textLogo.png" alt="logo" onClick={() => movePath('/')}/>
        </FooterContainer>
    );
};

export default Footer;