import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TiArrowSortedDown } from "react-icons/ti";
import { FiSettings } from "react-icons/fi";
import { HiArrowsUpDown } from "react-icons/hi2";
import axios from "axios";
import {
  useAccount,
  useContractWrite,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { ethers, BigNumber } from "ethers";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { erc20ABI } from "wagmi";

import { AlphaRouter, SwapType } from "@uniswap/smart-order-router";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import JSBI from "jsbi";

//internal imports
import style from "./Swap.module.scss";
import ConfigModal from "./ConfigModal/ConfigModal";
import TokensModal from "./TokensModal/TokensModal";
import tokenList from "../../utils/tokenList.json";

const convertToWei = (amount, decimals) => {
  if (!amount) {
    amount = "0";
  }
  return ethers.utils.parseUnits(amount, decimals);
};

const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

const chainId = 1;
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
);

const router = new AlphaRouter({
  chainId: chainId,
  provider: provider,
});

const Swap = () => {
  const [openSetting, setOpenSetting] = useState(false);
  const [openTokenList, setOpenTokenList] = useState(false);
  const [slippage, setSlippage] = useState(2.5);
  const [token, setToken] = useState(1);
  const [token1, setToken1] = useState(tokenList[1]);
  const [token2, setToken2] = useState(tokenList[2]);
  const [token1Amount, setToken1Amount] = useState(0);
  const [token2Amount, setToken2Amount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState(null);
  const [transaction, setTransaction] = useState({
    data: null,
    to: null,
    value: null,
  });

  const { address, isConnected } = useAccount();
  const settingRef = useRef(null);

  const { data: txData, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: String(transaction.to),
      data: String(transaction.data),
      value: String(transaction.value),
    },

    onError(e) {
      setLoading(false);
      toast.error(e.reason);
    },
  });

  const { isLoading: isSwapLoading } = useWaitForTransaction({
    hash: txData?.hash,

    onSuccess() {
      toast.success("Transaction successful");
      setToken1Amount(0);
      setToken2Amount(0);
      setLoading(false);
    },
    onError(e) {
      setLoading(false);
      toast.error(e.reason);
    },
  });

  const { data: approveData, write: approve } = useContractWrite({
    address: token1.address,
    abi: erc20ABI,
    functionName: "approve",
    args: [
      V3_SWAP_ROUTER_ADDRESS,
      convertToWei(token1Amount.toString(), token1.decimals),
    ],

    onError(e) {
      setLoading(false);
      toast.error(e.reason);
    },
  });

  const { isLoading: isApproveLoading } = useWaitForTransaction({
    hash: approveData?.hash,

    onSuccess() {
      toast.success("Approved tokens successfully");
      if (transaction.to) {
        sendTransaction?.();
      }
    },
    onError(e) {
      setLoading(false);
      toast.error(e.reason);
    },
  });

  const onAmountChange = (e) => {
    setToken1Amount(e.target.value);

    if (e.target.value && prices) {
      setToken2Amount((e.target.value * prices.ratio).toFixed(2));
    } else {
      setToken2Amount(0);
    }
  };

  const fetchPrices = async (addressOne, addressTwo) => {
    const { data } = await axios.get("/api/tokenPrice", {
      params: { addressOne, addressTwo },
    });

    setPrices(data);
  };

  const openModal = (asset) => {
    setToken(asset);
    setOpenTokenList(true);
  };

  const modifyToken = (el) => {
    setPrices(null);
    setToken1Amount(0);
    setToken2Amount(0);

    if (token == 1) {
      setToken1(el);
      fetchPrices(el.address, token2.address);
    } else {
      setToken2(el);
      fetchPrices(token1.address, el.address);
    }
    setOpenTokenList(false);
  };

  const switchToken = () => {
    setPrices(null);
    setToken1Amount(0);
    setToken2Amount(0);

    const one = token1;
    const two = token2;
    setToken2(one);
    setToken1(two);

    fetchPrices(two.address, one.address);
  };

  // fetch required data to send as transaction with 1inch aggregator
  const swapTokens = async () => {
    if (!token1Amount) {
      toast.error("Please enter some amount");
      return;
    }

    setLoading(true);

    try {
      const inputToken = new Token(
        chainId,
        token1.address,
        token1.decimals,
        token1.ticker,
        token1.name
      );
      const outputToken = new Token(
        chainId,
        token2.address,
        token2.decimals,
        token2.ticker,
        token2.name
      );

      const inputAmountInWei = convertToWei(
        token1Amount.toString(),
        token1.decimals
      );

      const inputAmount = CurrencyAmount.fromRawAmount(
        inputToken,
        JSBI.BigInt(inputAmountInWei)
      );

      const route = await router.route(
        inputAmount,
        outputToken,
        TradeType.EXACT_INPUT,
        {
          recipient: address,
          slippageTolerance: new Percent(slippage * 10, 1000),
          deadline: Math.floor(Date.now() / 1000 + 1800),
          type: SwapType.SWAP_ROUTER_02,
        }
      );

      const swapTx = {
        data: route.methodParameters.calldata,
        to: V3_SWAP_ROUTER_ADDRESS,
        value: BigNumber.from(route.methodParameters.value),
        from: address,
        gasPrice: BigNumber.from(route.gasPriceWei),
        gasLimit: ethers.utils.hexlify(21000),
      };

      setTransaction(swapTx);

      approve?.();
    } catch (error) {
      toast.error("somthing went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPrices(token1.address, token2.address);
  }, []);

  return (
    <div className={style.swap}>
      {openTokenList && (
        <TokensModal
          isOpen={openTokenList}
          onClose={() => setOpenTokenList(false)}
          modifyToken={modifyToken}
        />
      )}
      <div className={style.swap_left}>
        <h1>
          Send Crypto <br /> across the world
        </h1>
        <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
          Explore the crypto world. Buy and sell cryptocurrencies easily on dex
        </p>

        <div className={style.swap_left_services}>
          <div
            className={style.swap_left_services_item}
            style={{ borderTopLeftRadius: "1rem" }}
          >
            Reliability
          </div>
          <div className={style.swap_left_services_item}>Security</div>
          <div
            className={style.swap_left_services_item}
            style={{ borderTopRightRadius: "1rem" }}
          >
            Ethereum
          </div>
          <div
            className={style.swap_left_services_item}
            style={{ borderBottomLeftRadius: "1rem" }}
          >
            Web 3.0
          </div>
          <div className={style.swap_left_services_item}>Low Fees</div>
          <div
            className={style.swap_left_services_item}
            style={{ borderBottomRightRadius: "1rem" }}
          >
            Blockchain
          </div>
        </div>
      </div>

      <div className={style.swap_right}>
        <div className={style.swap_right_header}>
          <span>Swap</span>
          <div
            onClick={() => setOpenSetting((prevState) => !prevState)}
            ref={settingRef}
          >
            <FiSettings
              fontSize={18}
              className={style.swap_right_header_icon}
            />
          </div>
        </div>
        <div className={style.swap_right_box}>
          <input
            type="number"
            placeholder="0"
            value={token1Amount}
            onChange={onAmountChange}
          />
          <div
            className={style.swap_right_box_asset}
            onClick={() => openModal(1)}
          >
            <Image src={token1.img} alt="asset logo" width={25} height={25} />
            <span>{token1.ticker}</span>
            <TiArrowSortedDown />
          </div>

          {openSetting && (
            <ConfigModal
              onClose={() => setOpenSetting(false)}
              isOpen={openSetting}
              settingRef={settingRef}
              slippage={slippage}
              setSlippage={setSlippage}
            />
          )}
        </div>

        <div className={style.swap_right_switchToken} onClick={switchToken}>
          <HiArrowsUpDown fontSize={24} />
        </div>

        <div className={style.swap_right_box}>
          <input placeholder="0" value={token2Amount} disabled={true} />

          <div
            className={style.swap_right_box_asset}
            onClick={() => openModal(2)}
          >
            <Image src={token2.img} alt="asset logo" width={25} height={25} />
            <span>{token2.ticker}</span>
            <TiArrowSortedDown />
          </div>
        </div>
        <button
          className={style.swap_right_btn}
          disabled={loading}
          onClick={() => {
            if (isConnected) {
              swapTokens();
            } else {
              toast.error("Please connect your wallet");
            }
          }}
        >
          {loading ? (
            <div className={style.swap_right_btn_pending}>
              Pending{" "}
              <ThreeDots
                height="25"
                width="25"
                radius="9"
                color="#fff"
                ariaLabel="three-dots-loading"
                visible={true}
              />
            </div>
          ) : (
            "Swap"
          )}
        </button>
      </div>
    </div>
  );
};

export default Swap;
