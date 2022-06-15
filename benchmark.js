const { generateKey } = require("crypto");
const nearAPI = require("near-api-js");
const { deployContract } = require("near-api-js/lib/transaction");
const { keyStores, KeyPair, WalletConnection, connect, utils } = nearAPI;
const fs = require('fs');
const { providers } = require("near-api-js");

benchmarkTransfer = async () => {
    const keyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY =
        "5z2mbZrZnqaQe5KnPKeHzZitAvwzPHLsQNE9d4VZDcVzJdpatyTxKBB5jNteri8YwqELDKEqwiGrugzfM2AQA7qZ";
    // creates a public / private key pair using the provided private key
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    // adds the keyPair you created to keyStore
    await keyStore.setKey("localnet", "123.glx", keyPair);

    const config = {
        networkId: "localnet",
        keyStore, // optional if not signing transactions
        nodeUrl: "https://validator.edsolabs.com",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.edsolabs.com",
    };
    const near = await connect(config);
    const account = await near.account("123.glx");


    const newKeyPair = KeyPair.fromRandom('ed25519')
    newKeyPair.public_key = newKeyPair.publicKey.toString().replace('ed25519:', '')
    console.log(newKeyPair)
    let explicit = utils.PublicKey.fromString(newKeyPair.publicKey.toString()).data.hexSlice()
    console.log("explicit ", explicit)


    const amountInYoctoSend = utils.format.parseNearAmount("1")
    for (let i = 0; i < 300; i++) {
        try {
            account.sendMoney(
                explicit, // receiver account
                amountInYoctoSend// amount in yoctoNEAR
            );
            //sleep(700);
        }
        catch (e) {
            // account.sendMoney(
            //     explicit, // receiver account
            //     amountInYoctoSend// amount in yoctoNEAR
            // );
        }
    }
}

benchmarkTransfer()