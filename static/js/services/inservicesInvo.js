
var servsInvo = class SErvsInvo{
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
  
  
  var servedInvo = new servsInvo([])

 function getInservs(){
    var csrfToken =   $('input[name=csrfmiddlewaretoken]').val(),
    time = moment().format(),
    book = Number($('#servNum').data('book')) || 0
    $.ajax({
      type: "POST", 
        url: "/mauzo/Inservings",
      data: {b:book,t:time,csrfmiddlewaretoken:csrfToken},
    }).done(function(data){
        
        servedInvo.state = data.servs
        wekaData()
    })
}

getInservs()

    function wekaData(){

        let data = servedInvo.state,
            payF = Number($('#PayFilter').val()) || 0,
            tmf=Number($('#naMuda').val()) || 0,
            filtered = [
                      {value:0,then:()=>data },
                      {value:1,then:()=>data.filter(i=>i.ilolipwa===i.amount)},
                      {value:2,then:()=>data.filter(i=>i.ilolipwa<i.amount && i.ilolipwa>0)},
                      {value:3,then:()=>data.filter(i=>i.ilolipwa===0)}
                ]

            data = filtered.find(f=>f.value===payF).then()    

            if(tmf>0){
                data = data.filter(c=>moment(c.servTo).format()<=moment().format())
              }


        
            trp = ` 
            <table id="table-bidhaa" class="table table-bordered smallFont" style="width:100%">
            <thead>
                <tr class="smallFont ">
                    
                    <th>#</th>
                    <th> ${lang('Namba','Number')}</th>
                    <th>${lang('Mteja','Customer')}</th>
                    <th> ${lang('Kiasi','Charges')} </th>      
                    <th> ${lang('Ilolipwa','Paid')} </th>      
                    <th> ${lang('Kuanzia','From')} </th>      
                    <th> ${lang('Hadi','To')} </th>
                    <th> ${lang('Na','By')} </th>
                    <th> ${lang('Maelezo','Descriptions')} </th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="products_list">`,num = 0,paid=0,reg=0,cost=0
           
            data.forEach(s => {
                num+=1
                paid += Number(s.ilolipwa)
                cost += Number(s.amount)

                trp+=`<tr>
                         <td>${num} </td>    
                         <td>${s.code} </td>    
                         <td class="text-capitalize  weight600" style="color:blue">${s.mteja_jina} </td>    
                         <td class="brown weight600">${Number(s.amount).toLocaleString()} </td>    
                         <td class=" darkblue weight600"  >${Number(s.ilolipwa).toLocaleString()} </td>    
                         <td class="brown" >${moment(s.servFrom).format('MMM DD, YYYY HH:mm')} </td>    
                         <td class="brown weight600" >${moment(s.servTo).format('MMM DD, YYYY HH:mm')} </td>    
                         <td class="text-capitalize"> <a href="#"> ${s.NaF}  ${s.NaL}</a></td>    
                         <td >${s.desc|| lang('Hakuna','Null')} </td>    
                         <td  >
                         <a href="/mauzo/viewServing?item_valued=${s.id}"  class="btn btn-default text-primary btn-sm  " > 
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


  
