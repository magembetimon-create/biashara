
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
    time = moment().format(),
    book = Number($('#servNum').data('book')) || 0

    $.ajax({
      type: "POST", 
        url: "/mauzo/HudumiaHudumaData",
      data: {b:book,t:time,csrfmiddlewaretoken:csrfToken},
    }).done(function(data){
        served.state = data.servs
        wekaData()

    })
}

getInservs()

    function wekaData(){
      let data = served.state,
          catf=Number($('#AinaFilter').val()) || 0,
          tmf=Number($('#naMuda').val()) || 0
        
          if(catf>0){
          data = data.filter(c=>c.aina===catf)
        }

        if(tmf>0){
          data = data.filter(c=>moment(c.To).format()<=moment().format())
        }

        let  dura = [
            {
            value:1,
            name:lang('dakika','Minute(s)'),
            
          },
            {
            value:0,
            name:'----',
            
          },
            {
            value:2,
            name:lang('Saa','hour(s)'),
            
            
          },
            {
            value:3,
            name:lang('Siku','Day(s)'),
           
            
          },
            {
            value:4,
            name:lang('Wiki','Week(s)'),
           
           
          },
            {
            value:5,
            name:lang('mwezi','Month(s)'),
            
       
          },
            {
            value:6,
            name:lang('Miaka','Year(s)'),
           
            
          },
       
       ],
        
             trp = ` 
            <table id="table-bidhaa" class="table table-bordered smallFont" style="width:100%">
            <thead>
                <tr class="smallerFont ">
                    
                    <th>#</th>
                    
                   
                    <th> ${lang('Namba','Number')}</th>
                    <th> ${lang('Huduma','Service')}</th>
                    <th  >${lang('Jina la Mteja','Customer Name')}</th>
                    <th > ${lang('Huduma Kuanzia','Serving From')} </th>      
                    <th> ${lang('Huduma Hadi','Serving To')} </th>

                    <th> ${lang('Kiasi/Nafasi','Charges/Space ')} </th> 
                    

                    <th> ${lang('Vipimo vya Nafasi','Space Units')} </th>
                    <th> ${lang('Nafasi','Space')} </th>
                    <th> ${lang('Jumla','Total ')} </th> 

                    <th> ${lang('Vipimo vya Muda','Duration Units')} </th>
                    <th> ${lang('Muda','Duration')} </th>
                    <th> ${lang('Jumla ya Kiasi','Total Amount')} </th>
                    

                    
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

               
               
          
           
          
           cost= mauzo.reduce((a,b)=> a + Number(b.kiasi),0)
           paid= mauzo.reduce((a,b)=> a + Number(b.ilolipwa),0)

          

               

           data.forEach(s => {
                num+=1
                trp+=`<tr>
                         <td>${num} </td>    
                         <td class="text-capitalize" ><a href="#">${s.code || lang('Hakuna','Null')} </a></td>    
                         <td class="text-capitalize" ><a href="#">${s.bidhaa} </a></td>    
                         <td class="text-capitalize  weight600" style="color:blue">${s.mteja} </td>    
                    
                         <td class="brown" >${moment(s.From).format('MMM DD, YYYY HH:mm')} </td>    
                         <td class="brown weight600" >${moment(s.To).format('MMM DD, YYYY HH:mm')} </td>    
                         <td class="brown ">${Number(s.bei).toLocaleString()} </td>    
                       
                         <td > <a href="#"> ${s.vipimo}</a> </td>    
                         <td >${Number(s.idadi)} </td> 
                         <td class="brown weight500" >${(Number(s.bei)*Number(s.idadi)).toLocaleString()} </td> 

                         <td > <a href="#"> ${dura.find(t=>t.value===Number(s.timely)).name}</a> </td>  

                         <td >${Number(s.saveT)} </td>  

                         <td class="brown weight600" >${(Number(s.saveT)*Number(s.bei)*Number(s.idadi)).toLocaleString()} </td>  

                         <td  >
                         <a href="/mauzo/viewServing?item_valued=${s.mauzo_id}"  class="btn btn-default text-primary btn-sm  " > 
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


  
