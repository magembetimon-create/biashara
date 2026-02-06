
  // calenda..................................................................................

  // store and reset data stored ........................................//
  class setCalenderData{
    constructor(_data){
      this.data=_data
    }
  
    get state(){
      return this.data
    }
  
    set state(newdata){
       this.data=newdata
  
    }
  }
  //var n=false 
  
 let setdata =new setCalenderData([])


  
function getCalendar(monthcode,dt){
console.log({dt,monthcode});

var csrfToken =   $('input[name=csrfmiddlewaretoken]').val()
  $.ajax({
    type: "POST", // if you choose to use a get, could be a post
      url: "/akaunting/calender",
    data: {csrfmiddlewaretoken:csrfToken,monthcode:monthcode,dt:dt},
  }).done(function(data){
     clearCalendar();
    setdata.state = data

    $("#loadMe").modal('hide');
      hideLoading()
         



   var  CURRENT_DATE = new Date();
   d=new Date();
  var s = new Date(data.current);
  if(s.getFullYear()==CURRENT_DATE.getFullYear() && s.getMonth()==CURRENT_DATE.getMonth()){
     d = new Date()
  }else{
     d.setUTCMonth(s.getUTCMonth())
  }
 

  var first = new Date(data.firstDate)
  var last = new Date(data.lastDate)


  if(d<=first){
    $('.prev-month').prop('disabled',true)
    $('.next-month').addClass('text-muted')


  }else{
        
    $('.prev-month').prop('disabled',false)
    $('.next-month').removeClass('text-muted')


  }
  
  if(d<last){
    
    $('.next-month').prop('disabled',false)
    $('.next-month').removeClass('text-muted')


  }else{
       $('.next-month').prop('disabled',true)
    $('.next-month').addClass('text-muted')

  
  }

  
  
  var content = 'January February March April May June July August September October November December'.split(' ');
  var weekDayName = 'SUN MON TUES WED THURS FRI'.split(' ');
  var daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
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
      
     var label = `<p><span class="text-primary">${i}</span></p><div class="det_entry mb-1">` 

      var wekan=0 ,toanum = 0

      if (data.weka){
          data.wekalist.forEach(dt => {

        if(Number(moment(dt.tarehe).format('DD')) == i ){

            wekan+=1
        }
      })
    }



      if (data.toa){ 
          
        data.toalist.forEach(dt => {

        if(Number(moment(dt.tarehe).format('DD')) == i ){

            toanum+=1

        }

       
      })
      }
     

var p
      if(toanum>0 && wekan>0){   
        if(i<10){
          p="0"+i;
        }else{p=i}
        label+=`<a class="addMapato bg-danger rounded-circle ml-4 tab_show text-light" data-show='#pata-mapato' data-class=".kutowea${p}" data-toggle="tooltip" data-hide=".kutowea" data-placement="top" title="${lang('kutoa pesa','Payment made')}">${toanum}</a>
        `
      }else if(toanum>0 && wekan==0){
        if(i<10){
         p="0"+i;
        }else{p=i}
        label+=`<a class="addMapato tab_show bg-danger rounded-circle text-light" data-toggle="tooltip"  data-show='#pata-mapato' data-class=".kutowea${p}"  data-hide=".kutowea" data-placement="top" title="${lang('kutoa pesa','Payment made')}">${toanum}</a>
        `
      }

      if(wekan>0){
        if(i<10){
          p="0"+i;
        }else{p=i}
         
        label+=`<a class="addMapato bg-success tab_show rounded-circle   text-light" data-toggle="tooltip" data-show='#kutoa-malipo'  data-placement="top" data-hide=".kuwekeza" data-class=".kuweka${p}" title="${lang('Kuweka pesa','Payment receives')}">${wekan}</a>
        `
      }

      

       label += `</div>`

    

       $day.html(label)
       $('[data-toggle="tooltip"]').tooltip()



      if (Number(i) === currentDate) {
        $day.addClass('today');
      }
  
      // +1 next day until Saturday (6), then reset to Sunday (0)
      currentDay = ++currentDay % 7;
  
      // Generate new row when day is Saturday, but only if there are
      // additional days to render
      if (currentDay === 0 && (Number(i) + 1 <= totalDays)) {
        $week = getCalendarRow();
        currentRow++;
      }
    }
  }
  
  // Clear generated calendar
  function clearCalendar() {
    var $trs = $('.calender-table tr').not(':eq(0)');
    $trs.remove();
    $('.month-year').empty();
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
  
  function myCalendar() {
    var month = d.getUTCMonth();
    var day = d.getUTCDay();
    var year = d.getUTCFullYear();
    var date = CURRENT_DATE.getUTCDate();
    var totalDaysOfMonth = daysOfMonth[month];
    var counter = 1;
  
    var $h3 = $('<h3>');
  
    $h3.text(content[month] + ' ' + year);
    $h3.appendTo('.month-year');
  
    var dateToHighlight = 0;
  
    // Determine if Month && Year are current for Date Highlight
    if (CURRENT_DATE.getUTCMonth() === month && CURRENT_DATE.getUTCFullYear() === year) {
      dateToHighlight = date;
    }
  
    //Getting February Days Including The Leap Year
    if (month === 1) {
      if ((year % 100 !== 0) && (year % 4 === 0) || (year % 400 === 0)) {
        totalDaysOfMonth = 29;
      }
    }
  
    // Get Start Day
    renderCalendar(getCalendarStart(day, date), totalDaysOfMonth, dateToHighlight);
  };
  
  
  
  myCalendar();


  })
  }
  

  
     // Bind Events
    $('.prev-month').click(function() {
      navigationHandler(-1);
    });
    $('.next-month').click(function() {
      navigationHandler(1);
    });
    // Generate Calendar


function navigationHandler(dir) {

  var data = setdata.state
  d = new Date(data.current);
  first = new Date(data.firstDate)
  last = new Date(data.lastDate)

    //  firsti= new Date(data.firstDate)
     last = new Date(data.lastDate)

     

    if(d<=last){
        $("#loadMe").modal('show');

        // console.log(Number(moment(d).format('YYYYMM'))+dir)
        
        let mth = Number(moment(d).format('YYYYMM'))+dir,
            dt = new Date(d.setMonth(d.getMonth()+dir))
        getCalendar(mth,moment(dt).format('DD MMMM, YYYY'))

           
     }else{
     }
   
  }
 

 $('body').on('click',".det_entry a",function(){
  

var data=setdata.state

  var tr1='',n=1,s=1,tr2=''

  if($(this).data('hide')==".kuwekeza"){

  data.wekalist.forEach(dt => {
           

    if($(this).data('class')==`.kuweka${moment(dt.tarehe).format('DD')}`){
      
   tr1+=`<tr class="kuwekeza }">
             <td >${n}</td>
            <td>${moment(dt.tarehe).format('DD/MM/YYYY HH:mm:ss')}</td>
             <td>${dt.Akaunti.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
             <td>${floatValue(dt.Amount)}</td>
             <td>${floatValue(dt.before)}</td>
             <td>${floatValue(dt.After)}</td>`

             if(dt.mauzo){
                 tr1+=`<td>${lang('Malipo ya Mauzo','Invoice Payment')}</td>
                       <td>${dt.maelezo}</td>
                       `
             }else{
                  tr1+=`<td>${dt.kutoka.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
                  <td>${dt.maelezo.replace(/[/[,+()$~%"*{}`]/g, "")}</td>
                  `
              
             }

             
           tr1+=  `
             <td>${dt.naf.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "") +' '+ dt.nal.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
               </tr>`
          n++
   
            $('.tarehe-ya').text(moment(dt.tarehe).format('DD/MM/YYYY'))

        }
                })
          
                $('#wekaCashdata1').html(tr1)
                
       
  }else{

    
  data.toalist.forEach(dt => {

    if($(this).data('class')==`.kutowea${moment(dt.tarehe).format('DD')}`){
 tr2+=`<tr class="kutowea ">
                     <td >${s}</td>
                    <td >${moment(dt.tarehe).format('DD/MM/YYYY HH:mm:ss')}</td>
                     <td >${dt.Akaunti.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
                     <td>${floatValue(dt.Amount)}</td>
                     <td>${floatValue(dt.makato)}</td>
                     <td>${floatValue(dt.before)}</td>
                     <td>${floatValue(dt.After)}</td>`
                     if(dt.manunuzi){
                        tr2+=`<td>${lang('Kulipia Bili','bill Payment')}</td>`
                        tr2+=`<td>${dt.maelezo}</td>`

                     }else{

                     tr2+=`<td>${dt.kwenda.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>`
                     tr2+=`<td>${dt.bill_id!=null?`<a class="ivoice_details" href="/purchase/bill_view/${dt.bill_id}" type="button"  data-id=${dt.bill_id} >'BIL-${bil}+'</a>`:dt.maelezo.replace(/[/[,+()$~%"*{}`]/g, "")}</td>`
 
                     }
                    tr2+= `<td>${dt.naf.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "") +' '+ dt.nal.replace(/[/[&\/\\#,+()$~%"*?<>{}`]/g, "")}</td>
                       </tr>`
                  s++

                  $('.tarehe-ya').text(moment(dt.tarehe).format('DD/MM/YYYY'))

    }


                 
                        })
                  
                        $('#toaCashdata1').html(tr2)
  }
   
   

       


 })