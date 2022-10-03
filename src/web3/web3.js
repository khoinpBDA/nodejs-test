const Web3 = require('web3');
const BreakContract = require('../../contract/BreakApi');
const address = process.env.OPERATOR_PUBLIC_KEY
const privateKey = process.env.OPERATOR_PRIVATE_KEY
const bscUrl = process.env.RPC_URL

//Hard way (web3#signTransaction() + web3#sendSignedTransaction())
const run = async () => {
  const web3 = new Web3(bscUrl)
  const networkId = process.env.NETWORK_ID
  const myContract = new web3.eth.Contract(
    BreakContract,
    process.env.BREAK_CONTRACT
  );

  const tx = myContract.methods.balanceOf('0xc480A3c2bBb038AbC9D956460CdDC81c426f998f')
  //balanceOf
//   const gas = await tx.estimateGas({from: address});
//   const gasPrice = await web3.eth.getGasPrice();
//   const data = tx.encodeABI();
//   const nonce = await web3.eth.getTransactionCount(address);

//   const signedTx = await web3.eth.accounts.signTransaction(
//     {
//       to: myContract.options.address, 
//       data,
//       gas,
//       gasPrice,
//       nonce, 
//       chainId: networkId
//     },
//     privateKey
//   );
//   const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
//   console.log(`Transaction hash: ${receipt.transactionHash}`);
    await tx.call((err,res)=>{
        if (err) {
            console.log("An error occured", err)
            return
          }
          console.log("The balance is: ", res)
    })
}

module.exports = {run}

