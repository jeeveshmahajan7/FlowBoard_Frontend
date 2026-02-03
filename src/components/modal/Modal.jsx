const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return;

  return ( 
    <>
      <dialog className="modal modal-bottom sm:modal-middle modal-open">
        <div className="modal-box">
          <button
            className="btn btn-circle btn-ghost absolute right-5 top-5"
            onClick={onClose}
          >
            &times; {/* Multiplication symbol */}
          </button>

          {children}
        </div>
        {/* To close the modal when clicked outside the modal */}
        <div className="modal-backdrop" onClick={onClose}></div>
      </dialog>
    </>
  );
};

export default Modal;
