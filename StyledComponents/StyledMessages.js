import styled from "styled-components";

export const StyledConfirmationMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;
export const StyledErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;
