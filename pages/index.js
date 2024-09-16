import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import initialItems from "@/public/assets/shopping-items.json";
import categories from "@/public/assets/categories.json";
import { nanoid } from "nanoid";
import useLocalStorageState from "use-local-storage-state";

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

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const PurchasedItemsContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 20px;

  h2 {
    color: grey;
  }

  .purchased-item {
    text-decoration: line-through;
    color: grey;
  }
`;

const ItemDetailContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
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
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin 10px;

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
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px;

    &:hover {
      background-color: #0056b3;
    }
  }

  .error {
    color: red;
    margin-bottom: 10px;
  }
`;

const DeleteButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px ;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ConfirmationDialog = styled.div`
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

  button {
    margin: 10px;
  }
`;

const ShoppingList = () => {
  const [items, setItems] = useLocalStorageState("shoppingItems", []);
  const [purchasedItems, setPurchasedItems] = useLocalStorageState(
    "purchasedItems",
    []
  );
  const [errors, setErrors] = useState({});
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const totalItems = (items || []).reduce(
    (total, item) => total + item.quantity,
    0
  );

  const TotalPurchased = (purchasedItems || []).reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleCheckboxClick = (itemId) => {
    const item = items.find((item) => item.id === itemId);
    if (item) {
      const purchasedItem = { ...item, purchased: true };
      setPurchasedItems([purchasedItem, ...(purchasedItems || [])]);
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  const handleUnmarkClick = (itemId) => {
    const purchasedItem = purchasedItems.find((item) => item.id === itemId);
    if (purchasedItem) {
      const item = { ...purchasedItem, purchased: false };
      setItems([item, ...(items || [])]);
      setPurchasedItems(purchasedItems.filter((item) => item.id !== itemId));
    }
  };

  useEffect(() => {
    if ((items || []).length === 0) {
      const processedItems = initialItems.map((item) => ({
        ...item,
        category: item.category.toLowerCase(),
      }));
      setItems(processedItems);
    }
  }, []);

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
    const updatedItems = [{ ...newItem, id: nanoid() }, ...items];
    setItems(updatedItems);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormVisible(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { newItem, formErrors } = handleFormData(e.target);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      if (editingItem) {
        const updatedItems = items.map((item) =>
          item.id === editingItem.id ? { ...newItem, id: item.id } : item
        );
        setItems(updatedItems);
        setEditingItem(null);
      } else {
        updateItemsState(newItem);
      }
      e.target.reset();
      setIsFormVisible(false);
    }
  };

  const handleDelete = (id) => {
    setDeletingItemId(id);
  };

  const confirmDelete = () => {
    setItems(items.filter((item) => item.id !== deletingItemId));
    setDeletingItemId(null);
  };

  const cancelDelete = () => {
    setDeletingItemId(null);
  };

  // const toggleFormVisibility = () => {
  //   setIsFormVisible((prev) => !prev);
  // };

  const handleCancel = (e) => {
    e.preventDefault();
    setIsFormVisible(false);
    e.target.closest("form").reset();
  };

  return (
    <StyledShoppingList>
      <h1>Shopping List: What I Need to Buy</h1>

      {!isFormVisible && (
        <Button
          onClick={() => {
            setEditingItem(null);
            setIsFormVisible(true);
          }}
        >
          Add New Item
        </Button>
      )}

      {isFormVisible && (
        <FormContainer onSubmit={handleSubmit} id="add-item-form">
          <h2>
            {editingItem ? "Edit Shopping Item" : "Add New Shopping Item"}
          </h2>
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          <Label htmlFor="name">Item Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={editingItem?.name || ""}
          />
          {errors.quantity && <ErrorMessage>{errors.quantity}</ErrorMessage>}
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            type="number"
            id="quantity"
            name="quantity"
            defaultValue={editingItem?.quantity || ""}
          />
          {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            name="category"
            defaultValue={editingItem?.category || "default"}
          >
            <option value="default">Please select a category</option>
            {categories.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </Select>
          <Label htmlFor="comment">Comment</Label>
          <Input
            type="text"
            id="comment"
            name="comment"
            placeholder="Optional"
            defaultValue={editingItem?.comment || ""}
          />
          <EditButton type="submit">
            {editingItem ? "Save Changes" : "Add Item"}
          </EditButton>
          <Button onClick={handleCancel}>Cancel</Button>
        </FormContainer>
      )}

      {totalItems === 0 && TotalPurchased > 0 && (
        <div>All items have been purchased!</div>
      )}
      {totalItems === 0 && TotalPurchased === 0 ? (
        <div>No shopping items. Add some items to get started.</div>
      ) : (
        <>
          <p>Total items: {totalItems}</p>
          <ItemDetailContainer>
            {items.map((item) => (
              <ItemCard key={item.id} category={item.category}>
                <input
                  type="checkbox"
                  checked={item.purchased || false}
                  onChange={() => handleCheckboxClick(item.id)}
                />
                <Link key={item.id} href={`/item/${item.id}`} passHref>
                  <div>
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      Category:{" "}
                      {categories.find(
                        (cat) => cat.toLowerCase() === item.category
                      ) || item.category}
                    </p>
                  </div>
                </Link>
                <EditButton onClick={() => handleEdit(item)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete(item.id)}>
                  Delete
                </DeleteButton>
              </ItemCard>
            ))}
          </ItemDetailContainer>

          {TotalPurchased > 0 && (
            <PurchasedItemsContainer>
              <h2>Purchased Items</h2>
              <p>Total purchased items: {TotalPurchased}</p>
              {purchasedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  category={item.category}
                  className="purchased-item"
                >
                  <input
                    type="checkbox"
                    checked={item.purchased || false}
                    onChange={() => handleUnmarkClick(item.id)}
                  />
                  <div>
                    <h3 style={{ textDecoration: "line-through" }}>
                      {item.name}
                    </h3>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </ItemCard>
              ))}
            </PurchasedItemsContainer>
          )}
        </>
      )}

      {deletingItemId && (
        <ConfirmationDialog>
          <p>Are you sure you want to delete this item?</p>
          <Button onClick={confirmDelete}>Yes, delete</Button>
          <Button onClick={cancelDelete}>Cancel</Button>
        </ConfirmationDialog>
      )}
    </StyledShoppingList>
  );
};

export default ShoppingList;
