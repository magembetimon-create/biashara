
var content = 'January February March April May June July August September October November December'.split(' '),
//  weekDayName = 'SUN MON TUES WED THURS FRI'.split(' '),
  daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  //d = new Date(),
  CURRENT_DATE = new Date(),
  monthData = [],
  ITEMSADDING=0,
  calendaData = []
  const rFrom = new Date($('#calenda-miamala').data('from')||new Date()) || moment().format('YYYY-MM-DD') ,rTo = new Date($('#calenda-miamala').data('to') || new Date()) || moment().format('YYYY-MM-DD')
 


// Returns the day of week which month starts (eg 0 for Sunday, 1 for Monday, etc.)
function getCalendarStart(dayOfWeek, currentDate) {
    var date = currentDate - 1;
    var startOffset = (date % 7) - dayOfWeek;
    if (startOffset > 0) {
    startOffset -= 7;
    }
    return Math.abs(startOffset);

}

// Render Calendar
function renderCalendar(startDay, totalDays, currentDate) {
    var currentRow = 1;
    var currentDay = startDay;
    var $table = $('.calender-table');
    var $week = getCalendarRow();
    var $day;
    var i = 1;


    for (; i <= totalDays; i++) {
    $day = $week.find('td').eq(currentDay);
    
    let label = ``,
        dateData = monthData.filter(mz=> Number(moment(mz?.tarehe).format('D'))==Number(i)),
        leng = dateData.length                
        let theTarehe = dateData[0]?.tarehe
        

        tag = `<div class="wrapper"> 
    

            <div class="float-right d-inline" >
                <button type="button"  class=" riportEntery px-1 dropdown-toggle " data-r="1" data-riport="0" data-val="0" title="{% if useri.langSet == 0 %}Chati{% else %}Chart{% endif %}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="pr-1"> ${leng}</span>
                </button>  

                <div class="dropdown-menu  smallFont">
                        <a  onclick="createArray('${moment(theTarehe).format('YYYY-MM-DD')}',moment('${theTarehe}').startOf('day').format(),moment('${theTarehe}').endOf('day').format())"
                        class="dropdown-item btn btn-default smallFont" type="button" onclick="$('#AnziaHadiTarehe').show(300)" >
                          ${lang('Ongeza siku','Add Day')}  
                        </a>


                        <a onclick="createArray('${moment(theTarehe).format('YYYY-MM')}Week${moment(theTarehe).format('k')}',moment('${theTarehe}').startOf('isoWeek').format(),moment('${theTarehe}').endOf('isoWeek').format())"
                         class="dropdown-item btn btn-default smallFont" type="button" onclick="$('#AnziaHadiTarehe').show(300)" >
                           ${lang('Ongeza wiki','Add Week')}
                        </a>

                        <div role="separator" class="dropdown-divider"></div>
                        <a onclick="createArray('${moment(theTarehe).format('YYYY-MM')}',moment('${theTarehe}').startOf('month').format(),moment('${theTarehe}').endOf('month').format())"
                        
                        class="dropdown-item btn btn-default smallFont" type="button" onclick="roadRiportSave()" >
                            ${lang('Ongeza Mwezi','Add Month')}    
                        </a>

                        <a onclick="createArray('${moment(theTarehe).format('YYYY')}',moment('${theTarehe}').startOf('year').format(),moment('${theTarehe}').endOf('year').format())"
                        class="dropdown-item btn btn-default smallFont" type="button" onclick="roadRiportSave()" >
                            ${lang('Ongeza Mwaka','Add Year')}
                            
                        </a>
                </div>
            </div>
            
        </div>`
    label+=leng>0?tag:''     

    label+= `<p><span class="text-primary">${i}</span></p>` 

    $day.html(label)
    $('[data-toggle="tooltip"]').tooltip()
    if (parseInt(i) === currentDate) {
    $day.addClass('today');
    }

    // +1 next day until Saturday (6), then reset to Sunday (0)
    currentDay = ++currentDay % 7;

    // Generate new row when day is Saturday, but only if there are
    // additional days to render
    if (currentDay === 0 && (parseInt(i) + 1 <= totalDays)) {
    $week = getCalendarRow();
    currentRow++;
    }
    }
    
    
    $('#calenda-miamala').show(300)

}

// Clear generated calendar
function clearCalendar() {
    var $trs = $('.calender-table tr').not(':eq(0)');
    $trs.remove();
    //$('.month-year').empty();
}

// Generates table row used when rendering Calendar
function getCalendarRow() {
    var $table = $('.calender-table');
    var $tr = $('<tr/>');
    for (var i = 0, len = 7; i < len; i++) {
    $tr.append($('<td/>'));
    }
    $table.append($tr);
    return $tr;

}


function myCalendar(dt) {
   
    let dtr= dt || moment().format('YYYY-MM-DD'),
        d = new Date(dtr)
  
    let    month = d.getUTCMonth(),
        day = d.getUTCDay(),
        year = d.getUTCFullYear(),
        date = d.getUTCDate(),
        totalDaysOfMonth = daysOfMonth[month],
        counter = 1,Tawi = branch()
        $h5 = $('<h5>'),
        
        fromM = moment(d).startOf('month').format(),
        toM = moment(d).endOf('month').format(),
        theDt =  [...theData.state,...calendaData],
        Dtlen = theDt.length,
     


        buttn = `<button class="btn btn-sm btn-light " data-mwaka="${year}-01-01"  id="showMonthYear">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                 </button>  
                        `
               
         
        $h5.html(`${content[month]} ${year} ${buttn}`);
        $('.month-year').html($h5);

        $('#calenda-miamala').data('nowDate',moment(d).startOf('month').format('YYYY-MM-DD'))
        
        // NEXT AND PRIVIOUS PANEL
        $('.prev-month').prop('disabled',moment(d).endOf('month').format('YYYY-MM-DD')<=moment(rFrom).endOf('month').format('YYYY-MM-DD'))
        $('.next-month').prop('disabled',moment(d).endOf('month').format('YYYY-MM-DD')>=moment(rTo).endOf('month').format('YYYY-MM-DD'))


   

        const  ftr = mm=> moment(mm.from).format() === fromM && moment(mm.To).format() <=toM
        theDt = theDt.filter(ftr)


        
       


    var dateToHighlight = 0;

    // Determine if Month && Year are current for Date Highlight
        if (CURRENT_DATE.getUTCMonth() === month && CURRENT_DATE.getUTCFullYear() === year) {
        dateToHighlight = CURRENT_DATE.getUTCDate();
        }



        //Getting February Days Including The Leap Year
        if (month === 1) {
        if ((year % 100 !== 0) && (year % 4 === 0) || (year % 400 === 0)) {
        totalDaysOfMonth = 29;
        }
        }

        

        if(theDt.length>0){
            let dts = ITEMSADDING?theDt[0].dtP:theDt[0].dt,
            invoData =   dts.filter(tr=>moment(tr.tarehe).format() >=  fromM && moment(tr.tarehe).format()<=toM)

            
            invoData =Tawi==0?invoData:invoData.filter(d=>Number(d.duka)==Tawi)

            itms_adding = ITEMSADDING?[...new Set(invoData.map(b=>b.bili))].map(bl=>{return {bili:bl,tarehe:invoData.filter(b=>b?.bili===bl)[0]?.tarehe}}):[] //This is for all added items ................................................//

            monthData = ITEMSADDING?itms_adding:invoData
            
            

            // Get Start Day
              clearCalendar()
              renderCalendar(getCalendarStart(day, date), totalDaysOfMonth, dateToHighlight);
        }else{
            LoadCalenderDt({fromM,toM,$h5:$h5.text(),render:{dura:getCalendarStart(day, date), totalDaysOfMonth, dateToHighlight}})
        }

};



     // Bind Events
     $('.prev-month').click(function() {
        navigationHandler(-1);
      });


      $('.next-month').click(function() {
        navigationHandler(1);
      });




function navigationHandler(dir) {
  var date = new Date($('#calenda-miamala').data('nowDate')),
      d = new Date(date), dt = new Date(d.setMonth(d.getMonth()+dir));
         myCalendar(moment(dt).format('YYYY-MM-DD'))
  }


  $('body').on('click','#showMonthYear',function(){
       $('#mothYearPanel').toggle(300)
       getAllMonths($(this).data('mwaka'))

       
  })


  $('body').on('click','.YearSelect',function(){
       $(this).siblings('.btn-primary').removeClass('btn-primary')
       $(this).siblings('button').addClass('btn-light')
       $(this).removeClass('btn-light')
       $(this).addClass('btn-primary')
       getAllMonths($(this).data('start'))
      
       
  })

  $('body').on('click','.calenderBtn',function(){
      $(this).siblings('.today').removeClass('today')
      $(this).addClass('today')
      myCalendar($(this).data('mwaka'))
      
  })


  function LoadCalenderDt(muda){
   
    let dta = {data:{ 
        d:0,
        r:1,
        s:servs,
        tf:OnlyDate?moment(muda.fromM).format('YYYY-MM-DD'):muda.fromM,
        tt:OnlyDate?moment(muda.toM).format('YYYY-MM-DD'):muda.toM,
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
    },
    url:`/riport/${urli}`}
    $("#loadMe").modal('show');
    let fct = getRiportData(dta),
       Tawi = branch()

    fct.then(function(data){
        $("#loadMe").modal('hide');

       
      
    let   ar= { 
            id:Dtlen+1, 
            name:muda?.$h5, 
            from:muda.fromM,
            To:muda.toM,
            txt:`${lang('Kuanzia<span class="brown smallerFont">','From<span class="brown smallerFont">')} (${moment(muda.fromM).startOf('day').format('ddd DD, MMM YYYY')})</span>`, 
           
        }

       ar = !ITEMSADDING?{...ar,...{ dt:data.data,dtI:data.itms,}}:{...ar,...{
            dtS:data.mauzo,
            dtP:data.data,
            dtC:data.cost,
            dtAdj:data.adjst, 
            dtTr:data.transfer, 
       }}



        calendaData.push(ar)

        invoData =  data.data
        invoData =Tawi==0?invoData:invoData.filter(d=>Number(d.duka)==Tawi)

        itms_adding = ITEMSADDING?[...new Set(invoData.map(b=>b.bili))].map(bl=>{return {bili:bl,tarehe:invoData.filter(b=>b?.bili===bl)[0]?.tarehe}}):[] //This is for all added items ................................................//
        monthData = ITEMSADDING?itms_adding:invoData

     

        

      
     
        // Get Start Day
      if('render' in muda){
        clearCalendar()
         renderCalendar(muda.render.dura, muda.render.totalDaysOfMonth, muda.render.dateToHighlight);

      } 
      if('mwaka' in muda){
        mothArrange({mwaka:muda.mwaka,ankara:invoData});
      } 

    })
}

function getAllMonths(mwaka){
  let  fromM = moment(mwaka).startOf('year').format(),
       toM = moment(mwaka).endOf('year').format(),
       Tawi = branch(),

       theDt =  [...theData.state,...calendaData],
       Dtlen = theDt.length
       
       const  ftr = mm=> moment(mm.from).format() === fromM && moment(mm.To).format() <=toM
       theDt = theDt.filter(ftr)
       if(theDt.length>0){

           let dts = ITEMSADDING?theDt[0].dtP:theDt[0].dt,
            dt = dts.filter(tr=>moment(tr.tarehe).format() >= fromM && moment(tr.tarehe).format()<=toM)

           dt =Tawi==0?dt:dt.filter(d=>Number(d.duka)==Tawi)
           
           
           mothArrange({ankara:dt,mwaka})
       }else{
           LoadCalenderDt({fromM,toM,mwaka})
       }


}


function mothArrange(dt){
 let   ankara = dt.ankara,
       mwaka = moment(dt.mwaka).format('YYYY'),
       
       sameMont = moment(new Date($('#calenda-miamala').data('nowDate'))).format('MMMM'),

       dates = [...new Set(ankara.map(i=>i.date))].sort(),
        
        months = [...new Set(dates.map(i=>moment(i).format('YYYYMM')))]
       
     
        
       let miezi = months.map((m)=>{
            return {
                dt:moment(`${ankara.filter((d)=>Number(moment(new Date(d.tarehe)).format('YYYYMM'))==Number(m))[0]?.tarehe}`).format('MMMM'),
                mm:moment(`${ankara.filter((d)=>Number(moment(new Date(d.tarehe)).format('YYYYMM'))==Number(m))[0]?.tarehe}`).format('MM')
            }
            })
        mAmount= miezi.map(dt=>`<button data-mwaka="${mwaka}-${dt.mm}-01" class="btn-sm ${sameMont==dt.dt?'today':''} nowrap latoFont calenderBtn smallFont btn-light btn">${dt.dt}</button>`)
        

        $('#showMonths').html(mAmount)

    
}

$('body').on('change','#Matawini',function(){     
    $('#calenda-miamala').hide(200)
  })
  


