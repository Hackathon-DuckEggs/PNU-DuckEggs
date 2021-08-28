import styled from "styled-components";
import { SearchBar } from "../components/searchBar";
import { Logo } from "../components/logo";

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

const Home = () => {
  return (
    <HomeContainer>
      <Logo width="40%" />
      <Blank />
      <SearchBar />
    </HomeContainer>
  );
};

export default Home;
