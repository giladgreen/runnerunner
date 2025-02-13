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
      className="confirmation-modal-first-wrapper "
    >
      <div className="confirmation-modal-second-wrapper">
        <div className="confirmation-modal">
          <div>
            <b>{action}</b>
          </div>
          {question && (
            <div style={{ fontSize: 16, marginTop: 20 }}>{question}</div>
          )}
          <div className="confirmation-modal-buttons">
            <button
              className="confirmation-modal-button"
              onClick={onCancel}
            >
              <span>שיניתי דעתי</span>
            </button>
            <button
              className="confirmation-modal-button"
              onClick={() => {
                onConfirm();
              }}
            >
              <span>בטוח</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
