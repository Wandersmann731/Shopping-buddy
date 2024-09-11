import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import initialItems from "@/public/assets/shopping-items.json";
import categories from "@/public/assets/categories.json";

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

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
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

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        setState(JSON.parse(storedValue));
      }
    }
  }, [key]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
}

const ShoppingList = () => {
  const [items, setItems] = useLocalStorageState("shoppingItems", []);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0) {
      const processedItems = initialItems.map((item) => ({
        ...item,
        category: item.category.toLowerCase(),
      }));
      setItems(processedItems);
    }
  }, [items.length, setItems]);

  const handleFormData = (form) => {
    const formData = new FormData(form);
    const newItem = Object.fromEntries(formData.entries());
    newItem.quantity = parseInt(newItem.quantity) || 1;

    const formErrors = validateForm(newItem);
    return { newItem, formErrors };
  };

  const validateForm = (item) => {
    const errors = {};
    if (!item.name) errors.name = "Name is required";
    if (item.quantity <= 0)
      errors.quantity = "Quantity must be a positive number";
    if (!item.category || item.category === "default")
      errors.category = "Please select a category";
    return errors;
  };

  const updateItemsState = (newItem) => {
    const updatedItems = [
      { ...newItem, id: new Date().getTime().toString() },
      ...items,
    ];
    setItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { newItem, formErrors } = handleFormData(e.target);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      updateItemsState(newItem);
      e.target.reset();
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <StyledShoppingList>
      <h1>Shopping List: What I Need to Buy</h1>

      <FormContainer onSubmit={handleSubmit}>
        <h2>Add New Shopping Item</h2>

        {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        <Label htmlFor="name">Item Name</Label>
        <Input type="text" id="name" name="name" />

        {errors.quantity && <ErrorMessage>{errors.quantity}</ErrorMessage>}
        <Label htmlFor="quantity">Quantity</Label>
        <Input type="number" id="quantity" name="quantity" />

        {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
        <Label htmlFor="category">Category</Label>
        <Select id="category" name="category">
          <option value="default">Please select a category</option>
          {categories.map((category) => (
            <option key={category} value={category.toLowerCase()}>
              {category}
            </option>
          ))}
        </Select>

        <Label htmlFor="comment">Comment</Label>
        <Input type="text" id="comment" name="comment" placeholder="Optional" />

        <Button type="submit">Add Item</Button>
      </FormContainer>

      <p>Total items: {totalItems}</p>
      <div className="items-container">
        {items.map((item) => (
          <Link key={item.id} href={`/item/${item.id}`} passHref>
            <ItemCard category={item.category}>
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>
                Category:{" "}
                {categories.find(
                  (cat) => cat.toLowerCase() === item.category
                ) || item.category}
              </p>
              {item.comment && <p>Comment: {item.comment}</p>}
            </ItemCard>
          </Link>
        ))}
      </div>
    </StyledShoppingList>
  );
};

export default ShoppingList;
