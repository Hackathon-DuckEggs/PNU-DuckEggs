import styled from "styled-components";
import { SearchBar } from "../components/searchBar";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8em;
`;

const Home = () => {
  return (
    <AppContainer>
      <SearchBar />
    </AppContainer>
  );
}

export default Home;