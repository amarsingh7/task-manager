function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {

   return (
       isOpen ? (
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl pb-2 font-semibold mb-4 text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-500">{title}</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
            <div className="flex justify-end space-x-4">
               <button
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
               >Cancel</button>
               <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
               >Confirm</button>
            </div>
         </div>
      </div>  ) : ( 
         null
       )
   )

}
export default ConfirmDialog;