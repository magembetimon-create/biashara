
var servs = class SErvs{
    constructor(_state){
        this.stated=_state
    }
    get state(){
      return this.stated
    }
  
    set state(newstate){
       this.stated=newstate
  
    }
  
  }
  
  
  var served = new servs([])
  
   function getInservs(){
      var csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
      time = moment().format()
      
  
      $.ajax({
        type: "POST", 
          url: "/mauzo/HudumiaHudumaData",
        data: {b:1,t:time,serv:0,csrfmiddlewaretoken:csrfToken},
      }).done(function(data){
          served.state = data.servs
          wekaData()
  
      })
  }
  
  getInservs()
  
      function wekaData(){
        let data = served.state,
            catf=Number($('#AinaFilter').val()) || 0,
            tmf=Number($('#naMuda').val()) || 0,
            ecomf=Number($('#EcormOrDirect').val()) || 0
          
            //    Category filter .....................//
            data = catf==0?data:data.filter(c=>c.aina===catf)
            //    Duration end filter .....................//
            data = tmf==0?data:data.filter(c=>moment(c.online?c.expected:c.dueDate).format()>=moment().format())
            //    Ecormace or Direct filter .....................//
            data = ecomf==0?data:ecomf==1?data.filter(ec=>ec.online):data.filter(ec=>!ec.online)

          switch (ecomf) {
              case 0:
                  $('#EcormOrDirect').removeClass('brown')
                  $('#EcormOrDirect').removeClass('darkblue')
                  $('#EcormOrDirect').removeClass('weight500')
                  break;
          
              case  1:
                    $('#EcormOrDirect').removeClass('brown')
                    $('#EcormOrDirect').addClass('darkblue')
                    $('#EcormOrDirect').addClass('weight500')
                  break;

               case  2:
                    $('#EcormOrDirect').removeClass('darkblue')
                    $('#EcormOrDirect').addClass('brown')
                    $('#EcormOrDirect').addClass('weight500')
                  break;
          }


          switch (tmf) {
              case 0:
                  $('#naMuda').removeClass('brown')
                  $('#naMuda').removeClass('weight500')
                  break;
          
              case  1:
                  $('#naMuda').addClass('brown')
                  $('#naMuda').addClass('weight500')
                  break;

             
          }

          switch (catf) {
              case 0:
                  $('#AinaFilter').removeClass('brown')
                  $('#AinaFilter').removeClass('weight500')
                  $('#lipwaBaki').show(200)
                  break;
          
             default:
                  $('#AinaFilter').addClass('brown')
                  $('#AinaFilter').addClass('weight500')
                  $('#lipwaBaki').hide(200)
                  break;

             
          }



               trp = ` 
              <table id="table-bidhaa" class="table table-bordered smallFont" style="width:100%">
              <thead>
                  <tr class="smallerFont ">
                      
                      <th>#</th>
                      
                     
                      <th> ${lang('Namba','Number')}</th>
                      <th> ${lang('Bidhaa','Item')}</th>
                      <th  >${lang('Jina la Mteja','Customer Name')}</th>

                      <th > ${lang('Kuagizwa','Ordered Date')} </th> 
                      <th> ${lang('Kukamilisha','Due Date')} </th>

                      
                      <th> ${lang('Njia','Type')} </th> 
                    
                      <th> ${lang('Bei','Price')} </th> 
                      
  
                      <th> ${lang('Vipimo ','Units')} </th>
                      <th> ${lang('Idadi','Quantity')} </th>
                      <th> ${lang('Jumla','Total ')} </th> 
  
                   
  
                      
                      <th>Action</th>
                  </tr>
              </thead>
              <tbody id="products_list">`,num = 0,cost=0,paid=0,
              cat = [...new Set(data.map(i=>i.aina))],
              invo =  [...new Set(data.map(i=>i.mauzo_id))],
                 aina = cat.map(a=>creteAina(a)),
                 mauzo = invo.map(i=>createInvo(i)),
                 Aopt = `<option value=0 >${lang('Aina Zote','All Categories')}</option>`

                if(catf==0){
                    if(aina.length==1){
                      Aopt = ''
                    }
      
                    aina.forEach(a=>{
                      Aopt+=`<option value=${a.aina} >${a.Name}</option>`
                    })            
      
                    $('#AinaFilter').html(Aopt)
                }
  
              function creteAina(a){
                return {
                  aina:a,
                  Name:data.filter(n=>Number(n.aina)===Number(a))[0].ainaName
                }
              }
              
              function createInvo(i){
                return {
                  invo:i,
                  ilolipwa:data.filter(iv=>iv.mauzo_id===i)[0].ilolipwa,
                  kiasi:data.filter(iv=>iv.mauzo_id===i)[0].kiasi,
                }
              }

             cost= data.reduce((a,b)=> a + Number(b.idadi*b.bei),0)
             paid= mauzo.reduce((a,b)=> a + Number(b.ilolipwa),0)
  

             data.forEach(s => {
                  num+=1
                  trp+=`<tr>
                           <td>${num} </td>    
                           <td class="text-capitalize" ><a href="#">${s.code || lang('Hakuna','Null')} </a></td> 

                           <td class="text-capitalize" ><a href="#">${s.bidhaa} </a></td>    
                           <td class="text-capitalize " >${s.mteja} </td>    
                      
                           <td >${moment(s.Agizwa).format('MMM DD, YYYY HH:mm')} </td>    
                           <td >${moment(s.online?s.expected:s.dueDate).format('MMM DD, YYYY HH:mm')} </td>  

                           <td class=" ${s.online?'darkblue':'brown'} ">${s.online?lang('Mtandao','E-cormerce'):lang('Dukani','Direct')} </td>   

                           <td class="brown ">${floatValue(s.bei)} </td>    
                         
                           <td > <a href="#"> ${s.vipimo}</a> </td>    
                           <td >${Number(s.idadi)} </td> 
                           <td class="brown weight500" >${floatValue(Number(s.bei)*Number(s.idadi))} </td> 
  
                        
  
                           <td  >
                           <a href="/mauzo/viewInvo?item_valued=${s.mauzo_id}"  class="btn btn-default text-primary btn-sm  " > 
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                              </svg>  
                          </a> 
                       </td>    
                       </tr>`
              });
  
  
              trp+= `</tbody></table> `
              $('#loadMe').modal('hide')
              $('#products_list').html(trp)
  
              $('#table-bidhaa').DataTable();
  
                        
  const sajiriwa = document.getElementById('servNum'),
  
  thamani = document.getElementById('TotalCosted'),
  ilolipwa = document.getElementById('TotalPaid'),
  deni = document.getElementById('TotalDeni')
  
  
  animateValue(sajiriwa, 0, Number(num).toFixed(FIXED_VALUE), 1000);
  animateValue(thamani, 0, Number(cost).toFixed(FIXED_VALUE), 1000);
  animateValue(ilolipwa, 0, Number(paid).toFixed(FIXED_VALUE), 1300);
  animateValue(deni, 0, Number(cost-paid).toFixed(FIXED_VALUE), 1500);
  
  
  
      }
  
  
    
  