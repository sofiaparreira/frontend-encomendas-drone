import React, { useState } from 'react';

const DeleteModal = ({ 
  onClose, 
  title = "Deactivate account", 
  message = "Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.",
  confirmText = "Deactivate",
  cancelText = "Cancel",
  onConfirm,
  type = "danger" 
}) => {



  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500/10 text-red-400';
      case 'success':
        return 'bg-green-500/10 text-green-400';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'info':
        return 'bg-blue-500/10 text-blue-400';
      default:
        return 'bg-red-500/10 text-red-400';
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-400';
      case 'success':
        return 'bg-green-500 hover:bg-green-400';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-400';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-400';
      default:
        return 'bg-red-500 hover:bg-red-400';
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/50 transition-opacity"
        onClick={handleBackdropClick}
      />
      
      {/* Dialog container */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all sm:my-8 sm:w-full sm:max-w-lg">
          
          {/* Dialog content */}
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              
              {/* Icon */}
              <div className={`mx-auto flex size-12 shrink-0 items-center justify-center rounded-full ${getIconColor()} sm:mx-0 sm:size-10`}>
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  className="size-6"
                >
                  <path 
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
              
              {/* Text content */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-base font-semibold text-white">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleConfirm}
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white ${getConfirmButtonColor()} sm:ml-3 sm:w-auto transition-colors`}
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto transition-colors"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;