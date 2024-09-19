import styled from "styled-components";
import Link from "next/link";

export const StyledItemDetails = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
  }
`;

export const StyledItemDetailContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
    }
`;
export const StyledLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  text-decoration: none;
  color: #007bff;
  &:hover {
    text-decoration: underline;
  }
`;
