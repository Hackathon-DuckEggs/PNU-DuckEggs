import styled from "styled-components";
import { SearchBar } from "../components/searchBar";
import { Logo } from "../components/logo";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
  text-decoration: none;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 8em;
`;

const Blank = styled.div`
  width: 100%;
  height: 4em;
`;

const Button = styled.button`
  font-family: "NotoSansKR-Light";
  color: #2b2b2b;
  font-weight: 300;
  background: #eeeeee;
  font-size: 1em;
  margin: 2em;
  padding: 0.5em 1em;
  border: none;
  border-radius: 3px;
  &:hover {
    cursor: pointer;
    border: 2px solid #d6d6d8;
  }
`;

const Home = () => {
  return (
    <HomeContainer>
      <Logo width="40%" />
      <Blank />
      <SearchBar />
      <StyledLink
        to={{
          pathname: `/versus/`,
        }}
      >
        <Button>상품 비교하기</Button>
      </StyledLink>
    </HomeContainer>
  );
};

export default Home;
