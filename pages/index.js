import Head from "next/head";
import Image from "next/image";
import style from "../styles/Home.module.scss";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Swap from "../components/Swap/Swap";
import Services from "../components/Services/Services";
import Footer from "../components/Footer/Footer";

export default function Home() {
  return (
    <div className={style.home}>
      <div className={style.home_top}>
        <Navbar />
        <Swap />
      </div>

      <Services />
      <div className={style.home_placeholder}></div>
      <Footer />
    </div>
  );
}
