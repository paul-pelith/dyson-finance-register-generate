import { useState } from 'react';
import { sign } from './tools';
import './App.css'; // Ensure to link the CSS file

interface ResultType {
  forSubmit: {
    parentSig: `0x${string}`;
    onceAddress: `0x${string}`;
    onceKey: `0x${string}`;
    deadline: number;
  };
  registerArgs: readonly [`0x${string}`, `0x${string}`, bigint];
  inviteCode: string;
}

const copyToClipboard = (text: string, callback: () => void) => {
  navigator.clipboard.writeText(text).then(callback).catch((err) => {
    console.error('Failed to copy: ', err);
  });
};


function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [state, setState] = useState<ResultType | undefined>(undefined);
  const [copiedText, setCopiedText] = useState('');

  const isContractAddressEntered = contractAddress.trim() !== '';

  async function createInviteCode() {
    if (!isContractAddressEntered) {
      alert('Please enter the ToGo contract address.');
      return;
    }
    const result = await sign(contractAddress);
    setState(result);
    setCopiedText('');
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    createInviteCode();
  }

  return (
    <div className="app-container">
      <div className="fixed-header">
        <div className="header-content">
          <h1>ToGo Invite Code Generator</h1>
          <form className="input-group" onSubmit={handleFormSubmit}>
            <input
              className="input-field"
              type="text"
              placeholder="Enter ToGo Contract Address Here"
              spellCheck="false"
              value={contractAddress}
              onChange={e => setContractAddress(e.currentTarget.value)}
            />
            <button 
              type="submit"
              className={`create-button ${isContractAddressEntered ? 'active' : ''}`}
              disabled={!isContractAddressEntered}
            >
              Create Invite Code
            </button>
          </form>
        </div>
      </div>
      <div className="content">
        {state && (
          <>
            <h2 className="step-title">Activate the code</h2>
            <section className="step">
              <ol>
                <li>
                  Go to <a href={`https://zkevm.polygonscan.com/address/${contractAddress}#writeContract`} target="_blank" rel="noopener noreferrer">Polygonscan</a> and click on "Connect to Web3" to connect your wallet by the ToGo owner.
                </li>
                <li>
                  In the 14th function "sign", enter the following <strong>digest (bytes32):</strong>
                  <div className='code-block'>
                    {state.forSubmit.parentSig}
                    <button 
                      className="copy-button" 
                      onClick={() => copyToClipboard(state.forSubmit.parentSig, () => setCopiedText('parentSig'))}
                    >
                      {copiedText === 'parentSig' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </li>
                <li>
                  Click on "Write" to submit the transaction.
                </li>
              </ol>
            </section>

            <h2 className="step-title">Verify and use the code</h2>
            <section className="step">
              <p>
                Once succeeded, the following invite code will be activated and can be used immediately:
                <br/><br/>
                Invite Code:   
              </p>
              <div className='code-block invite-code'>
                {state.inviteCode}
                <button 
                  className="copy-button" 
                  onClick={() => copyToClipboard(state.inviteCode, () => setCopiedText('inviteCode'))}
                >
                  {copiedText === 'inviteCode' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p>
                You can verify the invite code at{' '}
                <a href='https://app.dyson.finance/referral-program/membership' target='_blank' rel='noopener noreferrer'>
                  Dyson Finance Referral Program
                </a>.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
