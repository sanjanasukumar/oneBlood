
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
 

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("ahack.json", function(a_hack) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.ahack = TruffleContract(a_hack);
      // Connect provider to interact with contract
      App.contracts.ahack.setProvider(App.web3Provider);

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.ahack.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.donorAddedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },


  
  render: function() {
    var ahackInstance;
    
    // Load contract data
    App.contracts.ahack.deployed().then(function(instance) {
      ahackInstance = instance;
      return ahackInstance.donorCount();
    }).then(function(donorCount) {
      var donorResults = $("#donorResults");
      donorResults.empty();

      for (var i = 1; i <= donorCount; i++) {
        ahackInstance.donor(i).then(function(donor) {
          var id = donor[0];
          var name = donor[1];
          var phno = donor[2];
          var blood_group = donor[3];
          
          // Render candidate Result
          var donorTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + phno + "</td><td>" + blood_group + "</td></tr>"
          donorResults.append(donorTemplate);

         
        });
      }
     
    })
  },

  print_donor: function() {
    var ahackInstance;
    var fdID=$('#rcaddr').val();
    // Load contract data
    App.contracts.ahack.deployed().then(function(instance) {
      ahackInstance = instance;
      return ahackInstance.donorCount();
    }).then(function(donorCount) {
      var donorResults = $("#bloodchain");
      donorResults.empty();

        ahackInstance.donor(fdID).then(function(donor) {
          var id = donor[0];
          var name = donor[1];

          // Render candidate Result
          var donorTemplate = "Donor ID is "+ id + "<br>Name is "+ name+"<br><i class='fas fa-arrow-down' style='font-size:48px;color:red'></i>";
          donorResults.append(donorTemplate);

         
        });
    })
  },

  print_bb: function() {
    App.print_donor()
    var ahackInstance;
    var fdID=$('#rcaddr').val();
    // Load contract data
    App.contracts.ahack.deployed().then(function(instance) {
      ahackInstance = instance;
      return ahackInstance.scount();
    }).then(function(scount) {
      var donorResults = $("#bloodchain");

      for (var i = 1; i <= scount; i++) {
        ahackInstance.sent(i).then(function(sent) {
          var id = sent[1];
          if(id == fdID)
          {
            var src = sent[2];
            var dest = sent[3];
            var donorTemplate = "<br>Packet moved from Blood bank"+ src + "<br>To Blood bank "+ dest+"<br><i class='fas fa-arrow-down' style='font-size:48px;color:red'></i>";
            donorResults.append(donorTemplate);
          }
         
        });
      }
    
    })
  },




  sen: function() {
    var id = $('#addr').val();
    var sbbid = $('#sbb').val();
    var dbbid = $('#dbb').val();
    //var date=new Date();
    App.contracts.ahack.deployed().then(function(instance) {
      return instance.s(id,sbbid,dbbid);
    }).then(function(result) {

    }).catch(function(err) {
      console.error(err);
    });
  },

  errCheck: function() {
    
    App.contracts.ahack.deployed().then(function(instance) {
      return instance.check();
    }).then(function(result) {
      
    }).catch(function(err) {
      console.error(err);
    });
  },

  errDispl: function() {
    var ahackInstance;
    App.errCheck();
    var er;
    App.contracts.ahack.deployed().then(function(instance) {
      ahackInstance = instance;
      return ahackInstance.e();
    }).then(function(e) {
        if(e==1)
        {
          document.getElementById("errorDiv").innerHTML="ERROR";
          //alert('Error');
        }
    }).catch(function(err) {
      console.error(err);
    });
  },

  recd: function() {
    var rid = $('#raddr').val();
    var rsbbid = $('#rsbb').val();
    var rdbbid = $('#rdbb').val();
   // var date=new Date();
    App.contracts.ahack.deployed().then(function(instance) {
      return instance.r(rid,rsbbid,rdbbid);
    }).then(function(result) {
      
    }).catch(function(err) {
      console.error(err);
    });
  },

  addDonors: function() {
    var did = $('#did').val();
    var name = $('#name').val();
    var phno = $('#phno').val();
    var bloodGroup = $('#bloodGroup').val();
    App.contracts.ahack.deployed().then(function(instance) {
      return instance.addDonor(did,name,phno,bloodGroup);
    }).then(function(result) {
      // Wait for votes to update
      // $("#content").hide();
      // $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  addRecpt: function() {
     var did = $('#rcaddr').val();
    var rname = $('#rname').val();
    var rphno = $('#rphno').val();
    var rbloodGroup = $('#rbloodGroup').val();
    var rhospital = $('#rhospital').val();
    //var date=new Date();
    App.contracts.ahack.deployed().then(function(instance) {
      return instance.addRecpt(did,rname,rphno,rbloodGroup,rhospital);
    }).then(function(result) {
      // Wait for votes to update
      // $("#content").hide();
      // $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});