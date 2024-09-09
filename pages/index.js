import React, { useState, useEffect } from "react";
import Link from "next/link";
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
        return "#E0E0E0";
    }
  }};

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const FormContainer = styled.form`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;

  label {
    display: block;
    margin-bottom: 5px;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }

  .error {
    color: red;
    margin-bottom: 10px;
  }
`;

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [categories] = useState(initialCategories);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    category: "",
    comment: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedItems = localStorage.getItem("shoppingItems");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      setItems(
        initialItems.map((item) => ({
          ...item,
          category: item.category.toLowerCase(),
        }))
      );
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("shoppingItems", JSON.stringify(items));
    }
  }, [items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!newItem.name) errors.name = "Name is required";
    if (!newItem.quantity || newItem.quantity <= 0)
      errors.quantity = "Quantity must be a positive number";
    if (!newItem.category || newItem.category === "default")
      errors.category = "Please select a category";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      const updatedItems = [
        { ...newItem, id: new Date().getTime().toString() },
        ...items,
      ];
      setItems(updatedItems);
      setNewItem({ name: "", quantity: 1, category: "", comment: "" });
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <StyledShoppingList>
      <h1>Shopping List: What I Need to Buy</h1>

      <FormContainer onSubmit={handleSubmit}>
        <h2>Add New Shopping Item</h2>
        <div className="error">{errors.name}</div>
        <label htmlFor="name">Item Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
        />

        <div className="error">{errors.quantity}</div>
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
        />

        <div className="error">{errors.category}</div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={newItem.category}
          onChange={handleInputChange}
        >
          <option value="default">Please select a category</option>
          {Object.keys(categories).map((category) => (
            <option key={category} value={category}>
              {categories[category]}
            </option>
          ))}
        </select>

        <label htmlFor="comment">Comment</label>
        <input
          type="text"
          id="comment"
          name="comment"
          value={newItem.comment}
          onChange={handleInputChange}
          placeholder="Optional"
        />

        <button type="submit">Add Item</button>
      </FormContainer>

      <p>Total items: {totalItems}</p>
      <div className="items-container">
        {items.map((item) => (
          <Link key={item.id} href={`/item/${item.id}`}>
            <ItemCard category={item.category}>
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Category: {categories[item.category] || item.category}</p>
            </ItemCard>
          </Link>
        ))}
      </div>
    </StyledShoppingList>
  );
};

export default ShoppingList;
