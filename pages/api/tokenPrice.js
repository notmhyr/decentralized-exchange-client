const Moralis = require("moralis").default;

const startMoralis = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
};

const handler = async (req, res) => {
  const { addressOne, addressTwo } = req.query;
  try {
    if (!Moralis.Core.isStarted) {
      startMoralis();
    }
    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: addressOne,
    });
    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: addressTwo,
    });

    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice,
      tokenTwo: responseTwo.raw.usdPrice,
      ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
    };

    res.status(200).json(usdPrices);
  } catch (error) {
    console.log(error);
  }
};

export default handler;
