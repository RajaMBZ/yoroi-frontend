// @flow
import { SUPPORTED_CURRENCIES } from '../../app/config/coinPrice';
import { PrivateKey } from 'cardano-wallet';

const CURRENCIES = SUPPORTED_CURRENCIES.map(o => o.symbol);
let privKey = PrivateKey.from_hex('c8fc9467abae3c3396854ed25c59cc1d9a8ef3db9772f4cb0f074181ba4cad57eaa923bc58cbf6aff0aa34541e015d6cb6cf74b48d35f05f0ec4a907df64bad20000000000000000000000000000000000000000000000000000000000000000');

let pubKeyDataReplacement;
let pubKeyDataSignature;

function serializeTicker(ticker: ResponseTicker): Buffer {
  return new Buffer(ticker.from +
    ticker.timestamp +
    Object.keys(ticker.prices).sort().map(to => to + ticker.prices[to]).join(''),
    'utf8'
  );
}

export function installCoinPriceRequestHandlers(server) {
  server.get('/price/:from/current', (req, res) => {
    let prices = {};
    for (const currency of CURRENCIES) {
      prices[currency] = 1;
    }

    const ticker = {
        from: 'ADA',
        timestamp: Date.now(),
        prices 
    };
    ticker.signature = privKey.sign(serializeTicker(ticker)).to_hex();
    const response = { error: null, ticker };
    if (pubKeyDataReplacement) {
      response.pubKeyData = pubKeyDataReplacement;
      response.pubKeyDataSignature = pubKeyDataSignature;
    }
    res.send(response);
  });

  server.get('/price/:from/:timestamps', (req, res) => {
    const timestamps = req.params.timestamps.split(',').map(Number);
    res.send({
      error: null,
      tickers: timestamps.map(timestamp => {
        let prices = {};
        for (const currency of CURRENCIES) {
          prices[currency] = 1;
        }

        const ticker = {
          from: 'ADA',
          timestamp,
          prices
        };
        ticker.signature = privKey.sign(serializeTicker(ticker)).to_hex();
        return ticker;
      })
    });
  });
}

export function replaceKey(privKeyMaster, pubKeyData, privKeyData) {
  if (!privKeyMaster) {
    privKeyMaster = '7807bddb94f762ced05d2c65a954bba0c5b1972c7c90a04816fb3ce94613424fab23010c273d3d0e34ae3b644cc795d349439b8ead339cfbf35f0816038a7d4b0000000000000000000000000000000000000000000000000000000000000000';
  }
  if (!pubKeyData) {
    pubKeyData = '205395496e0489be7f441ece515f908738eeefb377dd89fb35a11a336e8017420000000000000000000000000000000000000000000000000000000000000000';
  }
  if (!privKeyData) {
    privKeyData = 'b02d80756fdb275f6e467f1b0eead5f1b4875d6db8855017a0a2f7addc888d4d1c0bcbb302230a8e9e3c3c44b90cd74f93e42e0deed7cba02f67d2d6e8e938680000000000000000000000000000000000000000000000000000000000000000';
  }
  privKey = PrivateKey.from_hex(privKeyData);
  pubKeyDataReplacement = pubKeyData;
  pubKeyDataSignature = PrivateKey.from_hex(privKeyMaster)
    .sign(new Buffer(pubKeyData))
    .to_hex();
}