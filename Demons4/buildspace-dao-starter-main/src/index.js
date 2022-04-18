import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// 导入ThirdWebProvider和Rinkeby ChainId
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

// 这是你的dApp将使用的chainId。
const activeChainId = ChainId.Rinkeby;

// 使用thirdweb提供商包装您的应用程序
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);