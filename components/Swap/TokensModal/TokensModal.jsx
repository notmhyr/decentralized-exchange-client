import React, { useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";

//internal imports
import style from "./TokensModal.module.scss";
import tokenList from "../../../utils/tokenList.json";
import Image from "next/image";

const TokensModal = ({ isOpen, onClose, modifyToken }) => {
  return (
    isOpen && (
      <div className={style.modal} onClick={onClose}>
        <div className={style.modal_box} onClick={(e) => e.stopPropagation()}>
          <div className={style.modal_box_header}>
            <span>Select a token</span>
            <AiOutlineClose
              fontSize={20}
              onClick={onClose}
              className={style.modal_box_header_close}
            />
          </div>
          {tokenList.map((el, i) => (
            <div
              key={i}
              className={style.modal_box_item}
              onClick={() => modifyToken(el)}
            >
              <Image src={el.img} alt="asset logo" width={40} height={40} />
              <div className={style.modal_box_item_info}>
                <span>{el.name}</span>
                <span>{el.ticker}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default TokensModal;
