import React from "react";

//internal imports
import style from "./Footer.module.scss";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footer_box}>
        <div className={style.footer_box_row1}>
          <div className={style.footer_box_row1_img}>
            <Image src="/eth.svg" alt="logo" height={40} width={40} />
          </div>
          <div className={style.footer_box_row1_links}>
            <span>Swap</span>
            <span>Tokens</span>
            <span>Pool</span>
          </div>
        </div>

        <div className={style.footer_box_row2}>
          <p>Come join us and hear for the unexpected miracle</p>
          <p>example@gmail.com</p>
        </div>

        <div className={style.footer_box_row3}>
          <span>@mahyar</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
