import styled from "styled-components";
import { SearchBar } from "../components/searchBar";

const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 8em;
`;

const Home = () => {
  return (
    <HomeContainer>
      <SearchBar />
    </HomeContainer>
  );
};

export default Home;
