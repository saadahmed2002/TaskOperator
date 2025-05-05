'use client';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {

    //   const [confirmDialog, setConfirmDialog] = useState({
    //     isOpen: false,
    //     title: '',
    //     message: '',
    //     onConfirm: () => {},
    //   });
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
