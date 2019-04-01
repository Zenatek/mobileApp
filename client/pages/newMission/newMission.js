Template.slideMeteo.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('allMissions')
    });
});

Template.slideVento.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('allMissions')
    });
});

Template.newMission.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('allPilots');
        this.subscribe('allMissions')
    });
});

Template.slideMeteo.helpers({
    missions : function(){
        missionId = Session.get('missionId')
        return Missions.findOne({_id : missionId})
    },
    editSession : function(){
        return  Session.get('editSession')

    }
});

Template.slideMeteo.events({
    'ionChange' : function(event,template,value){
        value = template.find('#rangeMeteo').value;
        if(value == 0){return template.find('#weather').innerHTML = "Sereno" }
        if(value == 1){return template.find('#weather').innerHTML = "Poco nuvoloso" }
        if(value == 2){return template.find('#weather').innerHTML = "Nuvoloso" }
        if(value == 3){return template.find('#weather').innerHTML = "Pioggia debole" }
        if(value == 4){return template.find('#weather').innerHTML = "Pioggia" }
        if(value == 5){return template.find('#weather').innerHTML = "Temporale" }
    }
});

Template.slideVento.helpers({
    missions : function(){
        missionId = Session.get('missionId')
        return Missions.findOne({_id : missionId})
    },
    editSession : function(){
        return  Session.get('editSession')

    }
});

Template.slideVento.events({
    'ionChange' : function(event,template,value){
        value = template.find('#rangeVento').value;
        if(value == 0){return template.find('#wind').innerHTML = "Calmo [1 km/h]" }
        if(value == 1){return template.find('#wind').innerHTML = "Bava di vento [5 km/h]" }
        if(value == 2){return template.find('#wind').innerHTML = "Brezza leggera [11 km/h]" }
        if(value == 3){return template.find('#wind').innerHTML = "Brezza [19 km/h]" }
        if(value == 4){return template.find('#wind').innerHTML = "Brezza vivace [28 km/h]" }
        if(value == 5){return template.find('#wind').innerHTML = "Brezza tesa [39 km/h]" }
        if(value == 6){return template.find('#wind').innerHTML = "Vento fresco [49 km/h]" }
        if(value == 7){return template.find('#wind').innerHTML = "Vento forte [61 km/h]" }
    }
});



Template.pilotsLIST.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('allMissions')
    });
});

Template.newMission.helpers({
    missions : function(){
        missionId = Session.get('missionId')
        return Missions.findOne({_id : missionId})
    },
    editSession : function(){
        return  Session.get('editSession')

    },
    editPilots : function(){
        return  Session.get('editPilots')

    }
});

var pilotsList = [];

Template.pilotsLIST.helpers({
    update : function(){
        var z = Session.get("updatePilots");
        Session.set("updatePilots", false);
        return z;
    },
    pilotsList : function(){
            return pilotsList;
    },
    missions : function(){
        missionId = Session.get('missionId')
        return Missions.findOne({_id : missionId})
    },
    editSession : function(){
        return  Session.get('updatePilots', true);

    }
});

Template.pilotsLIST.events({
    'click .delete' : function(e,t){
        e.preventDefault();
        console.log(this.profile.lastname)
        console.log(pilotsList)
        pilotsList.splice(pilotsList.indexOf(this),1);
        console.log(pilotsList)
        Session.set("updatePilots", true);


    }
});

Template.newMission.events({
    'click .back': function(event, template){
        Session.set('editSession',false)
        event.preventDefault();
        Session.set("simulation", false);
        Session.set("certB", false);
        Session.set("certC", false);
        Session.set("certL", false);
        Session.set("certVL", false);
        Session.set("v70", false);
        Session.set("v150", false);
        Session.set("vlos", false);
        Session.set("blos", false);
        Session.set("evlos", false);
        pilotsList = []
        delete Session.keys['editSession']
        delete Session.keys['editPilots']
        delete Session.keys['missionId']
        FlowRouter.go('/operator/missionsList');
    },
    'click .insert': function(event, template){
        event.preventDefault();
        Session.set('editSession',false)
        var flightNumberVar = template.find('#flight_number').value;
        var placeVar = template.find('#place').value;
        var flightDateVar = template.find('#flight_date').value;
        var windVar = template.find('#wind').innerHTML;
        var weatherVar = template.find('#weather').innerHTML;
        var takeOffTimeVar = template.find('#take_off_time').value;
        var landingTimeVar = template.find('#landing_time').value;
        var rpasVar = template.find('#rpas').value;
        var battery1Var = template.find('#battery1').value;
        var simulation = Session.get("simulation");
        var v70 = Session.get("v70");
        var v150 = Session.get("v150");
        var vlos = Session.get("vlos");
        var blos = Session.get("blos");
        var evlos = Session.get("evlos");
        var certB = Session.get("certB");
        var certC = Session.get("certC");
        var certL = Session.get("certL");
        var certVL = Session.get("certVL");
        var userID = Meteor.userId();
        var missionId = Session.get('missionId')
                

        var pilotsID = [];
        var pilotsFName = [];
        var pilotsLName = [];
        pilotsList.forEach(element => {
            pilotsID.push(element._id);
            pilotsFName.push(element.profile.firstname);
            pilotsLName.push(element.profile.lastname);
            console.log(pilotsFName);
        });
        if(!missionId){
        Missions.insert({createdAt : new Date(),
            owner : userID,
            flightNumber : flightNumberVar,
            place : placeVar,
            flightDate : flightDateVar,
            wind : windVar,
            weather : weatherVar,
            takeOffTime : takeOffTimeVar,
            landingTime : landingTimeVar,
            rpas : rpasVar,
            battery1 : battery1Var,
            pilotsID : pilotsID,
            pilotsFName : pilotsFName,
            pilotsLName : pilotsLName,
            simulation : simulation,
            v70 : v70,
            v150 : v150,
            vlos : vlos,
            blos : blos,
            evlos : evlos,
            certB : certB,
            certC : certC,
            certL : certL,
            certVL : certVL
        });
    }else{
        Missions.update({_id : missionId},
            {$set:
                {
                "flightNumber" : flightNumberVar,
                "place" : placeVar,
                "flightDate" : flightDateVar,
                "wind" : windVar,
                "weather" : weatherVar,
                "takeOffTime" : takeOffTimeVar,
                "landingTime" : landingTimeVar,
                "rpas" : rpasVar,
                "battery1" : battery1Var,
                "pilotsID" : pilotsID,
                "pilotsFName" : pilotsFName,
                "pilotsLName" : pilotsLName,
                "simulation" : simulation,
                "v70" : v70,
                "v150" : v150,
                "vlos" : vlos,
                "blos" : blos,
                "evlos" : evlos,
                "certB" : certB,
                "certC" : certC,
                "certL" : certL,
                "certVL" : certVL
                }
            }
                
        );
    }
        pilotsList = []
        delete Session.keys['editSession']
        delete Session.keys['editPilots']
        delete Session.keys['missionId']
        delete Session.keys['certB']
        delete Session.keys['certL']
        delete Session.keys['certVL']
        delete Session.keys['certC']
        delete Session.keys['v70']
        delete Session.keys['v150']
        delete Session.keys['vlos']
        delete Session.keys['blos']
        delete Session.keys['evlos']
        FlowRouter.go('/operator/missionsList');
    },
    'change input[type=checkbox]': function(event, template) {
        if ($(event.target).prop("name") == "simulation"){
            var simulation = event.target.checked;
            Session.set("simulation", simulation);
            console.log(Session.get("simulation"));
        }
        if ($(event.target).prop("name") == "v70"){
            var v70 = event.target.checked;
            Session.set("v70", v70);
            console.log(Session.get("v70"));
        }
        if ($(event.target).prop("name") == "v150"){
            var v150 = event.target.checked;
            Session.set("v150", v150);
            console.log(Session.get("v150"));
        }
        if ($(event.target).prop("name") == "vlos"){
            var vlos = event.target.checked;
            Session.set("vlos", vlos);
            console.log(Session.get("vlos"));
        }
        if ($(event.target).prop("name") == "blos"){
            var blos = event.target.checked;
            Session.set("blos", blos);
            console.log(Session.get("blos"));
        }
        if ($(event.target).prop("name") == "evlos"){
            var evlos = event.target.checked;
            Session.set("evlos", evlos);
            console.log(Session.get("evlos"));
        }
        if ($(event.target).prop("name") == "certB"){
            var certB = event.target.checked;
            Session.set("certB", certB);
            console.log(Session.get("certB"));
        }
        if ($(event.target).prop("name") == "certC"){
            var certC = event.target.checked;
            Session.set("certC", certC);
            console.log(Session.get("certC"));
        }
        if ($(event.target).prop("name") == "certL"){
            var certL = event.target.checked;
            Session.set("certL", certL);
            console.log(Session.get("certL"));
        }
        if ($(event.target).prop("name") == "certVL"){
            var certVL = event.target.checked;
            Session.set("certVL", certVL);
            console.log(Session.get("certVL")); 
        }
    }
});

Template.autoCompletePilots.helpers({
  settings: function() {
    return {
      position: "bottom",
      limit: 20,
      rules: [
        {
          //token: ' ',
          collection: Meteor.users,
          field: 'profile.lastname',
          matchAll: true,
          template: Template.selectPilot
        }
      ]
    };
  },
  pilot: function() {
    return Meteor.users.find();
  }
});

Template.selectPilot.helpers({
  pilotEmail : function(){
      return this.emails[0].address;
  }
});

Template.autoCompletePilots.events({
    "autocompleteselect input": function(event, template, doc) {
        //Meteor.call('addOperator', doc);
        console.log(doc._id);
        var a = -1 ;
        pilotsList.forEach(element => {
            if(element._id==doc._id)
                a=1;
        });        
        if(a == -1){
            pilotsList.push(doc);
        };
        console.log(a)
        console.log(pilotsList);
        Session.set("updatePilots", true);
        Session.set('editPilots',true)
}
});

