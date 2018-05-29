/**
 * Update the storage STATE.
 * @param {StorageUpdate} storage
 */
export function updateStorage(storage) {
  return {
    type: "UPDATE_STORAGE",
    storage
  };
}
