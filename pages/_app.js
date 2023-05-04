import Head from "next/head";
import "../styles/globals.scss";
import { mainnet, goerli } from "wagmi/chains";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  const { provider, webSocketProvider } = configureChains(
    [mainnet],
    [
      infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY }),
      publicProvider(),
    ]
  );

  const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
  });

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <WagmiConfig client={client}>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="dark"
        />

        <Component {...pageProps} />
      </WagmiConfig>
    </>
  );
}

export default MyApp;
