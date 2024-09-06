import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import initialItems from "@/public/assets/shopping-items.json";
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

const ItemDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  const item = initialItems.find((item) => item.id === id);

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <StyledItemDetails>
      {/* <a className="back-link" href="/">
        ← Back to Shopping List
      </a> */}
      <h1>{item.name}</h1>
      <img
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
