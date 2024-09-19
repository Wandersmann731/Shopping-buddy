import styled from "styled-components";

export const StyledShoppingList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .items-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
  }
`;

export const StyledItemDetailContainer = styled.div`
  max-height: 800px;
  padding: 10px;
`;
