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
