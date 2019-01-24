	 function log(message) {
    $('#log').append($('<p>').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }
  function error(message) {
    $('#log').append($('<p>').addClass('dark-red').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }
  function waitForReceipt(hash, cb) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (err) {
        error(err);
      }
      if (receipt !== null) {
        // Transaction went through
        if (cb) {
          cb(receipt);
        }
      } else {
        // Try again in 1 second
        window.setTimeout(function () {
          waitForReceipt(hash, cb);
        }, 1000);
      }
    });
  }
  const address = "0x59c7aec0db2918f0717c8a62a36d4edb6f32a309";
  const abi =[{"constant":false,"inputs":[{"name":"_displayName","type":"string"},{"name":"_imageUrl","type":"string"}],"name":"createGravatar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_imageUrl","type":"string"}],"name":"updateGravatarImage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_displayName","type":"string"}],"name":"updateGravatarName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"created","type":"bool"},{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"displayName","type":"string"},{"indexed":false,"name":"imageUrl","type":"string"}],"name":"NewGravatar","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"displayName","type":"string"},{"indexed":false,"name":"imageUrl","type":"string"}],"name":"UpdatedGravatar","type":"event"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getGravatarImage","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getGravatarName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"gravatars","outputs":[{"name":"owner","type":"address"},{"name":"displayName","type":"string"},{"name":"imageUrl","type":"string"},{"name":"created","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}];
  $(function () {
    var gravatar;
    $('#getAvatarDetails').click(function (e) {
      e.preventDefault();
      gravatar.getGravatarName.call(document.getElementById("address").value, function (err, result1) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("getName").innerHTML = result1;
      });
    });
    $('#getAvatarDetails').click(function (e) {
      e.preventDefault();
            gravatar.getGravatarImage.call(document.getElementById("address").value, function (err, result2) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("getUrl").innerHTML = result2;
      });
     });
    $('#createGravatar').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      gravatar.createGravatar.sendTransaction(document.getElementById("displayName").value,document.getElementById("imageUrl").value,function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Transaction succeeded.");
        });
      });
    });
    $('#updateName').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      gravatar.updateGravatarName.sendTransaction(document.getElementById("name").value, function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Transaction succeeded.");
        });
      });
    });
    $('#updateImage').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      gravatar.updateGravatarImage.sendTransaction(document.getElementById("image").value, function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Transaction succeeded.");
        });
      });
    });
    if (typeof(web3) === "undefined") {
      error("Unable to find web3. " +
            "Please run MetaMask (or something else that injects web3).");
    } else {
      log("Found injected web3.");
      web3 = new Web3(web3.currentProvider);
      ethereum.enable();
      if (web3.version.network == 3) {
        error("Wrong network detected. Please switch to the Ropsten test network.");
      } else {
        log("Connected to the Ropsten test network.");
        gravatar = web3.eth.contract(abi).at(address);
        }
    }
  });
