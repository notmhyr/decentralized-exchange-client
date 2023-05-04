import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { mainnet } from "wagmi/chains";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
// internal imports
import style from "./Sidebar.module.scss";
import { Oval } from "react-loader-spinner";

const Sidebar = ({ setOpenSidebar }) => {
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
    <div className={style.sidebar}>
      <AiOutlineClose
        fontSize={26}
        className={style.sidebar_closeBtn}
        onClick={() => setOpenSidebar(false)}
      />
      <span>Swap</span>
      <span>Tokens</span>
      <span>Pool</span>

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
    </div>
  );
};

export default Sidebar;
