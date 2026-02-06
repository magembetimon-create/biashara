

function loadHomeData(){
    const Htitle = `${lang('Hesabu Kama Ilivyo Leo','Inventory As Of Today')}  ${moment().format('DD/MM/YYYY')} ${lang('Hadi','To')} ${moment().format('HH:mm')}`,
          Leo = moment().startOf('day').format()   ,
          LeoDate = moment(Leo).format('YYYY-MM-DD'),
          last7Days = moment(Leo).subtract(7,'days').format(),
          currenciid= $('#currencii').data('currencii'),
          CURRENCII  = `<span class=" weight400 latoFont smallFont">${currenciid}.</span>`,
          getinfo = POSTREQUEST({data:{
                td:Leo,
                tdd:LeoDate,
                last7:last7Days
          },
            url:'riport/homePageData'
        }),
        mapatoMatumiziPanel  = trnsxn =>{
               const {income ,expend} = trnsxn,
                      ff = d=>moment(d.tarehe).format() >= Leo,
                      inco = income.filter(ff).reduce((a,b)=>a+Number(b.Amount),0),
                      exp = expend.filter(ff).reduce((a,b)=>a+Number(b.Amount),0),

                      dt = `<div class="col-6 py-1">
                  
                      ${lang('Mapato Jumla','Net Income')}
                        </div>
                        <div class="col-6 py-1 text-right">
                        ${CURRENCII} <strong class="largerFont strongC">${floatValue(inco || 0)}</strong> 
                        </div>
                        <div class="col-6 py-1">
                        
                        ${lang('Matumizi Jumla','Net Expenditure')}
                        </div>
                        <div class="col-6 py-1 text-right">
                        ${CURRENCII}  <strong class="largerFont strongC">${floatValue(exp)}</strong> 
                        </div> `

                        return dt

        },
        NetAmountPanel  = pay =>{
               const amo = pay.reduce((a,b)=>a+Number(b.Amount),0),

                      dt = `<div class="col-6 py-1">
                  
                      ${lang('Akaunti','Accounts')}
                        </div>
                        <div class="col-6 py-1 text-right">
                         <strong class="largerFont strongC">${pay.length}</strong> 
                        </div>
                        <div class="col-6 py-1">
                        
                        ${lang('Kiasi Jumla','Net Amount')}
                        </div>
                        <div class="col-6 py-1 text-right">
                        ${CURRENCII}  <strong class="largerFont strongC">${floatValue(amo)}</strong> 
                        </div> `

                        return dt

        },
        VistorsPanel  = vist =>{

            function visted_vistors(dt){
                const NonUserV = [... new Set(dt.filter(i=>i.user_id===null).map(ip=>ip.ipaddres))],
                      UserV = [... new Set(dt.filter(i=>i.user_id!=null).map(ip=>ip.user_id))],
                      visted = dt.reduce((a,b)=>a+Number(b.visted),0),
                      vistors={
                       vistors:Number(NonUserV.length + UserV.length),
                       visted:visted
                      }
           
                      return vistors
           }


               const     vistors = visted_vistors(vist),
                            homeP = visted_vistors(vist.filter(h=>h.homePage)),
                            About = visted_vistors(vist.filter(h=>h.AboutPage)),
                            Mapp = visted_vistors(vist.filter(h=>h.MapPage)),
                            RegP = visted_vistors(vist.filter(h=>h.RegPage)),
                            ItemsP = visted_vistors(vist.filter(h=>h.ItemPage_id!=null)),
                            CategP = visted_vistors(vist.filter(h=>h.CategoryPage_id!=null)),
                            GroupP = visted_vistors(vist.filter(h=>h.GroupPage_id!=null)),
                            BrandP = visted_vistors(vist.filter(h=>h.BrandPage_id!=null)), 
                            pages = Number(homeP.visted>0) + Number(About.visted>0) + Number(Mapp.visted>0) + Number(RegP.visted>0) + Number(ItemsP.visted>0) + Number(CategP.visted>0) + Number(GroupP.visted) + Number(BrandP.visted)
                        

                      dt = `<div class="col-6 py-1">
                  
                      ${lang('Watembeleaji','Vistors')}
                        </div>
                        <div class="col-6 py-1 text-right">
                         <strong class="largerFont strongC">${vistors.vistors}</strong> 
                        </div>
                        <div class="col-6 py-1">
                        
                        ${lang('Kurasa','Pages')}
                        </div>
                        <div class="col-6 py-1 text-right">
                          <strong class="largerFont strongC">${pages}</strong> 
                        </div> `

                        return dt

        },
        SalesPanel  = sale =>{
             
               sale = sale.filter(s=> !(s.order||s.service)) 

              
               sale = sale.filter(s=>moment(s.tarehe).format('YYYY-MM-DD')===moment().format('YYYY-MM-DD'))


              
               const amo = sale.reduce((a,b)=>a+Number(b.amount),0),
                     pay = sale.reduce((a,b)=>a+Number(b.ilolipwa),0)

                      dt = `<div class="col-6 py-1">
                  
                      ${lang('Ankara','Invoice(s)')}
                        </div>
                        <div class="col-6 py-1 text-right">
                         <strong class="largerFont strongC">${sale.length}</strong> 
                        </div>
                        <div class="col-6 py-1">
                        
                        ${lang('Malipo','Payment')}
                        </div>
                        <div class="col-6 py-1 text-right">
                        ${CURRENCII}  <strong class="largerFont strongC">${floatValue(pay)}</strong> | <span class="mr-2 smallerFont ">${floatValue((pay*100)/amo)|0}%</span>
                        </div> `

                        return dt

        },

        stockPanel = sto =>{
            const {stoc,adj,transfer,duka} = sto,
              
                col = `

          <li class="row py-2 classic_div">
                <div class="col-9">
                    ${lang('Bidhaa Zilizoisha','Out of Stock Items')}
                </div>
                <div class="col-3 text-right">
                    <a href="/stoku/bidhaapanel" class="round p-1 centerItem stockSings  showNumber"  >
                            ${stoc.filter(s=>Number(s.idadi) === 0 && !s.service && Number(s.Bei_kuuza)>0 ).length }
                    </a>
                </div>
           </li>

          <li class="row py-2 classic_div">
                <div class="col-9">
                    ${lang('Nyenzo/Vitu  Vilivyoisha','Out of Stock Material')}
                </div>
                <div class="col-3 text-right">
                    <a href="/production/MaterialItems" class="round p-1 centerItem stockSings  showNumber"  >
                            ${stoc.filter(s=>Number(s.idadi) === 0 && !s.service && s.material ).length}
                    </a>
                </div>
           </li>

           <li class="row py-2 classic_div">
                <div class="col-9">
                    ${lang('Vitu/Bidhaa Zilizopitwa Muda','Expired Items')}
                </div>
                <div class="col-3 text-right">
                    <a href="/riport/ExpiredItems" class="round p-1 centerItem stockSings  showNumber"  >
                            ${stoc.filter(s=>moment(s.expire_date).format() <= moment().format() && Number(s.idadi)>0 && !s.service ).length}
                    </a>
                </div>
           </li>
           <li class="row py-2 classic_div">
                <div class="col-9">
                    ${lang('Marekebisho','Adjustment')}
                </div>
                <div class="col-3 text-right">
                    <a href="/stoku/AllAdjs" class="round p-1 centerItem stockSings  showNumber"  >
                            ${adj.length}
                    </a>
                </div>
           </li>
           <li class="row py-2 classic_div">
                <div class="col-9">
                    ${lang('Kuhamisha','Transfer')}
                </div>
                <div class="col-3 text-right">
                    <a href="/stoku/transferNote" class="round p-1 centerItem stockSings  showNumber"  >
                            ${transfer.filter(t=>t.From===duka).length}
                    </a>
                </div>
           </li>
           <li class="row py-2 classic_div">
                <div class="col-9">
                    ${lang('Kupokea','Receives')}
                </div>
                <div class="col-3 text-right">
                    <a href="/stoku/receiveNote" class="round p-1 centerItem stockSings  showNumber"  >
                    ${transfer.filter(t=>t.From!=duka).length}
                    </a>
                </div>
           </li>
                `

               
               
                return col

        },
        PuchasePanel = pu =>{
            
            
                col = `

          <li class="row py-2 classic_div">
                <div class="col-9">
                    ${lang('Kapuni','Cart')}
                </div>
                <div class="col-3 text-right">
                    <a href="/purchase/puOrder" class="round p-1 centerItem PuchaseSigns  showNumber"  >
                            ${pu.filter(s=>s.cart).length } 
                    </a>
                </div>
           </li>

          <li class="row py-2 classic_div">
                <div class="col-9">
                    ${lang('Kuagizwa','Odered')}
                </div>
                <div class="col-3 text-right">
                    <a href="/purchase/puOrder?en=1" class="round p-1 centerItem PuchaseSigns  showNumber"  >
                            ${pu.filter(s=>!(s.cart || s.packed)).length}
                    </a>
                </div>
           </li>

           <li class="row py-2 classic_div">
                <div class="col-9">
                    ${lang('Kufungashwa','Packed')}
                </div>
                <div class="col-3 text-right">
                    <a href="/purchase/puOrder?en=1" class="round p-1 centerItem PuchaseSigns  showNumber"  >
                            ${pu.filter(s=>s.packed && !s.derivered ).length}
                    </a>
                </div>
           </li>
           <li class="row py-2 classic_div">
                <div class="col-9">
                    ${lang('Kusafirishwa','Delivery')}
                </div>
                <div class="col-3 text-right">
                    <a href="/purchase/puOrder?en=1" class="round p-1 centerItem PuchaseSigns  showNumber"  >
                            ${pu.filter(p=>p.derivered && !p.receved ).length}
                    </a>
                </div>
           </li>
      
           <li class="row py-2 classic_div">
                <div class="col-9">
                    ${lang('Kupokea','Receives')}
                </div>
                <div class="col-3 text-right">
                    <a href="/purchase/puOrder?en=1" class="round p-1 centerItem PuchaseSigns  showNumber"  >
                    ${pu.filter(t=>t.receved).length}
                    </a>
                </div>
           </li>
                `

               
               
                return col

        },

        SaleOdaPanel = sa =>{
            
            const sale = sa.filter(s=>s.order && !s.service),

            
                
                  col = `
                  <li class="row py-2 classic_div">
                        <div class="col-9">
                            ${lang('Zinazosubiri','Pending')}
                        </div>
                        <div class="col-3 text-right">
                            <a href="/mauzo/saleOda?pend=1" class="round p-1 centerItem saleOderSigns  showNumber"  >
                                   ${sale.filter(s=>!(s.cart || s.packed || !s.online ) ).length}
                            </a>
                        </div>
                    </li>

                <li class="row py-2 classic_div">
                    <div class="col-9">
                        ${lang(' Wekewa Alama ya Kuonwa','Mark As Seen')}
                    </div>
                    <div class="col-3 text-right">
                        <a href="/mauzo/saleOda?pend=1" class="round p-1 centerItem saleOderSigns  showNumber"  >
                        ${sale.filter(s=>!(s.cart || s.packed) && s.sioMuhimu ).length}
                        </a>
                    </div>
                </li>

                    <li class="row py-2 classic_div">
                        <div class="col-9">
                            ${lang('Zilizolipwa','Pre-Paid')}
                        </div>
                        <div class="col-3 text-right">
                            <a href="/mauzo/saleOda" class="round p-1 centerItem saleOderSigns  showNumber"  >
                                ${sale.filter(s=>s.ilolipwa>0 ).length}
                            </a>
                        </div>
                    </li>

                    <li class="row py-2 classic_div">
                        <div class="col-9">
                            ${lang('Zilizofungashwa','Packed')}
                        </div>
                        <div class="col-3 text-right">
                            <a href="/mauzo/saleOda?pac=1" class="round p-1 centerItem saleOderSigns  showNumber"  >
                                ${sale.filter(s=>s.packed && !s.derivered ).length}
                            </a>
                        </div>
                    </li>




                    <li class="row py-2 classic_div">
                        <div class="col-9">
                            ${lang(' Zilizosafirishwa','Delivered')}
                        </div>
                        <div class="col-3 text-right">
                            <a href="/mauzo/saleOda?der=1" class="round p-1 centerItem saleOderSigns  showNumber"  >
                              ${sale.filter(p=>p.derivered && !p.receved ).length}
                            </a>
                        </div>
                    </li>
                    <li class="row py-2 classic_div">
                        <div class="col-9">
                            ${lang(' Zilizopokelewa','Received')}
                        </div>
                        <div class="col-3 text-right">
                            <a href="/mauzo/saleOda?rec=1" class="round p-1 centerItem saleOderSigns  showNumber"  >
                            ${sa.filter(t=>t.receved && !t.service).length}
                            </a>
                        </div>
                    </li>

                  `
                

                  return col
        },

        servicePanel = serv =>{
            serv = serv.filter(s=>s.service)
            const servi = serv.filter(s=>s.order),
                    
                   col = ` <li class="row py-2 classic_div">
                                <div class="col-9">
                                    ${lang('Zilizowekwa Nafasi Zinazosubiri','Pending Booking')}
                                </div>
                                <div class="col-3 text-right">
                                    <a href="/mauzo/inserviceBook" class="round p-1 centerItem servicesSigns  showNumber"  >
                                    ${servi.filter(s=>!(s.cart || s.packed)).length}
                                    </a>
                                </div>
                            </li>

                            <li class="row py-2 classic_div">
                                <div class="col-9">
                                    ${lang(' Wekewa Alama ya Kuonwa','Mark As Seen')}
                                </div>
                                <div class="col-3 text-right">
                                    <a href="/mauzo/inserviceBook" class="round p-1 centerItem servicesSigns  showNumber"  >
                                    ${servi.filter(s=>!(s.cart || s.packed) && s.sioMuhimu ).length}
                                    </a>
                                </div>
                            </li>

                            <li class="row py-2 classic_div">
                                <div class="col-9">
                                    ${lang('Zilizowekwa Nafasi na Kuhakikiwa','Booking Confirmed ')}
                                </div>
                                <div class="col-3 text-right">
                                    <a href="/mauzo/inserviceBook" class="round p-1 centerItem servicesSigns  showNumber"  >
                                       ${servi.filter(s=>s.packed && !s.derivered ).length}
                                    </a>
                                </div>
                            </li>
                            <li class="row py-2 classic_div">
                                <div class="col-9">
                                    ${lang(' Zinazohudumia','Servicing ')}
                                </div>
                                <div class="col-3 text-right">
                                    <a href="/mauzo/inservice?der=1" class="round p-1 centerItem servicesSigns  showNumber"  >
                                      ${serv.filter(s=>!s.order && !s.receved ).length}
                                    </a>
                                </div>
                            </li>
                            <li class="row py-2 classic_div">
                                <div class="col-9">
                                    ${lang(' Muda umeisha','Out of Time ')}
                                </div>
                                <div class="col-3 text-right">
                                    <a href="/mauzo/inservice" class="round p-1 centerItem servicesSigns  showNumber"  >
                                        ${servi.filter(s=>moment(s.servTo).format() < moment().format() && !s.receved ).length}
                                     </a>
                                </div>
                            </li>
                            <li class="row py-2 classic_div">
                                <div class="col-9">
                                    ${lang(' Zilizokamilika','Completed Service ')}
                                </div>
                                <div class="col-3 text-right">
                                    <a href="/mauzo/Hudumiwa?s=1" class="round p-1 centerItem servicesSigns  showNumber"  >
                                      ${serv.filter(s=>s.receved ).length}
                                    </a>
                                </div>
                            </li>`

                   return col         

        }


        getinfo.then(data=>{
            $('#loadMe').modal('hide')

             const {income,expend,pay,vistors,sale,adj,transfer,duka,itms,pu}   = data  
                    $('#IncomeExp').html(mapatoMatumiziPanel({income,expend}))
                    $('#payAcc').html(NetAmountPanel(pay))
                    $('#EntpVistors').html(VistorsPanel(vistors))
                    $('#salePanel').html(SalesPanel(sale))
                    $('#StockPanel').html(stockPanel({stoc:itms,adj,transfer,duka}))
                    $('#PurchasePanel').html(PuchasePanel(pu))
                    $('#SaleOrderPanel').html(SaleOdaPanel(sale))
                    $('#ServicePanel').html(servicePanel(sale))
                


                     WithdrawDepositChat({income,expend})
             
             
        })


        function WithdrawDepositChat(itms){

            const {income,expend} = itms,
                   itmd = [... income.map(r=>{return{amount:Number(r.Amount),tarehe:r.tarehe,weka:1}}),... expend.map(r=>{return{amount:Number(r.Amount)+Number(r.makato),tarehe:r.tarehe,weka:0}})],
          
                dates = [...new Set(itmd.map(i=>moment(i.tarehe).format('YYYY-MM-DD')))].sort(),
               
                amounts =  dates.map(dt=>chartDt(dt)),
                
                fromd = moment(last7Days).format('DD/MM/YYYY'),
                tod = moment().format('DD/MM/YYYY')
                
                 $('#titleChart').text(`${fromd}-${tod}`)
     
        
        function chartDt(dt){
            const itmz =  itmd.filter(i=>moment(i.tarehe).format('YYYY-MM-DD')===dt) 
                return { 
                        date:dt,
                        depoAmo:Number(itmz.filter(w=>w.weka).reduce((a,b)=> a + Number(b.amount),0))  ,
                        WithdrAmo:Number(itmz.filter(w=>!w.weka).reduce((a,b)=> a + Number(b.amount),0)),
                    }
        }  
        
          
         
          
          //Draw new Chart................................................................................................................./
          const summary = `
                   <div class="row classic_div">
                        <div class="col-md-8">
                            
                        </div>

                         <div class="col-md-4  row text-right ">
                              <div class="col-5" >
                                  ${lang('Mapato', 'Income')}
                              </div>
                              <div class="col-7">
                                  <span class="smallerFont"> ${currenciid}</span>.<span class="weight700"> ${floatValue(amounts.reduce((a,b)=>a+Number(b.depoAmo),0))}</span>
                              </div>
                              <div class="col-5" >
                                  ${lang('Matumizi','Expenditure')}
                              </div>
                              <div class="col-7">
                                  <span class="smallerFont"> ${currenciid}</span>.<span class="weight700"> ${floatValue(amounts.reduce((a,b)=>a+Number(b.WithdrAmo),0))}</span>
                              </div>

                         </div>
                   </div>
           `
          
          $('#theChatPanel').html(`${summary} <div class="table-responsive p-md-4" ><canvas style="${window.outerWidth>800?'max-height:75vh !important':'max-height:90vh !important'} "  id="myChartC"></canvas></div>`);
        
              
          var canvas = document.getElementById('myChartC');
          var ctx = canvas.getContext('2d');
          var data= {
                  labels: amounts.map(d=>moment(d.date).format('ddd, DD-MM-YYYY')),
                  datasets: [ 
                
                      {
                          label: lang("Mapato","Income"),
                          fill: true,
                          lineTension: 0,
                          backgroundColor: "#5543C1",
                          borderColor: "#5543C1", // The main line color
                      
                          // notice the gap in the data and the spanGaps: false
                          data:amounts.map(a=>Number(a.depoAmo).toFixed(FIXED_VALUE)),
                          spanGaps: false,
                      },
                         {
                          label: lang("Matumizi","Expenditure"),
                          fill: true,
                          lineTension: 0,
                          backgroundColor: "#C1439E",
                          borderColor: "#C1439E", // The main line color
                      
                          // notice the gap in the data and the spanGaps: false
                          data:amounts.map(a=>Number(a.WithdrAmo).toFixed(FIXED_VALUE)),
                          spanGaps: false,
                      }
                    
                      ]
                  };
        
         
        
        
                  var options = {
                      plugins: [{
                      beforeInit: function (chart) {
                      chart.data.labels.forEach(function (e, i, a) {
                          if (/\n/.test(e)) {
                          a[i] = e.split(/\n/)
                          }
                      })
                      }
                  }],
              
              tooltips: {
                          bodyFontSize: window.outerWidth>800?19:15,
                          enabled: true,
                          callbacks: {
                              label: function (tooltipItems, data) {
                                  return data.datasets[tooltipItems.datasetIndex].label + ` ${currenciid} : `+ tooltipItems.yLabel.toLocaleString();
                              }
                          }
                      },
              
              
          scales: {
                      yAxes: [{
                          
                          ticks: {
                              beginAtZero:true,
                              display:window.outerWidth>800?true:false
                              
                          },
                          scaleLabel: {
                              display: true,
                              labelString: `${lang('Kiasi','Amount')} ${currenciid}`,
                              fontSize: 13 
                          }
                      }],
                      xAxes:[
                          {
                               maxBarThickness: 28,
                             // barPercentage: 0.5,
                              categoryPercentage: .23,
                              ticks:{
                                  display:window.outerWidth>800?true:false
                              },
                               scaleLabel: {
                              display:true,
                              labelString:lang('Tarehe','Date'),
                              fontSize: 13 
                          }
                          }
                      ]            
                  }  
          };
        
          // Chart declaration:
          var myBarChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
            });	
        
        
        
        }


        
    
      $('#homedashTitle').text(Htitle)

             // MONTH START OR WEEK..........................................................//
        



}

loadHomeData()

