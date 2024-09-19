import styled from "styled-components";

export const StyledItemCard = styled.div`
  display: block;
  text-decoration: none;
  color: inherit;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${({ category }) => {
    switch (category) {
      case "fruits":
        return "#79a17d";
      case "bakery":
        return "#d4a76a";
      case "dairy":
        return "#7c9fb0";
      case "vegetables":
        return "#c07676";
      case "meat":
        return "#9d8bb5";
      case "beverage":
        return "#a0877d";
      case "snacks":
        return "#c299b0";
      case "household":
        return "#999999";
      case "personal care":
        return "#b1b179";
      case "other":
        return "#fc9997";
      default:
        return "#7ca6a6";
    }
  }};

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;
