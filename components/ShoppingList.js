import React, { useState, useEffect } from "react";
import styled from "styled-components";
import initialCategories from "@/public/assets/categories.json";
import initialItems from "@/public/assets/shopping-items.json";
const StyledShoppingList = styled.div`
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

const ItemCard = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${({ category }) => {
    switch (category) {
      case "fruits":
        return "#3bff4b";
      case "bakery":
        return "#b06100";
      case "dairy":
        return "#7a7fff";
      case "vegetables":
        return "#009900";
      case "meat":
        return "#FFCDD2";
      case "beverage":
        return "#ff7f7f";
      case "snacks":
        return "#009900";
      case "household":
        return "#d97ae6";
      case "personal care":
        return "#d48208";
      case "other":
        return "#fc9997";
      default:
        return "#E0E0E0"; // Grau als Fallback
    }
  }};
`;

const ShoppingList = () => {
const [items, setItems] = useState(
    initialItems.map((item, index) => ({
      ...item,
      id: `item-${index + 1}`,
      category: item.category.toLowerCase(),
    }))
  );
  const [categories, setCategories] = useState(initialCategories);

const totalItems = items.reduce((total, item) => total + item.quantity, 0);


  return (
    <StyledShoppingList>
      <h1>Shopping List: What I Need to Buy</h1>
      <p>Total items: {getTotalItems()}</p>
      <div className="items-container">
        {items.map((item) => (
          <ItemCard key={item.id} category={item.category}>
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Category: {categories[item.category] || item.category}</p>
          </ItemCard>
        ))}
      </div>
    </StyledShoppingList>
  );
};

export default ShoppingList;
