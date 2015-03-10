
/**
    Author:Jesse.Chen
    Create Date: 2015-02-28
    Description: This is a little calender plugin for common javascript, it is easy to modify its style, it is easy to bind event handler for this plugin, 
                 you can bind event handler without config this plugin
    License: Free
    Email: xiang19890319@gmail.com
*/

var esayCalendar = (function(){

    var _DEFINE = {
        "months":['January','February','March','April','May','June','July','August','September','October','November','December'],
        "days":["MO","TU","WE","TH","FR","SA", "SU"]
    };

    var _currentMonth = new Date();
    var _row = 0;
    var _firstDayInCalendar;
    var _dom;
    var _callBackForEachCell;

    function _graphCalender(){
        // check before graph
        if(_row == 0 || !_firstDayInCalendar || !_dom){
            console.log("there is something wrong, system can not graph calendar");
            return;
        }

        var table = document.createElement("table");
        var title = document.createElement("tr");
        _DEFINE.days.forEach(function(item, index, array){
            var cell = document.createElement("td");
            cell.appendChild(document.createTextNode(item));
            title.appendChild(cell);
        });
        table.appendChild(title);
        var dateCursor = new Date(_firstDayInCalendar.getFullYear(), _firstDayInCalendar.getMonth(), _firstDayInCalendar.getDate());
        for(var i = 0; i<_row; i++){
            var currentRow = document.createElement("tr");
            table.appendChild(currentRow);
            for(var j=0; j<7; j++){
                var currentDate = new Date(dateCursor.getFullYear(), dateCursor.getMonth(), dateCursor.getDate());
                var isCurrentMonth = (currentDate.getMonth() == _currentMonth.getMonth());
                var dayCell = document.createElement('td');
                dayCell.appendChild(document.createTextNode(currentDate.getDate()));
                dayCell.dataset.date=currentDate;
                dayCell.dataset.isCurrentMonth=isCurrentMonth;
                currentRow.appendChild(dayCell);
                if(!isCurrentMonth){
                    dayCell.classList.add("gray-font");
                }
                _callBackForEachCell.call(dayCell);
                dateCursor.setTime(dateCursor.getTime()+1000*60*60*24);
            }
        }
        _dom.appendChild(table);
    }

    function _calculateFirstDay(date){
        _firstDayInCalendar = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        while(_firstDayInCalendar.getDay() != 1){
            _firstDayInCalendar.setTime(_firstDayInCalendar.getTime()-1000*60*60*24);
        }
    }

    function next(dom, callbackForEachCell){
        if(callbackForEachCell){
            _callBackForEachCell = callbackForEachCell;
        }
        if(!dom.dataset.currentMonth){
            return;
        }
        _dom = dom;
        _row = 0;
        //empty dom
        for(var nodeIndex in dom.childNodes){
            var item = dom.childNodes.item(nodeIndex);
            item?dom.removeChild(item):"";
        }
        var currentMonth = new Date(dom.dataset.currentMonth), year, month;
        if(currentMonth.getMonth() == 11){
            year = currentMonth.getFullYear()+1;
            month = 0;
        } else {
            year = currentMonth.getFullYear();
            month = currentMonth.getMonth() + 1;
        }
        _initCurrentMonth(year, month);
        return year+"-"+_DEFINE.months[month];
    }

    function pre(dom, callbackForEachCell){
        if(callbackForEachCell){
            _callBackForEachCell = callbackForEachCell;
        }
        if(!dom.dataset.currentMonth){
            return;
        }
        _dom = dom;
        _row = 0;
        //empty dom
        for(var nodeIndex in dom.childNodes){
            var item = dom.childNodes.item(nodeIndex);
            item?dom.removeChild(item):"";
        }
        var currentMonth = new Date(dom.dataset.currentMonth), year, month;
        if(currentMonth.getMonth() == 0){
            year = currentMonth.getFullYear()-1;
            month = 11;
        } else {
            year = currentMonth.getFullYear();
            month = currentMonth.getMonth() - 1;
        }
        _initCurrentMonth(year, month);
        return year+"-"+_DEFINE.months[month];
    }

    function _initCurrentMonth(year, month){
        _currentMonth.setFullYear(year);
        _currentMonth.setMonth(month);
        _currentMonth.setDate(1);
        _dom.dataset.currentMonth = _currentMonth;
        _calculateFirstDay(_currentMonth);
        var lastDayOfCurrentMonth = new Date();
        if(month==11){
            lastDayOfCurrentMonth.setFullYear(year+1);
            lastDayOfCurrentMonth.setMonth(0);
        } else {
            lastDayOfCurrentMonth.setFullYear(year);
            lastDayOfCurrentMonth.setMonth(month+1);
        }
        lastDayOfCurrentMonth.setDate(1);
        lastDayOfCurrentMonth.setTime(lastDayOfCurrentMonth.getTime()-1000*60*60*24);
        
        var week_cursor = new Date(_currentMonth.getFullYear(), _currentMonth.getMonth(), _currentMonth.getDate());;
        while(week_cursor<lastDayOfCurrentMonth){
            var next_day = week_cursor.getDate()+7;
            week_cursor.setDate(next_day);
            _row++;
        }
        var compareDay = week_cursor.getDay();
        if(compareDay==0){
            compareDay=7;
        }
        if(lastDayOfCurrentMonth.getDay() != 0&&compareDay>lastDayOfCurrentMonth.getDay()){
            _row++;
        }
        _graphCalender();
    }

    var calendar = function(dom, callbackForEachCell){
        _dom = dom;
        if(callbackForEachCell){
            _callBackForEachCell = callbackForEachCell;
        }
        var now = new Date();
        var date = now.getDate();
        var month = now.getMonth();
        var year = now.getFullYear();
        var day = now.getDay();
        _initCurrentMonth(year, month);
        return year+"-"+_DEFINE.months[month];
    };

    return {
            "initCalendar":calendar,
            "nextMonth":next,
            "preMonth":pre
            };
})();