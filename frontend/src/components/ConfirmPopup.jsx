import React from "react";
import { useThemeStore } from "../store/useThemeStore ";

const ConfirmPopup = ({ isOpen, friendName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-shadow">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-black">
        <h2 className="text-lg font-semibold mb-4">Confirm Removal</h2>
        <p className="mb-6">
          Are you sure you want to remove{" "}
          <span className="font-bold">{friendName}</span> from your friends?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
