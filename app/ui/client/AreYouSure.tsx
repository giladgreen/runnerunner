import React from 'react';

export default function AreYouSure({
  onConfirm,
  onCancel,
  text,
  subtext,
}: {
  text: string;
  subtext?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="confirmation-modal-wrapper">
      <div className="confirmation-modal">
        <div>
          <b>{text}</b>
        </div>
        {subtext && <div style={{ fontSize: 13 }}>{subtext}</div>}
        <div className="confirmation-modal-buttons">
          <button
            className="confirmation-modal-button rounded-md border p-2 hover:bg-gray-100"
            onClick={onCancel}
          >
            <span>ביטול</span>
          </button>
          <button
            className="confirmation-modal-button rounded-md border p-2 hover:bg-gray-100"
            onClick={() => {
              onConfirm();
            }}
          >
            <span>כן</span>
          </button>
        </div>
      </div>
    </div>
  );
}
