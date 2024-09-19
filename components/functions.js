import { nanoid } from "nanoid";

export function handleFormData(form) {
  const formData = new FormData(form);
  const newItem = Object.fromEntries(formData.entries());
  newItem.quantity = parseInt(newItem.quantity) || 0;

  const formErrors = validateForm(newItem);
  return { newItem, formErrors };
}

export function validateForm(item) {
  const errors = {};
  if (!item.name) errors.name = "Name is required";
  if (item.quantity == null || item.quantity === "" || item.quantity <= 0)
    errors.quantity =
      "Quantity must be a positive number and cannot be null or empty.";
  if (!item.category || item.category === "default")
    errors.category = "Please select a category";
  return errors;
}

export function updateItemsState(newItem, items) {
  return [{ ...newItem, id: nanoid() }, ...items];
}

export function scrollToPurchasedItems() {
  const purchasedItemsSection = document.getElementById("purchased-items");
  if (purchasedItemsSection) {
    purchasedItemsSection.scrollIntoView({ behavior: "smooth" });
  }
}

export function handleCheckboxClick(
  itemId,
  items,
  purchasedItems,
  setItems,
  setPurchasedItems
) {
  const item = items.find((item) => item.id === itemId);
  if (item) {
    const purchasedItem = { ...item, purchased: true };
    setPurchasedItems([purchasedItem, ...(purchasedItems || [])]);
    setItems(items.filter((item) => item.id !== itemId));
  }
}

export function handleUnmarkClick(
  itemId,
  items,
  purchasedItems,
  setItems,
  setPurchasedItems
) {
  const purchasedItem = purchasedItems.find((item) => item.id === itemId);
  if (purchasedItem) {
    const item = { ...purchasedItem, purchased: false };
    setItems([item, ...(items || [])]);
    setPurchasedItems(purchasedItems.filter((item) => item.id !== itemId));
  }
}
