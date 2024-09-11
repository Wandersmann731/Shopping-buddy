import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import initialCategories from "@/public/assets/categories.json";
import Link from "next/link";

const StyledItemDetails = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
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
      setItem(foundItem || null);
    }
  }, [id]);

  if (!item) {
    return (
      <ItemDetailContainer>
        <h2>Item not found</h2>
        <p>The item you are looking for does not exist.</p>
        <StyledLink href="/">← Back to Shopping List</StyledLink>
      </ItemDetailContainer>
    );
  }

  return (
    <StyledItemDetails>
      <StyledLink href="/">← Back to Shopping List</StyledLink>
      <h1>{item.name}</h1>
      <img
        src={item.imageUrl || "https://via.placeholder.com/600x400"}
        alt={item.name}
        width={600}
        height={400}
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
