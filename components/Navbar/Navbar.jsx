import React, { useEffect, useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import Image from "next/image";
import { mainnet } from "wagmi/chains";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { Oval } from "react-loader-spinner";

//internal imports
import style from "./Navbar.module.scss";
import Sidebar from "./Sidebar/Sidebar";

const Navbar = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const [mounted, setMounted] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect, isLoading: isConnecting } = useConnect({
    connector: new MetaMaskConnector(),
    chainId: mainnet.id,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className={style.navbar}>
        <Image src="/eth.svg" alt="logo" height={50} width={50} />

        <div className={style.navbar_links}>
          <span>Swap</span>
          <span>Tokens</span>
          <span>Pool</span>
        </div>

        <button onClick={connect} disabled={isConnecting || isConnected}>
          {isConnecting ? (
            <div className={style.btn_connecting}>
              connecting
              <Oval
                height={21}
                width={21}
                color="#fff"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#fff"
                strokeWidth={3}
                strokeWidthSecondary={3}
              />
            </div>
          ) : isConnected && mounted ? (
            <span>
              {`${address.slice(0, 5)}...${address.slice(address.length - 4)}`}
            </span>
          ) : (
            "Connect wallet"
          )}
        </button>

        <div
          className={style.navbar_menuIcon}
          onClick={() => setOpenSidebar((prevState) => !prevState)}
        >
          <HiMenuAlt4 />
        </div>
      </div>
      {openSidebar && (
        <div className={style.navbar_sidebar}>
          <Sidebar setOpenSidebar={setOpenSidebar} />
        </div>
      )}
    </>
  );
};

export default Navbar;
