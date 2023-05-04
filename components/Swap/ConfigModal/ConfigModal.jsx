import React, { useEffect, useRef, useState } from "react";

// internal imports
import style from "./ConfigModal.module.scss";

const ConfigModal = ({
  isOpen,
  onClose,
  settingRef,
  slippage,
  setSlippage,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // add click event listener to the window to close modal when clicked outside
      document.body.addEventListener("click", handleClickOutside);
    }

    return () => {
      // remove click event listener when the modal is closed
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function handleClickOutside(e) {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target) &&
      !settingRef.current.contains(e.target)
    ) {
      onClose();
    }
  }
  return (
    <>
      {isOpen && (
        <div className={style.modal} ref={modalRef}>
          <div className={style.modal_box}>
            <strong>settings</strong>
            <div className={style.modal_box_slippage}>
              <span>Slippage tolerance</span>
              <div className={style.modal_box_slippage_options}>
                <button
                  onClick={() => setSlippage(0.5)}
                  className={`${slippage == 0.5 ? style.activeBtn : ""}`}
                >
                  0.5%
                </button>
                <button
                  onClick={() => setSlippage(2.5)}
                  className={`${slippage == 2.5 ? style.activeBtn : ""}`}
                >
                  2.5%
                </button>
                <button
                  onClick={() => setSlippage(5)}
                  className={`${slippage == 5 ? style.activeBtn : ""}`}
                >
                  5.0%
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfigModal;
