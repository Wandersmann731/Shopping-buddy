import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import initialCategories from "@/public/assets/categories.json";
import Image from "next/image";

import {
  StyledItemDetailContainer,
  StyledItemDetails,
  StyledLink,
} from "@/StyledComponents/StyledItemDetails";

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
      <StyledItemDetailContainer>
        <h2>Item not found</h2>
        <p>The item you are looking for does not exist.</p>
        <StyledLink href="/">← Back to Shopping List</StyledLink>
      </StyledItemDetailContainer>
    );
  }

  return (
    <StyledItemDetails>
      <StyledLink href="/">← Back to Shopping List</StyledLink>
      <h1>{item.name}</h1>
      <Image
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
