var isLoaded=true;
        var iscounterrunning=false;//flag to check if time counter is running or not
        var sidebarstate = "closed";
        var insecs = 60;//default 60 seconds
        var netchecksecs=15;//check net connection at every 15 seconds interval
        /***
         * IN FUTURE ALL THE SETTINGS HAS TO BE SAVED EITHER CLIENT'S BROWSER OR ONTO CLOUD LIKE
         * AVAILABLE FREE JSON DATA HOLDER, SO THAT THE USER DONT HAVE TO SET EACH OPTION EVERYTIME WHEN USE
         * THE APPLICATION.
         */
        var work = "main"; //set to "" when published
        /**
         * flag to check if the hide option is selected by the available slot button.
         * This flag will allow the application to show only available slot when set to true.
         */
        var istoggled = false;
        /*******************************************JSON DATA FOR STATES**************/
        var states = { "districts": [{ "district_id": 710, "district_name": "Alipurduar District" }, { "district_id": 711, "district_name": "Bankura" }, { "district_id": 712, "district_name": "Basirhat HD (North 24 Parganas)" }, { "district_id": 713, "district_name": "Birbhum" }, { "district_id": 714, "district_name": "Bishnupur HD (Bankura)" }, { "district_id": 715, "district_name": "Cooch Behar" }, { "district_id": 783, "district_name": "COOCHBEHAR" }, { "district_id": 716, "district_name": "Dakshin Dinajpur" }, { "district_id": 717, "district_name": "Darjeeling" }, { "district_id": 718, "district_name": "Diamond Harbor HD (S 24 Parganas)" }, { "district_id": 719, "district_name": "East Bardhaman" }, { "district_id": 720, "district_name": "Hoogly" }, { "district_id": 721, "district_name": "Howrah" }, { "district_id": 722, "district_name": "Jalpaiguri" }, { "district_id": 723, "district_name": "Jhargram" }, { "district_id": 724, "district_name": "Kalimpong" }, { "district_id": 725, "district_name": "Kolkata" }, { "district_id": 726, "district_name": "Malda" }, { "district_id": 727, "district_name": "Murshidabad" }, { "district_id": 728, "district_name": "Nadia" }, { "district_id": 729, "district_name": "Nandigram HD (East Medinipore)" }, { "district_id": 730, "district_name": "North 24 Parganas" }, { "district_id": 731, "district_name": "Paschim Medinipore" }, { "district_id": 732, "district_name": "Purba Medinipore" }, { "district_id": 733, "district_name": "Purulia" }, { "district_id": 734, "district_name": "Rampurhat HD (Birbhum)" }, { "district_id": 735, "district_name": "South 24 Parganas" }, { "district_id": 736, "district_name": "Uttar Dinajpur" }, { "district_id": 737, "district_name": "West Bardhaman" }], "ttl": 24 }
        /*******************************************JSON DATA FOR STATES**************/
        var isrecheck = false;
        var timecounter = 0;
        var pd = null;
        //var apiaddr = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=717&date=10-06-2021";
        var sapi = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=717&date=10-06-2021";
        var demo = "./static/files/slot.json";
        //format is = dd-mm-yyyy
        var statedata = "./static/files/states.json";

        //floating link
        //events for elements
        document.getElementById('dist').addEventListener('focus', () => {
            classRemover('dist', 'w3-text-red');
            // document.getElementById('dist').classList.remove('w3-text-red');
        });
        document.getElementById('idate').addEventListener('focus', () => {
            //document.getElementById('idate').classList.remove('w3-text-red');
            classRemover('idate', 'w3-text-red');
        });
        // THE WORK HAS TO BE DONE HERE
        document.getElementById("setTimer").addEventListener('click',(event) => {
            var a=document.getElementById('timeracc');
            if(a.className.indexOf('w3-show') == -1){
                //event.target.classList.add('w3-indigo');
                a.className=a.className.replace("w3-hide","w3-show");
            }else{
                a.className=a.className.replace("w3-show", "w3-hide");
               // event.target.classList.remove('w3-indigo');
            }
        })
        function classRemover(element, classname) {
            //needed as whenever the user goes for select new place then the counter should stop
            stopcounter();
            document.getElementById(element).classList.remove(classname);
        }
        document.getElementById('search').addEventListener('click', searchslot);
        document.getElementById('avl').addEventListener('click', showAvlble);
        document.getElementById("wcall").addEventListener('click', () => {
            asidebar = document.getElementById('sidebar');
            head = document.getElementById('header');
            prog = document.getElementsByClassName('progress')[0];
            form = document.getElementsByClassName('form')[0];
            if (asidebar.style.display === 'block') {
                asidebar.style.display = 'none';
                head.removeAttribute("style");
                prog.removeAttribute("style");
                form.removeAttribute("style");
            } else {
                asidebar.style.display = 'block';
                asidebar.style.top = "41px";
                head.style.position = "sticky";
                head.style.top = "0px";
                prog.style.top = "38px";
                form.style.top = "42px";
            }
        });
        document.getElementById('btnSet').addEventListener('click',setTimer);
        function setTimer(){
            var times=document.getElementById('selectTime').value;
            if(times!=0){
                console.log(times);
                document.getElementById('alert').style.display='block';
                var i=0;
                var interval = setInterval(()=>{
                    i+=1;
                    if(i===6){
                        clearInterval(interval);
                        document.getElementById('alert').style.display='none';
                        setTimersecs(times)
                    }
                },1000);
            }
        }
        function searchslot() {
            if(!isLoaded){
                return;
            }
            //and here also
            //needed as whenever the user goes for select new place then the counter should stop
            stopcounter();
            //from here we are going to add a timer event which will ping the server at about every 500ms.
            did = document.getElementById('dist').value;
            sdate = document.getElementById('idate').value.split('-').reverse().join("-");
            if (did == 0 && sdate == '') {
                document.getElementById('dist').classList.add("w3-text-red");
                document.getElementById('idate').classList.add("w3-text-red");
            } else if (did == 0) {
                document.getElementById('dist').classList.add("w3-text-red");
            } else if (sdate == '') {
                document.getElementById('idate').classList.add("w3-text-red");
            } else {
                sapi = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${did}&date=${sdate}`;
                //console.log(sapi);
                //call the pinger
                callapi(sapi);
            }
        }
        /**
         * The async function that will return a promise to load the data on the ui
         */
        async function callapi(sapi) {
            let pd = {};
            try {
                let d = await fetch(sapi);
                pd = await d.json();
                if (pd.sessions.length == 0) {
                    pd = null;
                }
                loaddata(pd);
                //console.log(pd);
            } catch (e) {
                console.log(e);
                messageelem('Error in connection','connection-problem');
            }
        }
        /**
         * this is wrong implementation as it removes elements
         * rather a better approach is need to be implemented to provide
         * the code base a better use case.
         */ 
        
        function removelem() {
            node = document.getElementById('slot')
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        }
        function spinner(isshow) {
            if (isshow) {
                document.getElementById("spinner").style.display = "block";
                document.getElementById("spinner").classList.add("spinner");
                document.getElementById("avl").style.display = "none";
            } else {
                document.getElementById("spinner").style.display = "none";
                document.getElementById("spinner").classList.remove("spinner");
                document.getElementById("avl").style.display = "block";
            }
        }
        /**
         * Function to load the fetched data onto the html page
        */
        function loaddata(jsond) {
            spinner(true);
            removelem();//a temporary solve
            document.getElementById("num").innerText = 0;
            //console.log(jsond);
            if (jsond != null) {
                //console.log("Elements are there");
                //document.getElementById('warning').style.display='none';//default
                var i = 0;
                var len = jsond.sessions.length;
                isLoaded=false;
                var inr = setInterval(() => {
                    document.getElementById('slot').appendChild(element(jsond.sessions[i]));
                    if (i == len - 1) {
                        clearInterval(inr);
                        spinner(false);
                        inr = 0;
                        startcounter(insecs);
                        isLoaded=true;
                    } else {
                        //console.log(`i is ${i}`);
                        //console.log(`len is ${len}`);
                        i += 1;
                    }
                }, 100);
            } else {
                //console.log("I am being called");
                /**
                 *  <li class="w3-pale-red w3-border-red w3-bottombar" id="warning">
                        <p class="w3-xlarge w3-center">No session available</p>
                    </li> 
                 */
                messageelem('Session not available','no-session');
            }
            //despite the session if not available the timer should scan at each time so that as soon as the new
            //session gets available it should show onto the list
            // if(work!="dev"){
            
            // }
        }
        function messageelem(text,tag) {
            var wn = document.createElement('LI');
            wn.id=tag;
            wn.className = "w3-pale-red w3-border-red w3-bottombar";
            m = document.createElement('p');
            m.className = "w3-center w3-xlarge";
            m.appendChild(document.createTextNode(text));
            //t=document.createTextNode('No Session is available');
            //m.appendChild(t);
            wn.appendChild(m);
            document.getElementById('slot').appendChild(wn);
        }
        /**
         * <li class="w3-pale-green w3-leftbar w3-border-green">
                <div class="w3-bar w3-text-blue">
                    <div class="w3-bar-item w3-left" style="margin-left: -16px;">Dinhata SDH CVC</div> 
                    <div class="w3-bar-item w3-right w3-tag w3-green">18</div> 
                </div>
                <div class="w3-cell-row">
                    <div class="w3-col s8 m10 l11 w3-border w3-small">Dinhata SDH, Dinhata Municipality, 736135</div>
                    <div class="w3-col s4 m2 l1 w3-right-align  w3-border">Dose1: 0</div>
                </div>
                <div class="w3-cell-row">
                    <div class="w3-col s8 m8 l11 w3-border"><span id="vac">COVAXIN</span> <span id="fees" class="w3-right w3-tag">free &#8377;0</span></div>
                    <div class="w3-col s4 m4 l1 w3-right-align w3-border">Dose2: 0</div>
                </div>
            </li>
        */
        function element(data) {
            //new inclusion fee, fee_type
            //"center_id": 595960,
            var cid = data.center_id;
            var name = data.name;
            var address = data.address;
            var bname = data.block_name;
            var pin = data.pincode;
            var age = data.min_age_limit;
            var fees = data.fee;
            var feetype = data.fee_type;
            var vaccine = data.vaccine;
            var vd1 = data.available_capacity_dose1;
            var vd2 = data.available_capacity_dose2;

            //list element creation
            var list = document.createElement("LI");
            list.id = cid;
            if (vd1 == 0 && vd2 == 0) {
                list.title = 'NA';
                if (istoggled) {
                    list.className = "w3-pale-red w3-border-red w3-leftbar w3-animate-opacity w3-hide";
                } else {
                    list.className = "w3-pale-red w3-border-red w3-leftbar w3-animate-opacity";
                }
            } else {
                list.title = "AVL";
                list.className = "w3-pale-green w3-border-green w3-leftbar w3-animate-opacity";
                var c = parseInt(document.getElementById('num').innerText);
                document.getElementById('num').innerText = c + 1;
            }
            // <div class="w3-bar w3-text-blue">
            //         <div class="w3-bar-item w3-left" style="margin-left: -16px;">Dinhata SDH CVC</div> 
            //         <div class="w3-bar-item w3-right w3-tag w3-green">18</div> 
            // </div>
            var d1 = document.createElement('div');
            d1.className = "w3-bar w3-text-indigo";
            var sd1 = document.createElement('div');
            sd1.id = "slotname";
            sd1.className = "w3-bar-item w3-left";
            sd1.style = "margin-left: -16px;";
            sd1.appendChild(document.createTextNode(name));
            var sd2 = document.createElement('div');
            sd2.className = "w3-bar-item w3-right w3-tag w3-round";
            if (age == 18) {
                sd2.classList.add("w3-purple");
            } else {
                sd2.classList.add("w3-deep-purple");
            }
            sd2.appendChild(document.createTextNode(age));
            d1.appendChild(sd1);
            d1.appendChild(sd2);
            // <div class="w3-cell-row">
            //     <div class="w3-col s8 m10 l11 w3-border">Dinhata SDH</div>
            //     <div class="w3-col s4 m2 l1 w3-right-align  w3-border">Dose1: 0</div>
            // </div>
            var d2 = document.createElement('div');
            d2.className = "w3-cell-row";
            var ad1 = document.createElement('div');
            ad1.className = "w3-col w3-small s8 m9 l10";
            ad1.appendChild(document.createTextNode(`${address}, ${bname}, ${pin}`));
            var ad2 = document.createElement('div');
            ad2.className = "w3-col s4 m3 l2 w3-right-align";
            ad2.appendChild(document.createTextNode(`Dose1: ${vd1}`));
            d2.appendChild(ad1);
            d2.appendChild(ad2);
            // <div class="w3-cell-row">
            //     <div class="w3-col s8 m8 l11 w3-border">COVAXIN</div>
            //     <div class="w3-col s8 m8 l11 w3-border">free rs100</div>
            //     <div class="w3-col s4 m4 l1 w3-right-align w3-border">Dose2: 0</div>
            // </div>
            var d3 = document.createElement('div');
            d3.className = "w3-cell-row";
            var bd1 = document.createElement('div');
            bd1.className = "w3-col s8 m9 l10";
            var sp1 = document.createElement('span');
            sp1.id = "vac";
            sp1.appendChild(document.createTextNode(vaccine));
            var sp2 = document.createElement('span');
            sp2.id = "fees";
            if (feetype === "Free") {
                sp2.className = "w3-tag w3-right w3-teal w3-round";
            } else {
                sp2.className = "w3-tag w3-right w3-indigo w3-round";
            }
            sp2.appendChild(document.createTextNode(`${feetype} \u20B9${fees}`));
            bd1.appendChild(sp1);
            bd1.appendChild(sp2);
            var bd2 = document.createElement('div');
            bd2.className = "w3-col s4 m3 l2 w3-right-align";
            bd2.appendChild(document.createTextNode(`Dose2: ${vd2}`));
            d3.appendChild(bd1);
            d3.appendChild(bd2);

            //adding d1,d2,d3 into list element
            list.appendChild(d1);
            list.appendChild(d2);
            list.appendChild(d3);
            return list;
        }
        function showAvlble() {
            istoggled = !istoggled;
            document.getElementById('avl').classList.toggle('w3-teal');
            var listarr = document.getElementsByTagName('li');//get the array collection of lists
            for (i = 0; i <= listarr.length - 1; i++) {
                if (listarr[i].title === "NA") {
                    listarr[i].classList.toggle('w3-hide');
                }
            }
        }
        //not needed currently will be enabled in future when data
        //will needed to be fetched from server
        // async function setup(){
        //     let sd=null;
        //     try{
        //         let s=await fetch(statedata);
        //         sd=await s.json();
        //     }catch(e){
        //         console.log(e);
        //         //force ui setup
        //         sd={
        //             "districts":[
        //             {
        //                "district_id": 717,
        //                 "district_name": "Darjeeling"
        //             },
        //             {
        //                "district_id": 722,
        //                 "district_name": "Jalpaiguri"
        //             }
        //             ]
        //         }
        //     }
        //     std(sd);
        // }
        /**
         * "districts": [
            {
                "district_id": 710,
                "district_name": "Alipurduar District"
            },
         */
        async function std(sd) {
            setTimeout(() => {
                let i = 0;
                let size = sd.districts.length;
                let distlist = document.getElementById('dist');
                let v = setInterval(() => {
                    //console.log(sd.districts[i]);
                    let distoption = document.createElement('option');
                    distoption.value = sd.districts[i].district_id;
                    let distname = document.createTextNode(sd.districts[i].district_name);
                    distoption.appendChild(distname);
                    distlist.appendChild(distoption);
                    i++;
                    if (i == size) {
                        clearInterval(v);
                    }
                }, 50);
            }, 1000);
        }

        function setTimersecs(value) {
            insecs = value
        }
        function startcounter(insecs) {
            var val=insecs;
            var isecs = 0;//per seconds counter
            var op = 0;
            var i = 100 / val;//1.667
            resetprogress();
            timecounter = setInterval(() => {
                if (isecs != val) {
                    op = i * isecs;
                    document.getElementById('prog').style.width = `${op}%`;
                    isecs += 1
                    console.log(`counting of i is ${isecs}`);
                }
                if (isecs == val) {
                    clearInterval(timecounter);//time counter is global so can be stopped from anywhere
                    searchslot();//from here start again
                    console.log(`counting stopped at ${isecs}`);
                }
            }, 1000);
        }
        function stopcounter() {
            if (timecounter > 0) {
                clearInterval(timecounter);
                resetprogress();
            }
        }
        function resetprogress() {
            document.getElementById('prog').style.width = "0%";
        }
        //tmporary implementation not implemented into the codebase
        function scrolltop() {
            var top = 0;
            if (typeof (window.pageYOffset) == "number") {
                top = window.pageYOffset;
            } else if (document.body && document.body.scrollTop) {
                top = document.body.scrollTop;
            } else if (document.documentElement && document.documentElement.scrollTop) {
                top = document.documentElement.scrollTop;
            }
            return top;
        }
        /* View in fullscreen */
        function openFullscreen(elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        }
        function init(){
            //var elem = document.documentElement;
            //console.log("I am claed");
            //openFullscreen(elem);
            std(states);
        }

        window.addEventListener('unload', stopcounter);
        window.addEventListener('DOMContentLoaded', (work == "dev") ? callapi(demo) : init);