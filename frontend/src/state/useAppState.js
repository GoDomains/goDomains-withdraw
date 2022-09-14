import constate from 'constate';
import Contract from 'contracts/ABI.json';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';
import Onboard from 'bnc-onboard';
import { useWeb3React } from '@web3-react/core';
import { SafeAppConnector, useSafeAppConnection } from '@gnosis.pm/safe-apps-web3-react';
import { selectedWalletPersistence } from 'persistence';
import WALLETS from 'config/wallets';
import { InjectedConnector, NoEthereumProviderError } from '@yodaplus/injected-connector';
import {
  sendTransaction,
  sendTransactionHashOnly,
  WEB3_STATUS,
  currentNetwork,
  transformProviderFromXinfin,
  readOnlyWeb3
} from 'helpers/web3';

require('dotenv').config();

const safeAppConnector = new SafeAppConnector();

const POLL_INTERVAL = 1000;

const getOnboard = ({ onProvider }) => {
  const onboard = Onboard({
    networkId: currentNetwork.id,
    networkName: currentNetwork.name,
    subscriptions: {
      wallet: (wallet) => {
        if (wallet.provider && 'qrcodeModalOptions' in wallet.provider) {
          wallet.provider.connector._qrcodeModalOptions = {
            desktopLinks: []
          };
        }

        if (wallet.provider) {
          onProvider(transformProviderFromXinfin(wallet.provider));
        }
      }
    },
    walletSelect: {
      description: 'Please select a wallet to connect to Yodaplus Tokenization Platform',
      explanation:
        'Wallets are used to send, receive, and store digital assets. Wallets come in many forms. They are either built into your browser, an extension added to your browser, a piece of hardware plugged into your computer or even an app on your phone.',
      wallets: WALLETS
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' }
    ]
  });

  return onboard;
};

const useMultisigStatus = () => {
  const [isMultisig, setIsMultisig] = useState(null);

  useEffect(() => {
    safeAppConnector.isSafeApp().then(setIsMultisig);
  }, []);

  return { isMultisig };
};

const AppState = () => {
  const { activate, deactivate, active, account, library: walletWeb3, chainId } = useWeb3React();
  console.log('🚀 ~ file: useAppState.js ~ line 70 ~ AppState ~ account', account);
  const contractAddress = Contract.address;
  const contractABI = Contract.abi;
  const [status, setStatus] = useState(WEB3_STATUS.UNKNOWN);
  const [balance, setBalance] = useState('0');

  const { isMultisig } = useMultisigStatus();

  // const { throwErrorMessage } = useAppState();

  const web3 = walletWeb3 ?? readOnlyWeb3;

  if (!web3) {
    throw new Error('web3 must be available at this point');
  }

  const onProvider = useCallback(
    async (provider) => {
      setStatus(WEB3_STATUS.UNKNOWN);

      const connector =
        typeof provider.safe !== 'undefined'
          ? safeAppConnector
          : new InjectedConnector({ provider });

      try {
        await activate(connector, undefined, true);
        setStatus(WEB3_STATUS.READY);
      } catch (e) {
        if (e instanceof NoEthereumProviderError) {
          setStatus(WEB3_STATUS.UNAVAILABLE);
        }
      }
    },
    [activate]
  );

  const onboard = useMemo(() => getOnboard({ onProvider }), [onProvider]);

  const connectWallet = useCallback(
    async (wallet) => {
      const selected = await onboard.walletSelect(wallet);
      if (!selected) {
        return false;
      }

      const ready = await onboard.walletCheck();
      if (!ready) {
        return false;
      }

      const {
        wallet: { name }
      } = onboard.getState();

      selectedWalletPersistence.set(name);

      return true;
    },
    [onboard]
  );

  const disconnectWallet = async () => {
    onboard.walletReset();
    deactivate();
    selectedWalletPersistence.clear();
  };

  const contract = useMemo(
    () =>
      new web3.eth.Contract(currentNetwork.tokenContractAbi, currentNetwork.tokenContractAddress, {
        from: account,
        gasPrice: 1 * 10 ** 9
      }),
    [web3, account]
  );

  const wrapContractCall = useCallback(
    (func) => {
      return (...args) => {
        if (!contract) {
          throw new Error('Smart contract is not available');
        }

        return func(...args);
      };
    },
    [contract]
  );

  // eslint-disable-next-line
  const withdrawBalance = useCallback(
    wrapContractCall(() =>
      sendTransactionHashOnly(web3, contract.methods.withdraw()).catch((error) => {
        console.log('withdraw failed', error.message);
      })
    ),
    [wrapContractCall, web3, contract]
  );

  useEffect(() => {
    if (!web3 || !account) {
      setBalance('0');
      return () => {};
    }

    let timerId = null;
    let canceled = false;

    const poll = async () => {
      timerId = null;

      try {
        const balance_ = await web3.eth.getBalance(account);

        if (!canceled) {
          setBalance(balance_);
        }
      } catch (e) {
        console.warn(`Something is wrong when polling for account balance: ${e}`);
      }

      if (!canceled) {
        timerId = setTimeout(poll, POLL_INTERVAL);
      }
    };

    poll();

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }

      canceled = true;
    };
  }, [web3, account]);

  useEffect(() => {
    if (isMultisig === null || isMultisig === true) {
      return;
    }

    (async () => {
      const selectedWallet = selectedWalletPersistence.get();

      if (!selectedWallet) {
        return;
      }

      const connected = await connectWallet(selectedWallet);

      if (!connected) {
        selectedWalletPersistence.clear();
      }
    })();
    // eslint-disable-next-line
  }, [isMultisig]);

  return {
    isMultisig,
    status,
    active,
    account,
    chainId,
    web3,
    balance,
    connectWallet,
    disconnectWallet,
    withdrawBalance,
    contractAddress,
    contractABI
  };
};

export const [AppStateProvider, useAppState] = constate(AppState);
