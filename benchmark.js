const { generateKey } = require("crypto");
const nearAPI = require("near-api-js");
const { deployContract } = require("near-api-js/lib/transaction");
const { keyStores, KeyPair, WalletConnection, connect, utils } = nearAPI;
const fs = require('fs');
const path = require('path');
const { providers } = require("near-api-js");

fakedata = async () => {
    const keyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY =
        "3vAcfHdJU4qNARpVj6QrnW38EVx1mBrpjryyi94vDeWDcZRJanTHf3eCCcS7y3NuBmgUvMVLNXM7YbG5a2NNoZfB";
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
    fs.writeFileSync("key.txt", newKeyPair.secretKey + "|" + newKeyPair.publicKey)

    const amountInYocto = utils.format.parseNearAmount("1")

    for (let i = 0; i < 1000; i++) {
        try {
            let accountName = "test" + i + ".123.glx"
            await account.createAccount(
                accountName, // new account name
                newKeyPair.public_key, // public key for new account
                amountInYocto // initial balance for new account in yoctoNEAR
            );

            const amountInYoctoSend = utils.format.parseNearAmount("1000")
            await account.sendMoney(
                accountName, // receiver account
                amountInYoctoSend// amount in yoctoNEAR
            );
        }
        catch (e) { }
    }

}

benchmarkTransferFromOneAccount = async () => {
    const keyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY =
        "3vAcfHdJU4qNARpVj6QrnW38EVx1mBrpjryyi94vDeWDcZRJanTHf3eCCcS7y3NuBmgUvMVLNXM7YbG5a2NNoZfB";
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



benchmarkTransferFromMultiAccounts = async () => {
    filePath = path.join(__dirname, 'key.txt');
    fs.readFileS(filePath, { encoding: 'utf-8' }, async (err, data) => {
        if (!err) {
            const config = {
                networkId: "localnet",
                keyStore, // optional if not signing transactions
                nodeUrl: "https://validator.edsolabs.com",
                walletUrl: "https://wallet.testnet.near.org",
                helperUrl: "https://helper.testnet.near.org",
                explorerUrl: "https://explorer.edsolabs.com",
            };
            const near = await connect(config);
            const PRIVATE_KEY = data.split("|")[0];
            const keyStore = new keyStores.InMemoryKeyStore();
            const keyPair = KeyPair.fromString(PRIVATE_KEY);
            // adds the keyPair you created to keyStore
            let accounts = []

            for (let i = 0; i < 1000; i++) {
                let accountName = "test" + i + ".123.glx"
                await keyStore.setKey("localnet", accountName, keyPair);
                accounts[i] = await near.account(accountName);
            }
            const newKeyPair = KeyPair.fromRandom('ed25519')
            newKeyPair.public_key = newKeyPair.publicKey.toString().replace('ed25519:', '')
            let explicit = utils.PublicKey.fromString(newKeyPair.publicKey.toString()).data.hexSlice()

            for (let i = 0; i < 1000; i++) {

                const amountInYoctoSend = utils.format.parseNearAmount("1")
                try {
                    accounts[i].sendMoney(
                        explicit, // receiver account
                        amountInYoctoSend// amount in yoctoNEAR
                    );
                }
                catch (e) {
                    console.log("error: ", e);
                }
            }
        } else {
            console.log(err);
        }
    });


    // // creates a public / private key pair using the provided private key

}

fakedata()
//benchmarkTransferFromOneAccount()
//benchmarkTransferFromMultiAccounts()