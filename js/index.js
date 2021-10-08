"use strict";


// const firebaseConfig = {

// };

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount;
var ethaddress = ""; 

async function init() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "a1d2d05b386a403296580b00c8032130",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // key: "pk_test_C99A517CE7B79A76"
        key: "pk_live_A4C2D41D64B917E8"
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    theme: "dark"
  });

  // if (web3Modal.cachedProvider) {
  //   onConnect();
  // }
  // if (localStorage.getItem("walletProvider") !== null) {
  //   provider = JSON.parse(localStorage.getItem("walletProvider"));
  // }

  // document.getElementById("connect").style.display = "inline";
  console.log("Web3Modal instance is", web3Modal);
}

function joinWaitlist() {
  var x = getCookie('hasSent');
  if (true) {
    const urlParams = new URLSearchParams(window.location.search);
    var ref = urlParams.get('r');
    if (ref == null || ref == undefined) {
      ref = ""
    }
    const email = document.getElementById("email_field").value;
    var update_url = "https://us-central1-bitprofile-f37a0.cloudfunctions.net/joinWaitlist?email=" + email + "&ref=" + ref
    var xmlHttpUpdate = new XMLHttpRequest();
    xmlHttpUpdate.onreadystatechange = function() {
      if (xmlHttpUpdate.readyState == 4 && xmlHttpUpdate.status == 200){
        const json = JSON.parse(xmlHttpUpdate.responseText);
        if (json.status == "success") {
          const uid = json.ref_uid;
          window.location.href = "finish/?uid=" + uid
        }
      }
    }
    xmlHttpUpdate.open("GET", update_url, true);
    xmlHttpUpdate.send(null);
    setCookie('hasSent','sent',7);
  }
}

async function joinWaitlistWallet() {
  var x = getCookie('hasSent');
  // if (!x || x != "sent") {
  if (true) {  
    await web3Modal.clearCachedProvider()
    console.log("Opening a dialog", web3Modal);
    try {
      provider = await web3Modal.connect();

      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      if (accounts !== null) {
        console.log(accounts[0])
      }
    } catch(e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    ethaddress = accounts[0];

    if (!(ethaddress != null && ethaddress != undefined && ethaddress != "")) {
      alert("Ethereum wallet not valid")
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    var ref = urlParams.get('r');
    if (ref == null || ref == undefined) {
      ref = ""
    }
    const email = ethaddress;
    var update_url = "https://us-central1-bitprofile-f37a0.cloudfunctions.net/joinWaitlist?email=" + email + "&ref=" + ref
    var xmlHttpUpdate = new XMLHttpRequest();
    xmlHttpUpdate.onreadystatechange = function() {
      if (xmlHttpUpdate.readyState == 4 && xmlHttpUpdate.status == 200){
        const json = JSON.parse(xmlHttpUpdate.responseText);
        if (json.status == "success") {
          const uid = json.ref_uid;
          window.location.href = "finish/?uid=" + uid
        }
      }
    }
    xmlHttpUpdate.open("GET", update_url, true);
    xmlHttpUpdate.send(null);
    setCookie('hasSent','sent',7);
  }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setLineCounter() {
  var update_url = "https://us-central1-bitprofile-f37a0.cloudfunctions.net/lineLength"
  var xmlHttpUpdate = new XMLHttpRequest();
  xmlHttpUpdate.onreadystatechange = function() {
    if (xmlHttpUpdate.readyState == 4 && xmlHttpUpdate.status == 200){
      const json = JSON.parse(xmlHttpUpdate.responseText);
      if (json.status == "success") {
        const total = json.total;
        document.getElementById("queue_num").innerHTML = "<strong>Early Access:</strong> " + total + " people in line."
      }
    }
  }
  xmlHttpUpdate.open("GET", update_url, true);
  xmlHttpUpdate.send(null);
}


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  setLineCounter();
  document.querySelector("#email_button").addEventListener("click", joinWaitlist);
  document.querySelector("#address_button").addEventListener("click", joinWaitlistWallet);
});



function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}







