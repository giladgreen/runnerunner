import React from 'react';

export default function AreYouSure({
  onConfirm,
  onCancel,
  action,
  question,
}: {
  action: string;
  question?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="confirmation-modal-wrapper rtl"
      style={{ textAlign: 'right' }}
    >
      <div className="confirmation-modal">
        <div>
          <b>{action}</b>
        </div>
        {question && (
          <div style={{ fontSize: 16, marginTop: 20 }}>{question}</div>
        )}
        <div className="confirmation-modal-buttons">
          <button
            className="confirmation-modal-button rounded-md border p-2 hover:bg-gray-100"
            onClick={onCancel}
          >
            <span style={{ fontSize: 20 }}>שיניתי דעתי</span>
          </button>
          <button
            className="confirmation-modal-button rounded-md border p-2 hover:bg-gray-100"
            onClick={() => {
              onConfirm();
            }}
          >
            <span style={{ fontSize: 20 }}>בטוח</span>
          </button>
        </div>
      </div>
    </div>
  );
}
