const { generateKey } = require("crypto");
const nearAPI = require("near-api-js");
const { deployContract } = require("near-api-js/lib/transaction");
const { keyStores, KeyPair, WalletConnection, connect, utils } = nearAPI;
const fs = require('fs');
const { providers } = require("near-api-js");

createAccount = async () => {
    const keyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY =
        "5bzjaRMyS3Na76xVLqqNVk9w9MTGWx9iy5JjYVMPPHieamCzBHRTWXusHWMhmQLq1y3U5Fq6KJiAAchSacjxntGg";
    // creates a public / private key pair using the provided private key
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    // adds the keyPair you created to keyStore
    await keyStore.setKey("testnet", "hieu1234.testnet", keyPair);

    const config = {
        networkId: "testnet",
        keyStore, // optional if not signing transactions
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };
    const near = await connect(config);
    const account = await near.account("hieu1234.testnet");

    const newKeyPair = KeyPair.fromRandom('ed25519')
    newKeyPair.public_key = newKeyPair.publicKey.toString().replace('ed25519:', '')
    console.log(newKeyPair)
    let explicit = utils.PublicKey.fromString(newKeyPair.publicKey.toString()).data.hexSlice()


    const amountInYocto = utils.format.parseNearAmount("1")

    await account.createAccount(
        "test8.hieu1234.testnet", // new account name
        newKeyPair.public_key, // public key for new account
        amountInYocto // initial balance for new account in yoctoNEAR
    );


    const amountInYoctoSend = utils.format.parseNearAmount("2")
    await account.sendMoney(
        "hieu12345.testnet", // receiver account
        amountInYoctoSend// amount in yoctoNEAR
    );

}

generateKeyImplicit = async () => {
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

function getTransactionStatus() {
    const provider = new providers.JsonRpcProvider(
        "https://validator.edsolabs.com"
    );

    const TX_HASH = "FqsiZ2CyywnDnPsbcUiun79MzowFDCisW9tuQoHmNvZJ";
    // account ID associated with the transaction
    const ACCOUNT_ID = "sender.testnet";
    for (let i = 0; i < 1; i++) {
        console.log(provider.txStatus(TX_HASH, ACCOUNT_ID));
    }
}




async function deployContract1() {
    const keyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY =
        "4Qnq3b9vhRAA6cMR8JYsTtcR7ZyGXi4Rk9fgZY4SbkTJWWrcGozEqdGeBDg2vniSRBdgqX6TTJwrYcUnvcTpmmQY";
    // creates a public / private key pair using the provided private key
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    // adds the keyPair you created to keyStore
    await keyStore.setKey("testnet", "hieu12345.testnet", keyPair);

    const config = {
        networkId: "testnet",
        keyStore, // optional if not signing transactions
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };
    const near = await connect(config);
    const account = await near.account("hieu12345.testnet");
    // const response = await account.deployContract(fs.readFileSync('./fungible_token.wasm'));
    // console.log(response);

    const contract = new nearAPI.Contract(
        account, // the account object that is connecting
        "hieu12345.testnet",
        {
            // name of contract you're connecting to
            viewMethods: ["ft_metadata", "ft_balance_of"], // view methods do not change state but usually return a value
            changeMethods: ["ft_transfer", "new", "storage_deposit"], // change methods modify state
            sender: account, // account object to initialize and sign transactions.
        }
    );
    console.log(contract)

    // await contract.new(
    //     {
    //         owner_id: "hieu12345.testnet",
    //         total_supply: "1000000000000000",
    //         metadata: {
    //             spec: "ft-1.0.0",
    //             name: "HPT",
    //             symbol: "HPT",
    //             decimals: 8
    //         }
    //     },
    //     "300000000000000", // attached GAS (optional)
    // );

    const amountInNEAR = utils.format.formatNearAmount("1");
    await contract.ft_transfer(
        {
            receiver_id: "hieu1234.testnet",
            amount: "100000000000"

        },
        "300000000000000", // attached GAS (optional)
        "1", // attached deposit in yoctoNEAR (optional),

    );
}

async function registerSM() {
    const keyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY =
        "5bzjaRMyS3Na76xVLqqNVk9w9MTGWx9iy5JjYVMPPHieamCzBHRTWXusHWMhmQLq1y3U5Fq6KJiAAchSacjxntGg";
    // creates a public / private key pair using the provided private key
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    // adds the keyPair you created to keyStore
    await keyStore.setKey("testnet", "hieu1234.testnet", keyPair);

    const config = {
        networkId: "testnet",
        keyStore, // optional if not signing transactions
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };
    const near = await connect(config);
    const account = await near.account("hieu1234.testnet");

    const contract = new nearAPI.Contract(
        account, // the account object that is connecting
        "hieu12345.testnet",
        {
            // name of contract you're connecting to
            viewMethods: ["ft_metadata", "ft_balance_of"], // view methods do not change state but usually return a value
            changeMethods: ["ft_transfer", "new", "storage_deposit"], // change methods modify state
            sender: account, // account object to initialize and sign transactions.
        }
    );
    console.log(contract)

    await contract.storage_deposit(
        {


        },
        "300000000000000", // attached GAS (optional)
        "1250000000000000000000", // attached deposit in yoctoNEAR (optional),

    );
}
//registerSM()
//deployContract1()
generateKeyImplicit()
//getTransactionStatus()
//createAccount()

