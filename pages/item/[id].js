import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import initialCategories from "@/public/assets/categories.json";
import Link from "next/link";
import Image from "next/image";

const StyledItemDetails = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
  }

  .back-link {
    display: inline-block;
    margin-bottom: 20px;
    text-decoration: none;
    color: #007bff;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ItemDetailContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;
const StyledLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  text-decoration: none;
  color: #007bff;
  &:hover {
    text-decoration: underline;
  }
`;

const ItemDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (id) {
      const storedItems =
        JSON.parse(localStorage.getItem("shoppingItems")) || [];
      const foundItem = storedItems.find((item) => item.id === id);

      if (foundItem) {
        setItem(foundItem);
      } else {
        setItem(null);
      }
    }
  }, [id]);

  if (!item) {
    return (
      <ItemDetailContainer>
        <h2>Item not found</h2>
        <p>The item you are looking for does not exist.</p>
      </ItemDetailContainer>
    );
  }

  return (
    <StyledItemDetails>
      <StyledLink href="/">← Back to Shopping List</StyledLink>
      <h1>{item.name}</h1>
      <imgage
        src={item.imageUrl || "https://via.placeholder.com/600x400"}
        alt={item.name}
      />
      <p>Quantity: {item.quantity}</p>
      <p>
        Category:{" "}
        {initialCategories[item.category.toLowerCase()] || item.category}
      </p>
      <p>Comments: {item.comment || "No comments"}</p>
    </StyledItemDetails>
  );
};

export default ItemDetails;
