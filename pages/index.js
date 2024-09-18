import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import initialItems from "@/public/assets/shopping-items.json";
import categories from "@/public/assets/categories.json";
import useLocalStorageState from "use-local-storage-state";
import {
  StyledButton,
  StyledButtonContainer,
  StyledConfirmationDialog,
  StyledErrorMessage,
  StyledInput,
  StyledLabel,
  StyledShoppingList,
  StyledSelect,
  StyledFormContainer,
  StyledItemCard,
  StyledItemDetailContainer,
} from "@/components/StyledComponents";
import {
  handleFormData,
  updateItemsState,
  scrollToPurchasedItems,
  handleCheckboxClick,
  handleUnmarkClick,
} from "@/components/functions";

function ShoppingList() {
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

  const topRef = useRef(null);

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const TotalPurchased = (purchasedItems || []).reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    if ((items || []).length === 0) {
      const processedItems = initialItems.map((item) => ({
        ...item,
        category: item.category.toLowerCase(),
      }));
      setItems(processedItems);
    }
  }, []);

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
        setItems(updateItemsState(newItem, items));
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

          {TotalPurchased > 0 && (
            <StyledButton onClick={scrollToPurchasedItems}>
              Purchased Items ({TotalPurchased})
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

      {totalItems === 0 && TotalPurchased > 0 && (
        <div>All items have been purchased!</div>
      )}
      {totalItems === 0 && TotalPurchased === 0 ? (
        <div>No shopping items. Add some items to get started.</div>
      ) : (
        <>
          <p>Total items: {totalItems}</p>
          <StyledItemDetailContainer>
            {items.map((item) => (
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
                <StyledButton onClick={() => handleEdit(item)}>
                  Edit
                </StyledButton>
                <StyledButton onClick={() => handleDelete(item.id)}>
                  Delete
                </StyledButton>
                <input
                  type="checkbox"
                  title="Click to mark as purchased"
                  checked={item.purchased || false}
                  onChange={() =>
                    handleCheckboxClick(
                      item.id,
                      items,
                      purchasedItems,
                      setItems,
                      setPurchasedItems
                    )
                  }
                />
                Click to mark as purchased
              </StyledItemCard>
            ))}

            {TotalPurchased > 0 && (
              <div id="purchased-items">
                <h2>Purchased Items</h2>
                <StyledButton onClick={scrollToTop}>Back to Top</StyledButton>
                <p>Total purchased items: {TotalPurchased}</p>
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
                      checked={item.purchased || false}
                      onChange={() =>
                        handleUnmarkClick(
                          item.id,
                          items,
                          purchasedItems,
                          setItems,
                          setPurchasedItems
                        )
                      }
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
        <StyledConfirmationDialog>
          <p>Are you sure you want to delete this item?</p>
          <StyledButton onClick={confirmDelete}>Yes, delete</StyledButton>
          <StyledButton onClick={cancelDelete}>Cancel</StyledButton>
        </StyledConfirmationDialog>
      )}
    </StyledShoppingList>
  );
}

export default ShoppingList;
