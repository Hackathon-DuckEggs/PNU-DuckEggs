import styled from "styled-components";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 8em;
`;

const Test = () => {
  return <AppContainer>test</AppContainer>;
};

export default Test;
