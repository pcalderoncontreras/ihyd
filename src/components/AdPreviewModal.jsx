import React from 'react';

/**
 * Simple preview modal for advertisement posters.
 * Props:
 *   ad: { imageUrl: string, linkUrl?: string }
 *   onClose: () => void
 */
const AdPreviewModal = ({ ad, onClose }) => {
  const handleBackdropClick = (e) => {
    // Close when clicking on backdrop, but ignore clicks inside modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '85vh',
          background: '#000',
          boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
          borderRadius: '4px',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            background: '#222',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001,
            padding: 0,
            transition: 'background-color 0.2s, transform 0.2s, border-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ff4444';
            e.currentTarget.style.borderColor = '#ff4444';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#222';
            e.currentTarget.style.borderColor = '#fff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>
        <img
          src={ad.imageUrl}
          alt="Ad preview"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '70vh',
            objectFit: 'contain',
            display: 'block',
            backgroundColor: 'rgba(255,255,255,0.02)',
          }}
        />
      </div>
    </div>
  );
};

export default AdPreviewModal;
