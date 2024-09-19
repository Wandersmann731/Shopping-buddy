import React, { useState, useRef } from "react";
import Link from "next/link";
import initialItems from "@/public/assets/shopping-items.json";
import categories from "@/public/assets/categories.json";
import useLocalStorageState from "use-local-storage-state";
import { scrollTo } from "@/utils/scrollTo";
import { handleFormData } from "@/utils/validateForm";
import { nanoid } from "nanoid";

import { StyledFormContainer } from "@/StyledComponents/StyledFormContainer";

import {
  StyledButtonContainer,
  StyledButton,
} from "@/StyledComponents/StyledButtons";

import {
  StyledLabel,
  StyledInput,
  StyledSelect,
} from "@/StyledComponents/StyledForms";

import { StyledItemCard } from "@/StyledComponents/StyledItemCard";

import {
  StyledItemDetailContainer,
  StyledShoppingList,
} from "@/StyledComponents/StyledItems";

import {
  StyledConfirmationMessage,
  StyledErrorMessage,
} from "@/StyledComponents/StyledMessages";

export default function ShoppingList() {
  const [items, setItems] = useLocalStorageState("shoppingItems", {
    defaultValue: initialItems.map((item) => ({
      ...item,
      category: item.category.toLowerCase(),
    })),
  });

  const [errors, setErrors] = useState({});
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const topRef = useRef(null);
  const purchasedItemsRef = useRef(null);

  const totalItems = (items || []).reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleEdit(item) {
    setEditingItem(item);
    setIsFormVisible(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { newItem, formErrors } = handleFormData(e.target);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      if (editingItem) {
        const updatedItems = items.map(function (item) {
          return item.id === editingItem.id
            ? { ...newItem, id: item.id }
            : item;
        });
        setItems(updatedItems);
        setEditingItem(null);
      } else {
        setItems([{ ...newItem, id: nanoid() }, ...items]);
      }
      e.target.reset();
      setIsFormVisible(false);
    }
  }

  function handleDelete(id) {
    setDeletingItemId(id);
  }

  function confirmDelete() {
    setItems(items.filter((item) => item.id !== deletingItemId));
    setDeletingItemId(null);
  }

  function cancelDelete() {
    setDeletingItemId(null);
  }

  function toggleMarkAsPurchased(id) {
    setItems(
      items.map((item) => {
        if (id === item.id) {
          return { ...item, isPurchased: !item.isPurchased };
        } else {
          return item;
        }
      })
    );
  }

  const purchasedItems = items.filter((item) => item.isPurchased);

  const totalPurchased = (purchasedItems || []).reduce(
    (total, item) => total + item.quantity,
    0
  );

  const nonPurchasedItems = items.filter((item) => !item.isPurchased);

  return (
    <StyledShoppingList>
      <div ref={topRef}></div>

      <h1>Shopping List: What I Need to Buy</h1>

      {!isFormVisible && (
        <StyledButtonContainer>
          <StyledButton
            onClick={() => {
              setEditingItem(null);
              setIsFormVisible(true);
            }}
          >
            Add New Item
          </StyledButton>

          {totalPurchased > 0 && (
            <StyledButton onClick={() => scrollTo(purchasedItemsRef)}>
              Purchased Items ({totalPurchased})
            </StyledButton>
          )}
        </StyledButtonContainer>
      )}

      {isFormVisible && (
        <StyledFormContainer onSubmit={handleSubmit} id="add-item-form">
          <h2>
            {editingItem ? "Edit Shopping Item" : "Add New Shopping Item"}
          </h2>
          {errors.name && (
            <StyledErrorMessage>{errors.name}</StyledErrorMessage>
          )}
          <StyledLabel htmlFor="name">Item Name</StyledLabel>
          <StyledInput
            type="text"
            id="name"
            name="name"
            defaultValue={editingItem?.name || ""}
          />
          {errors.quantity && (
            <StyledErrorMessage>{errors.quantity}</StyledErrorMessage>
          )}
          <StyledLabel htmlFor="quantity">Quantity</StyledLabel>
          <StyledInput
            type="number"
            id="quantity"
            name="quantity"
            defaultValue={editingItem?.quantity || ""}
          />
          {errors.category && (
            <StyledErrorMessage>{errors.category}</StyledErrorMessage>
          )}
          <StyledLabel htmlFor="category">Category</StyledLabel>
          <StyledSelect
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
          </StyledSelect>
          <StyledLabel htmlFor="comment">Comment</StyledLabel>
          <StyledInput
            type="text"
            id="comment"
            name="comment"
            placeholder="Optional"
            defaultValue={editingItem?.comment || ""}
          />
          <StyledButton type="submit">
            {editingItem ? "Save Changes" : "Add Item"}
          </StyledButton>
          <StyledButton type="reset" onClick={() => setIsFormVisible(false)}>
            Cancel
          </StyledButton>
        </StyledFormContainer>
      )}

      {totalItems === 0 && totalPurchased > 0 && (
        <div>All items have been purchased!</div>
      )}
      {totalItems === 0 && totalPurchased === 0 ? (
        <div>No shopping items. Add some items to get started.</div>
      ) : (
        <>
          <p>Total items: {totalItems}</p>
          <StyledItemDetailContainer>
            {nonPurchasedItems.map((item) => (
              <StyledItemCard key={item.id} category={item.category}>
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
                <StyledButton
                  onClick={() =>
                    handleEdit(item, setEditingItem, setIsFormVisible)
                  }
                >
                  Edit
                </StyledButton>
                <StyledButton
                  onClick={() => handleDelete(item.id, setDeletingItemId)}
                >
                  Delete
                </StyledButton>
                <input
                  type="checkbox"
                  title="Click to mark as purchased"
                  checked={item.isPurchased || false}
                  onChange={() => toggleMarkAsPurchased(item.id)}
                />
                Click to mark as purchased
              </StyledItemCard>
            ))}

            {totalPurchased > 0 && (
              <div ref={purchasedItemsRef}>
                <h2>Purchased Items</h2>

                <StyledButton onClick={() => scrollTo(topRef)}>
                  Back to Top
                </StyledButton>
                <p>Total purchased items: {totalPurchased}</p>
                {purchasedItems.map((item) => (
                  <StyledItemCard
                    key={item.id}
                    category={item.category}
                    className="purchased-item"
                  >
                    <div>
                      <h3 style={{ textDecoration: "line-through" }}>
                        {item.name}
                      </h3>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.isPurchased || false}
                      onChange={() => toggleMarkAsPurchased(item.id)}
                    />
                    Click again to unmark
                  </StyledItemCard>
                ))}
              </div>
            )}
          </StyledItemDetailContainer>
        </>
      )}

      {deletingItemId && (
        <StyledConfirmationMessage>
          <p>Are you sure you want to delete this item?</p>
          <StyledButton
            onClick={() =>
              confirmDelete(items, deletingItemId, setItems, setDeletingItemId)
            }
          >
            Yes, delete
          </StyledButton>
          <StyledButton onClick={() => cancelDelete(setDeletingItemId)}>
            Cancel
          </StyledButton>
        </StyledConfirmationMessage>
      )}
    </StyledShoppingList>
  );
}
