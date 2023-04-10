import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "../Constant/Abi.json";
import "../App.css";

function Main() {
  const [metamaskAccount, setMetamaskAccount] = useState(null);
  const [address, setAddress] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [dec, setDec] = useState(null);
  const [name, setName] = useState(null);

  async function connect() {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error("Metamask not detected");
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Metamask connected successfully with accounts", accounts);
      setMetamaskAccount(accounts[0]);
    } catch (error) {
      console.error("Metamask connection error:", error.message);
      throw error;
    }
  }
  async function getData() {
    try {
      if (!address) {
        return alert("Input Required !");
      }
      if (typeof window.ethereum !== "undefined") {
        await connect();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(address, ABI, provider);
        const sy = await contract.symbol();
        const dec = await contract.decimals();
        const supply = await contract.totalSupply();
        const name = await contract.name();
        setName(name);
        setDec(dec);
        setTotalSupply(supply);
        setSymbol(sy);
      }
    } catch (error) {
      alert("Error Occured Check Console");
      console.log(error);
      console.log(error.message);
    }
  }

  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid mx-4">
          <a class="navbar-brand" href="#">
            Token Finder
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              {metamaskAccount !== null ? (
                <button className="btn btn-info">Connected</button>
              ) : (
                <button className="btn btn-info" onClick={connect}>
                  Connect Wallet
                </button>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="App-header">
        <div class="row g-3 align-items-center my-2">
          <div class="col-auto">
            <label for="inputPassword6" class="col-form-label">
              Address
            </label>
          </div>
          <div class="col-auto">
            <input
              type="text"
              id="inputPassword6"
              placeholder="Token Address"
              class="form-control"
              aria-describedby="passwordHelpInline"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div class="col-auto">
            <span id="passwordHelpInline" class="form-text">
              <button className="btn btn-info" onClick={getData}>
                Search
              </button>
            </span>
          </div>

          <div className="d-flex bg-white text-dark border rounded p-3 ">
            <div style={{ maxWidth: "200px" }}>
              <h3>Name:</h3>
              <h3>Total Supply:</h3>
              <h3>Symbol:</h3>
              <h3>Decimals:</h3>
            </div>
            <div className="ms-3">
              <h3>{name && name}</h3>
              <h3>{totalSupply && (totalSupply / 10 ** dec).toFixed(0)}</h3>
              <h3>{symbol && symbol}</h3>
              <h3>{dec && dec}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
