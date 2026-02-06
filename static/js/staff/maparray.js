// Method to upload a valid excel file
function upload(n){
    var files = document.getElementById('file_upload').files,regns=[];
    if(files.length==0){
      alert("Please choose any file...");
      return;
    }

   

       
            var filename = files[n].name;
            var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
            if (extension == '.XLS' || extension == '.XLSX') {
                excelFileToJSON(files[n],n,files.length);
            }else{
                alert("Please select a valid excel file.");
               
               }   
    

//  const   mikoa=[
//         {REGION:'PEMBA KASKAZINI',
//             POSTCODE:75, 
//             DISTRICT:[
                
//                 {
//                 POSTCODE: 752, 
//                 DISTRICT: 'Micheweni', 
//                 WARDS:[
//                     {"WARD":"Kinowe","POSTCODE":75203,"VILLAGES":[
//                         'Chimba',
//                         'Kinowe'
//                     ]},
//                     {"WARD":"Kiuyu Maziwang'ombe ","POSTCODE":75205,"VILLAGES":[
//                         'Kiuyu Mbuyuni',
//                         "Maziwang'ombe",
//                     ]},
//                     {"WARD":"Konde","POSTCODE":75209,"VILLAGES":[
//                         "Kifundi",
//                         "Konde",
//                         "Makangale",
//                         "Tondooni",
//                     ]},
//                     {"WARD":"Mgogoni ","POSTCODE":75208,"VILLAGES":[
//                         "Finya",
//                         "Kinyasini",
//                         "Mgogoni",
//                     ]},
//                     {"WARD":"Micheweni","POSTCODE":75201,"VILLAGES":[
//                         "Majenzi",
//                         "Micheweni",
//                         "Mjini Wingwi",
//                         "Shumba Mjini",
//                     ]},
//                     {"WARD":"Msuka","POSTCODE":75210,"VILLAGES":[
//                        "Msuka Magharibi",
//                        "Msuka Mashariki",
//                     ]},
//                     {"WARD":"Shumba Viamboni","POSTCODE":75207,"VILLAGES":[
//                         "Mihogoni",
//                         "Shumba Viamboni",
//                     ]},
//                     {"WARD":"Tumbe","POSTCODE":75202,"VILLAGES":[
//                         "Sizini",
//                         "Tumbe Magharibi",
//                         "Tumbe Mashariki",
//                     ]},
//                     {"WARD":"Wingwi Mapofu ","POSTCODE":75204,"VILLAGES":[
//                         "Wingi Mapofu",
//                     ]},
//                     {"WARD":"Wingwi Njuguni ","POSTCODE":75206,"VILLAGES":[
//                         "Mjananza",
//                         "Mlindo",
//                         "Mtemani",
//                         "Njuguni",
//                     ]}
//                 ]
            
//             },
//                 {
//                 POSTCODE: 751, 
//                 DISTRICT: 'Wete', 
//                 WARDS:[
//                     {"WARD":"Bopwe","POSTCODE":75102,"VILLAGES":[
//                         "Bopwe"
//                     ]},
//                     {"WARD":"Fundo","POSTCODE":75117,"VILLAGES":[
//                         "Fundo"
//                     ]},
//                     {"WARD":"Gando","POSTCODE":75116,"VILLAGES":[
//                         "Gando",
//                         "Junguni",
//                         "Ukunjwi",
//                     ]},
//                     {"WARD":"Jadida","POSTCODE":75104,"VILLAGES":[
//                         "Jadida"
//                     ]},
//                     {"WARD":"Kangagani","POSTCODE":75113,"VILLAGES":[
//                         "Kambini",
//                         "Kangagani",
//                         "Kiuyu Kigongoni",
//                         "Kiuyu Minungwini",
//                     ]},
//                     {"WARD":"Kipangani","POSTCODE":75101,"VILLAGES":[
//                         "Kipanga",
//                     ]},
//                     {"WARD":"Kisiwani","POSTCODE":75110,"VILLAGES":[
//                         "Kisiwani",
//                         "Mzambarauni Takao",
//                         "Piki",
//                     ]},
//                     {"WARD":"Kizimbani","POSTCODE":75105,"VILLAGES":[
//                         "Kizimbani"
//                     ]},
//                     {"WARD":"Kojani","POSTCODE":75114,"VILLAGES":[
//                         "Kojani",
//                         "Mpambani",
//                     ]},
//                     {"WARD":"Limbani","POSTCODE":75106,"VILLAGES":[
//                         "Limbani"
//                     ]},
//                     {"WARD":"Mchanga Mdogo","POSTCODE":75111,"VILLAGES":[
//                         "Chwale",
//                         "Kinyikani",
//                         "Mchanga Mdogo",
//                     ]},
//                     {"WARD":"Mtambwe","POSTCODE":75109,"VILLAGES":[
//                         "Mtambe Kaskazini",
//                         "Mtambe Kusini",
//                     ]},
//                     {"WARD":"Ole","POSTCODE":75112,"VILLAGES":[
//                         "Ole"
//                     ]},
//                     {"WARD":"Pandani","POSTCODE":75108,"VILLAGES":[
//                       "Pandani"
//                     ]},
//                     {"WARD":"Selemu","POSTCODE":75107,"VILLAGES":[
//                         "Selemu"
//                     ]},
//                     {"WARD":"Shengejuu","POSTCODE":75115,"VILLAGES":[
//                         "Kiungoni",
//                         "Maziwani",
//                         "Pembeni",
//                         "Shengejuu",
//                     ]},
//                     {"WARD":"Utaani","POSTCODE":75103,"VILLAGES":[
//                         "Utaani"
//                     ]}]
//             },
                
        
        
//         ]},
//         {REGION:'MJINI MAGHARIBI',
//             POSTCODE:71, 
//             DISTRICT:[
                
//                 {
//                 POSTCODE: 712, 
//                 DISTRICT: 'Magharibi', 
//                 WARDS:[
//                     {"WARD":"Bububu","POSTCODE":71207,"VILLAGES":[
//                         "Bububu",
//                         "Kibweni",
//                     ]},
//                     {"WARD":"Dimani","POSTCODE":71215,"VILLAGES":[
//                         "Bweleo",
//                         "Dimani",
//                         "Fumba",
//                         "Kombeni",
//                         "Nyamanzi",
//                         "Shakani",
//                     ]},
//                     {"WARD":"Fuoni","POSTCODE":71213,"VILLAGES":[
//                         "Fuoni Kibondeni",
//                         "Maungani",
//                     ]},
//                     {"WARD":"Kiembesamaki","POSTCODE":71214,"VILLAGES":[
//                         "Chukwani",
//                         "Kiembesamaki",
//                     ]},
//                     {"WARD":"Kijitoupele","POSTCODE":71205,"VILLAGES":[
//                         "Fuoni Kijitoupele",
//                         "Pangawe"
//                     ]},
//                     {"WARD":"Kizimbani","POSTCODE":71210,"VILLAGES":[
//                         "Bumbwisudi",
//                         "Dole",
//                         "Kizimbani",
//                     ]},
//                     {"WARD":"Magogoni","POSTCODE":71203,"VILLAGES":[
//                         "Kinuni",
//                         "Magogoni",
//                     ]},
//                     {"WARD":"Mbuzini","POSTCODE":71208,"VILLAGES":[
//                         "Chuini",
//                         "Kihinani",
//                         "Mbuzini",
//                     ]},
//                     {"WARD":"Mfenesini","POSTCODE":71209,"VILLAGES":[
//                         "Kama",
//                         "Mfenesini",
//                         "Mwakaje",
//                     ]},
//                     {"WARD":"Mtoni","POSTCODE":71206,"VILLAGES":[
//                         "Mtoni",
//                         "Mtoni Kidatu",
//                         "Mtopepo",
//                     ]},
//                     {"WARD":"Mwanakwerekwe","POSTCODE":71201,"VILLAGES":[
//                      "Melinne",
//                      "Mwanakwerekwe",
//                     ]},
//                     {"WARD":"Mwanyanya","POSTCODE":71211,"VILLAGES":[
//                         "Mwanyanya",
//                         "Sharifumsa",
//                     ]},
//                     {"WARD":"Mwera","POSTCODE":71212,"VILLAGES":[
//                         "Kianga",
//                         "Mtofanai",
//                         "Mwera",
//                     ]},
//                     {"WARD":"Tomondo","POSTCODE":71202,"VILLAGES":[
//                         "Kisauni",
//                         "Mombasa",
//                         "Tomondo",
//                     ]},
//                     {"WARD":"Welezo","POSTCODE":71204,"VILLAGES":[
//                         "Welezo"
//                     ]}]
            
//             },
//                 {
//                 POSTCODE: 711, 
//                 DISTRICT: 'Mjini', 
//                 WARDS:[
//                     {"WARD":"Amani","POSTCODE":71115,"VILLAGES":[
//                         "Amani",
//                         "Sebleni",
//                     ]},
//                     {"WARD":"Chumbuni","POSTCODE":71112,"VILLAGES":[
//                         "Chumbuni"
//                     ]},
//                     {"WARD":"Jang'ombe","POSTCODE":71109,"VILLAGES":[
//                         "Jang'ombe",
//                         "Urusi",
//                     ]},
//                     {"WARD":"Kikwajuni","POSTCODE":71102,"VILLAGES":[
//                         "Kikwajuni Bondeni",
//                         "Kikwajuni Juu",
//                         "Kisima Majongoo",
//                         "Kisiwandui",
//                     ]},
//                     {"WARD":"Kilimahewa","POSTCODE":71114,"VILLAGES":[
//                         "Kilimahewa Bondeni",
//                         "Kilimahewa Juu",
//                     ]},
//                     {"WARD":"Kwaalinathoo","POSTCODE":71108,"VILLAGES":[
//                         "Kwaalinathoo",
//                         "Matarumbeta",
//                     ]},
//                     {"WARD":"Kwahani","POSTCODE":71107,"VILLAGES":[
//                         "Kidongo Chekundu",
//                         "Kwaalamsha",
//                         "Kwahani",
//                     ]},
//                     {"WARD":"Kwamtipura","POSTCODE":71113,"VILLAGES":[
//                         "Kwamtipura",
//                         "Shaurimoyo",
//                     ]},
//                     {"WARD":"Magomeni","POSTCODE":71116,"VILLAGES":[
//                         "Magomeni"
//                     ]},
//                     {"WARD":"Makadara","POSTCODE":71106,"VILLAGES":[
//                         "Gulioni",
//                         "Makadara",
//                         "Mlandege",
//                     ]},
//                     {"WARD":"Mchangani","POSTCODE":71103,"VILLAGES":[
//                         "Malindi",
//                         "Mchangani",
//                         "Mwembetanga",
//                         "Vikokotoni",
//                     ]},
//                     {"WARD":"Meya","POSTCODE":71119,"VILLAGES":[
//                         "Meya"
//                     ]},
//                     {"WARD":"Miembeni","POSTCODE":71105,"VILLAGES":[
//                         "Kilimani",
//                         "Miembeni",
//                     ]},
//                     {"WARD":"Mkele","POSTCODE":71120,"VILLAGES":[
//                         "Mkele"
//                     ]},
//                     {"WARD":"Mkunazini","POSTCODE":71101,"VILLAGES":[
//                         "Kiponda",
//                         "Mkunazini",
//                         "Shangani",
//                     ]},
//                     {"WARD":"Mpendae","POSTCODE":71118,"VILLAGES":[
//                         "Migombani",
//                         "Mpendae",
//                     ]},
//                     {"WARD":"Muungano","POSTCODE":71110,"VILLAGES":[
//                         "Mikunguni",
//                         "Muungano",
//                     ]},
//                     {"WARD":"Mwembe Makumbi","POSTCODE":71111,"VILLAGES":[
//                        "Karakana" 
//                     ]},
//                     {"WARD":"Nyerere","POSTCODE":71117,"VILLAGES":[
//                         "Kwawazee",
//                         "Nyerere",
//                         "Soge",
//                     ]},
//                     {"WARD":"Rahaleo","POSTCODE":71104,"VILLAGES":[
//                         "Mwembeladu",
//                         "Mwembeshauri",
//                         "Rahaleo",
//                     ]}]
            
//             },
               
        
        
//         ]},
//         {REGION:'PEMBA KUSINI',
//             POSTCODE:74, 
//             DISTRICT:[
                
//                 {
//                 POSTCODE: 742, 
//                 DISTRICT: 'Chake Chake', 
//                 WARDS:[
//                     {"WARD":"Chachani","POSTCODE":74203,"VILLAGES":[
//                         "Chachani"
//                     ]},
//                     {"WARD":"Chanjaani","POSTCODE":74201,"VILLAGES":[
//                         "Chanjaani",
//                         "Madungu",
//                     ]},
//                     {"WARD":"Chonga","POSTCODE":74217,"VILLAGES":[
//                         "Chonga",
//                         "Mgelema",
//                     ]},
//                     {"WARD":"Kichungwani","POSTCODE":74205,"VILLAGES":[
//                         "Kichungwani"
//                     ]},
//                     {"WARD":"Kilindi","POSTCODE":74208,"VILLAGES":[
//                         "Kilindi"
//                     ]},
//                     {"WARD":"Kwale","POSTCODE":74213,"VILLAGES":[
//                         "Kwale",
//                         "Michungwani",
//                     ]},
//                     {"WARD":"Mkoroshoni","POSTCODE":74207,"VILLAGES":[
//                         "Mkoroshoni"
//                     ]},
//                     {"WARD":"Msingini","POSTCODE":74202,"VILLAGES":[
//                         "Msingini"
//                     ]},
//                     {"WARD":"Ndagoni","POSTCODE":74215,"VILLAGES":[
//                         "Ndagoni",
//                         "wesha",
//                     ]},
//                     {"WARD":"Ng'ambwa","POSTCODE":74211,"VILLAGES":[
//                         "Ng'ambwa",
//                         "Uwandani",
//                     ]},
//                     {"WARD":"Pujini","POSTCODE":74216,"VILLAGES":[
//                         "Matale",
//                         "Dodo",
//                         "Pujini",
//                     ]},
//                     {"WARD":"Shungi","POSTCODE":74214,"VILLAGES":[
//                         "Shungi"
//                     ]},
//                     {"WARD":"Tibirinzi","POSTCODE":74204,"VILLAGES":[
//                         "Tibirinzi"
//                     ]},
//                     {"WARD":"Vitongoji","POSTCODE":74212,"VILLAGES":[
//                         "Kibokoni",
//                         "Vitongoji",
//                     ]},
//                     {"WARD":"Wara","POSTCODE":74206,"VILLAGES":[
//                         "Wara"
//                     ]},
//                     {"WARD":"Wawi","POSTCODE":74209,"VILLAGES":[
//                         "Mfikiwa",
//                         "Mgogoni",
//                         "Mvumoni",
//                         "Wawi",
//                     ]},
//                     {"WARD":"Ziwani","POSTCODE":74210,"VILLAGES":[
//                         "Mbuzini",
//                         "Ziwani",
//                     ]}]
            
//             },
//                 {
//                 POSTCODE: 741, 
//                 DISTRICT: 'Mkoani', 
//                 WARDS:[
//                     {"WARD":"Chambani","POSTCODE":74117,"VILLAGES":[
//                         "Chambani",
//                         "Ukutini",
//                     ]},
//                     {"WARD":"Changaweni","POSTCODE":74107,"VILLAGES":[
//                         "Changaweni"
//                     ]},
//                     {"WARD":"Chokocho","POSTCODE":74110,"VILLAGES":[
//                         'Chokocho'
//                     ]},
//                     {"WARD":"Kangani","POSTCODE":74115,"VILLAGES":[
//                         "Kangani",
//                         "Kuukuu",
//                         "Mjimbini",
//                     ]},
//                     {"WARD":"Kengeja","POSTCODE":74114,"VILLAGES":[
//                         "Kengeja",
//                         "Mkungu"
//                     ]},
//                     {"WARD":"Kisiwa Panza","POSTCODE":74111,"VILLAGES":[
//                         "Kisiwa Panza"
//                     ]},
//                     {"WARD":"Kiwani","POSTCODE":74111,"VILLAGES":[
//                         "Kendwa",
//                         "Kiwani",
//                         "Mtangani",
//                     ]},
//                     {"WARD":"Makombeni","POSTCODE":74103,"VILLAGES":[
//                         "Makombeni"
//                     ]},
//                     {"WARD":"Makoongwe","POSTCODE":74105,"VILLAGES":[
//                         "Makoongwe"
//                     ]},
//                     {"WARD":"Mbuguani","POSTCODE":74104,"VILLAGES":[
//                         "Mbuguani"
//                     ]},
//                     {"WARD":"Mbuyuni","POSTCODE":74106,"VILLAGES":[
//                         "Mbuyuni"
//                     ]},
//                     {"WARD":"Mizingani","POSTCODE":74118,"VILLAGES":[
//                         "Mgagadu",
//                         "Mizingani",
//                         "Ngwachani",
//                     ]},
//                     {"WARD":"Mkanyageni","POSTCODE":74109,"VILLAGES":[
//                         "Michenzani",
//                         "Mkanyageni",
//                         "Shidi",
//                         "Stahabu",
//                     ]},
//                     {"WARD":"Mtambile","POSTCODE":74112,"VILLAGES":[
//                         "Minazini",
//                         "Mtambile",
//                     ]},
//                     {"WARD":"Muambe","POSTCODE":74113,"VILLAGES":[
//                         "Jombwe",
//                         "Muambe",
//                         "Shamiani",
//                     ]},
//                     {"WARD":"Ng'ombeni","POSTCODE":74101,"VILLAGES":[
//                         "Ng'ombeni"
//                     ]},
//                     {"WARD":"Uweleni","POSTCODE":74102,"VILLAGES":[
//                         "Uweleni"
//                     ]},
//                     {"WARD":"Wambaa","POSTCODE":74108,"VILLAGES":[
//                         "Chumbageni",
//                         "Wambaa",
//                     ]}]
            
//             },
               
        
        
//         ]},
//         {REGION:'UNGUJA KASKAZINI',
//             POSTCODE:73, 
//             DISTRICT:[
                
//                 {
//                 POSTCODE: 731, 
//                 DISTRICT: 'Kaskazini A', 
//                 WARDS:[
//                     {"WARD":"Chaani","POSTCODE":73109,"VILLAGES":[
//                         "Chaani Kubwa",
//                         "Chaani Masingini",
//                         "Mchezashauri",
//                     ]},
//                     {"WARD":"Gamba","POSTCODE":73101,"VILLAGES":[
//                         "Chutama",
//                         "Gamba",
//                         "Moga",
//                     ]},
//                     {"WARD":"Kidoti","POSTCODE":73106,"VILLAGES":[
//                         "Bwereu",
//                         "Fukuchani",
//                         "Kidoti",
//                         "Kilimani",
//                     ]},
//                     {"WARD":"Kinyasini","POSTCODE":73110,"VILLAGES":[
//                         "Bandamaji",
//                         "Kinyasini",
//                         "Kisongoni",
//                     ]},
//                     {"WARD":"Kivunge","POSTCODE":73103,"VILLAGES":[
//                         "Kivunge",
//                         "Potowa",
//                     ]},
//                     {"WARD":"Matemwe","POSTCODE":73108,"VILLAGES":[
//                         "Kigomani",
//                         "Kijini",
//                         "Matemwe",
//                     ]},
//                     {"WARD":"Mkokotoni","POSTCODE":73104,"VILLAGES":[
//                         "Mkokotoni",
//                         "Mto wa Pwani",
//                         "Pale",
//                         "Pitanazako",
//                     ]},
//                     {"WARD":"Mkwajuni","POSTCODE":73102,"VILLAGES":[
//                         "Kidombo",
//                         "Mkwajuni",
//                     ]},
//                     {"WARD":"Muwange","POSTCODE":73105,"VILLAGES":[
//                         "Kibeni",
//                         "Muwange",
//                     ]},
//                     {"WARD":"Nungwi","POSTCODE":73107,"VILLAGES":[
//                         "Kigunda",
//                         "Kilindi",
//                         "Nungwi",
//                         "Tazari",
//                     ]},
//                     {"WARD":"Pwani Mchangani","POSTCODE":73111,"VILLAGES":[
//                         "Kandwi",
//                         "Kikobweni",
//                         "Pwani Mchangani",
//                     ]}]
            
//             },
//                 {
//                 POSTCODE: 732, 
//                 DISTRICT: 'Kaskazini B', 
//                 WARDS:[
//                     {"WARD":"Fujoni","POSTCODE":73203,"VILLAGES":[
//                         "Fujoni",
//                         "Kiombamvua",
//                         "Matetema",
//                         "Mkadini",
//                     ]},
//                     {"WARD":"Kitope","POSTCODE":73207,"VILLAGES":[
//                         "Kitope",
//                         "Mbaleni"
//                     ]},
//                     {"WARD":"Mahonda","POSTCODE":73201,"VILLAGES":[
//                         "Mahonda",
//                         "Mkataleni",
//                         "Mnyimbi",
//                     ]},
//                     {"WARD":"Makoba","POSTCODE":73210,"VILLAGES":[
//                         "Mafufuni",
//                         "Makoba",
//                     ]},
//                     {"WARD":"Mangapwani","POSTCODE":73202,"VILLAGES":[
//                         "Kidanzini",
//                         "Mangapwani",
//                         "Misufini",
//                         "Zingwe Zingwe",
//                     ]},
//                     {"WARD":"Mbiji","POSTCODE":73205,"VILLAGES":[
//                          "Donge Karange",
//                          "Donge Mbiji",
//                     ]},
//                     {"WARD":"Mgambo","POSTCODE":73208,"VILLAGES":[
//                         "Kinduni",
//                         "Mgambo",
//                     ]},
//                     {"WARD":"Mtambile","POSTCODE":73204,"VILLAGES":[
//                         "Donge Mtambile",
//                         "Donge Vijibweni",
//                         "Njia ya Mtoni",
//                     ]},
//                     {"WARD":"Muanda","POSTCODE":73206,"VILLAGES":[
//                         "Donge Kipange",
//                         "Donge Mchangani",
//                         "Donge Muanda",
//                     ]},
//                     {"WARD":"Upenja","POSTCODE":73209,"VILLAGES":[
//                         "Kilombero",
//                         "Kiwengwa",
//                         "Pangeni",
//                         "Upenja",
//                     ]}]
            
//             },
               
        
        
//         ]},
//         {REGION:'UNGUJA KUSINI',
//             POSTCODE:72, 
//             DISTRICT:[
                
//                 {
//                 POSTCODE: 722, 
//                 DISTRICT: 'Kati', 
//                 WARDS:[
//                     {"WARD":"Bambi","POSTCODE":72205,"VILLAGES":[
//                         "Bambi",
//                         "Mpapa",
//                         "Pagali",
//                         "Umbuji",
//                     ]},
//                     {"WARD":"Chwaka","POSTCODE":72207,"VILLAGES":[
//                         "Chwaka",
//                         "Marumbi",
//                         "Pongwe",
//                         "Uroa",
//                     ]},
//                     {"WARD":"Dunga","POSTCODE":72201,"VILLAGES":[
//                         "Dunga Bweni",
//                         "Dunga Kiembeni",
//                     ]},
//                     {"WARD":"Jumbi","POSTCODE":72208,"VILLAGES":[
//                         "Binguni",
//                         "Jumbi",
//                         "Tunguu",
//                     ]},
//                     {"WARD":"Kibojeu","POSTCODE":72203,"VILLAGES":[
//                         "Ghana",
//                         "Kiboje Mkwajuni",
//                         "Kiboje Mwembeshauri",
//                         "Miwani",
//                     ]},
//                     {"WARD":"Koani","POSTCODE":72202,"VILLAGES":[
//                         "Kidimni",
//                         "Koani",
//                         "Machui",
//                         "Ubago",
                       
//                     ]},
//                     {"WARD":"Michamvi","POSTCODE":72211,"VILLAGES":[
//                         "Charawe",
//                         "Michamvi",
//                         "Ukongoroni",
//                     ]},
//                     {"WARD":"Ndijani","POSTCODE":72206,"VILLAGES":[
//                         "Cheju",
//                         "Jendele",
//                         "Ndijani Mseweni",
//                         "Ndijani Mwembepunda",
//                     ]},
//                     {"WARD":"Unguja Ukuu","POSTCODE":72209,"VILLAGES":[
//                         "Bungi",
//                         "Kikungwi",
//                         "Unguja Ukuu Kaebona",
//                     ]},
//                     {"WARD":"Uzi","POSTCODE":72210,"VILLAGES":[
//                         "Ng'ambwa",
//                         "Tindini",
//                         "Ugunja Ukuu Kaepwani",
//                         "Uzi",
//                     ]},
//                     {"WARD":"Uzini","POSTCODE":72204,"VILLAGES":[
//                         "Mchangani",
//                         "Mgenihaji",
//                         "Mitakawani",
//                         "Tundini",
//                         "Uzini",
//                     ]}]
            
//             },
//                 {
//                 POSTCODE: 721, 
//                 DISTRICT: 'Kusini', 
//                 WARDS:[
//                     {"WARD":"Bwejuu","POSTCODE":72111,"VILLAGES":[
//                         "Bwejuu",
//                         "Dongwe",
//                     ]},
//                     {"WARD":"Kajengwa","POSTCODE":72105,"VILLAGES":[
//                         "Kajengwa",
//                         "Nganani",
//                     ]},
//                     {"WARD":"Kibigija","POSTCODE":72108,"VILLAGES":[
//                         "Jambiani Kibigija"
//                     ]},
//                     {"WARD":"Kikadini","POSTCODE":72107,"VILLAGES":[
//                         "Jambiani Kikadini"
//                     ]},
//                     {"WARD":"Kizimkazi","POSTCODE":72104,"VILLAGES":[
//                         "Kibuteni",
//                         "Kizimkazi Dimbani",
//                         "Kizimkazi Mkunguni",
//                     ]},
//                     {"WARD":"Mtegani","POSTCODE":72103,"VILLAGES":[
//                         "Kijini",
//                         "Kiongoni",
//                     ]},
//                     {"WARD":"Mtende","POSTCODE":72101,"VILLAGES":[
//                         "Mtende"
//                     ]},
//                     {"WARD":"Muungoni","POSTCODE":72109,"VILLAGES":[
//                         "Kitogani",
//                         "Muungoni",
//                         "Pete",
//                     ]},
//                     {"WARD":"Muyuni","POSTCODE":72106,"VILLAGES":[
//                         "Muyuni A",
//                         "Muyuni B",
//                         "Muyuni C",
//                     ]},
//                     {"WARD":"Mzuri","POSTCODE":72102,"VILLAGES":[
//                         "Mzuri",
//                         "Tasani",
//                     ]},
//                     {"WARD":"Paje","POSTCODE":72110,"VILLAGES":[
//                         "Paje"
//                     ]}]
            
//             },
               
        
        
//         ]},
    
//     ],
//     m=mikoa[n], 
//     arr = {
//             data:{
//                 REGION:(m.REGION).trim(),
//                 POSTCODE:m.POSTCODE,

//                 DISTRICTS:JSON.stringify(m.DISTRICT),
//             },
//             url:'/staffonly/savePlaces'


            

//     },
//     lst= mikoa.length,

//     pst = POSTREQUEST(arr)
   
//     pst.then(dt=>{
//         console.log(dt.msg)
           

//         if(n<lst){
//             upload(n+1)
//         }
//     })

  }

   
  //Method to read excel file and convert it into JSON 
  function excelFileToJSON(file,num,lst){
   
      try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(e) {
   
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type : 'binary'
            });
            var result = {};
            workbook.SheetNames.forEach(function(sheetName) {
                var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (roa.length > 0) {
                    result[sheetName] = roa;
                }
            });
            //displaying the json result
            // var resultEle=document.getElementById("json-result");
            // resultEle.value=JSON.stringify(result, null, 4);
            const s1=result.Sheet1,
            mikoa = [],
            wilaya = [],
            kata = [],
            mtaa = [],
            vitongoji = [],
            ss="REGION" in s1[0] ?s1[0] : s1[1]
           


            for(let n=Number("__EMPTY" in s1[0]) ;n<=s1.length-1;n++){
                     const s = s1[n]
                
                     
                     if(('__EMPTY_2' in s && s?.__EMPTY_2.trim()!='') || ("DISTRICT" in s && s?.DISTRICT.trim()!='')){
                        wilaya.push({
                               name:s.__EMPTY_2 || s.DISTRICT,
                               pos:n,
                               code:s.__EMPTY_3 || s.POSTCODE_1
                        })
                     }
                     if(('__EMPTY_4' in s && s?.__EMPTY_4.trim()!='') || ("WARD" in s && s?.WARD.trim()!='') ){
                        kata.push({
                               name:s.__EMPTY_4 || s.WARD,
                               pos:n,
                               code:s.__EMPTY_5 || s.POSTCODE_2
                        })
                     }
                     if(('__EMPTY_6' in s && s?.__EMPTY_6.trim()!='') || ("MTAA" in s && s?.MTAA.trim()!='') ){
                        mtaa.push({
                               name:s.__EMPTY_6 || s.MTAA,
                               pos:n,
                               
                        })
                     }
                     if(('__EMPTY_7' in s && s?.__EMPTY_7.trim()!='') || ("KITONGOJI" in s && s?.KITONGOJI.trim()!='') ){
                        vitongoji.push({
                               name:s.__EMPTY_7 || s.KITONGOJI,
                               pos:n,
                               
                        })
                     }
                   
            }

            // const dist = {
            //     POSTCODE:l.__EMPTY_3,
            //     DISTRICT:s.__EMPTY_2,


            //     WARDS:[{
            //         WARD:s.__EMPTY_4,
            //         POSTCODE:s.__EMPTY_5,
                    
            //         VILLAGES:[
            //             s.__EMPTY_6,

            //         ]
            //     }]
            // }

      const   Distr = wilaya.map(
                (w,index)=>{
                    const st = w.pos, end = (index+1)<wilaya.length?Number(wilaya[index + 1].pos)-1:s1.length-1
                
                    return {

                        POSTCODE:w.code,
                        DISTRICT:w.name,
                        WARDS:kata.filter(ps=>ps.pos<=end&&ps.pos>=st).map(
                                 (k)=>{
                                    const kst = k.pos,
                                    posi = kata.filter(g=>g.pos<=kst).length,
                                    kend = posi<kata.length?kata[posi].pos-1:s1.length-1
                            
                                    return  {
                                        WARD:k.name,
                                        POSTCODE:k.code,
                                        VILLAGES:[... new Set([...mtaa.filter(pt=>pt.pos<=kend&&pt.pos>=kst),...vitongoji.filter(pv=>pv.pos<=kend&&pv.pos>=kst)].map(v=>v.name))].sort()

                                     }
                                 }
                        ).sort((a,b) => (a.WARD > b.WARD) ? 1 : ((b.WARD > a.WARD) ? -1 : 0))
                    }
                }
            ),

            arr = {
                data:{
                    REGION:(ss.__EMPTY || ss.REGION).trim(),
                    POSTCODE:ss.__EMPTY_1 || ss.POSTCODE,

                    DISTRICTS:JSON.stringify(Distr),
                },
                url:'/staffonly/savePlaces'


                

        },
        pst = POSTREQUEST(arr)

        pst.then(dt=>{
          
                console.log(dt.data)
           

                // if(num<lst){
                //     upload(num+1)
                // }

        })

           



            // resultEle.style.display='block';
          
             //console.log(arr)

             
           

            }
        }catch(e){
            
            console.error(e);
        }

     
  }

