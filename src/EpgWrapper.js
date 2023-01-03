import React, {useEffect, useState} from 'react'
import moment from 'moment-timezone';

// import useGeneralApi from './useGeneralApi';
import EpgConfig from './EpgConfig'
import timeUtils from './timeUtils';
import Dexie from 'dexie';
// import { getCalenderDateArr, setCalenderDateArr } from './localStorageService';
// import MediaDetailsPopupSmall from '../components/MediaDetailsPopupSmall'
// import ErrorPageWrapper from '../components/errors/ErrorPage';
// import useErrorUtils from '../utils/useErrorUtils';

  /* --------------------------------------------- */

const EpgWrapper = (props) => {
  const {onUserStateChanged, onApplicationChanged} = props
  const [dateSelected, setSelectedDate] = useState({}) // selected date
  const [selectedPrgmObj, setSelectedPrgmObj] = useState({}) // selected prgm 
  const [isShowDetailPopup, setShowDetailPopup] = useState(false) // to show the details popup
  const [error, setError] = useState(false) // to set which error to be shown
  const [selectedDayPrgmList, setSelectedDayPrgmList] = useState([]) // display progm list of that selected date
  const [isPrgmListUpdated, setIsProgramListUpdated] = useState(false) // flag to check if the program list is updated from the cached one
  const [isLoading, showLoader] = useState(false)
  const [isError, showErrorPage] = useState(false) //to show the error or not
/* ---------------------------------------------------------------------------------------------------- */

  const { appMessages } = {}
  const { epgConfig } = {}
  const { epgTheme } = {}
  /* ---------------------------------------------------------------------------------------------------- */
  var db2 = new Dexie("test");
  db2.version(1).stores({
    raindrops:  "++,name"
});
var drops = [];
for (var i=0;i<100;++i) {
    drops.push({id: i, position: [Math.random(),Math.random(),Math.random()]})
}
 db2.raindrops.bulkPut(
  [{name: "Friend1"}, {name: "Friend2"}],
  ["id1", "id2"] // Specify keys array in 2nd arg
).then(function(lastKey) {
    console.log("Last raindrop's id was: " + lastKey); // Will be 100000.
}).catch(Dexie.BulkError, function (e) {
    // Explicitely catching the bulkAdd() operation makes those successful
    // additions commit despite that there were errors.
    console.error ("Some raindrops did not succeed. However, " +
       100000-e.failures.length + " raindrops was added successfully");
});

  /* ---------------------------------------------------------------------------------------------------- */
  const db = new Dexie("epgStore");
  db.version(2).stores({
    epgData:
      "++,epgPrgmArr",
  });
  /* ---------------------------------------------------------------------------------------------------- */
  function getCalenderDateArr() {
    return JSON.parse(localStorage.getItem("mytime")) || {}
  }

  function setCalenderDateArr(data) {
    data = JSON.stringify(data || [])
    return localStorage.setItem("mytime", data);
  }

  let programListArr = getCalenderDateArr() || []; // Feteched the calender list array
  let selectedDayProgram = [];
  var prefetchedDateArray = [];
  var calenderList = [] // calender list to be displayed is formed
  
/* ---------------------------------------------------------------------------------------------------- */
  
  const labelObj = { // contentful label config object 
    dateGroup: {
      sunday: appMessages?.label_epg_calendar_sunday || 'SUN',
      monday: appMessages?.label_epg_calendar_monday || 'MON',
      tuesday: appMessages?.label_epg_calendar_tuesday || 'TUE',
      wednesday: appMessages?.label_epg_calendar_wednesday || 'WED',
      thursday: appMessages?.label_epg_calendar_thursday || 'THU',
      friday: appMessages?.label_epg_calendar_friday || 'FRI',
      saturday: appMessages?.label_epg_calendar_saturday || 'SAT',
      today: appMessages?.label_epg_calendar_today || 'TODAY'
    }, 
    dayGroup: {
      Sunday: appMessages?.label_epg_details_sunday || 'Sunday',
      Monday: appMessages?.label_epg_details_monday || 'Monday',
      Tuesday: appMessages?.label_epg_details_tuesday || 'Tuesday',
      Wednesday: appMessages?.label_epg_details_wednesday || 'Wednesday',
      Thursday: appMessages?.label_epg_details_thursday || 'Thursday',
      Friday: appMessages?.label_epg_details_friday || 'Friday',
      Saturday: appMessages?.label_epg_details_saturday || 'Saturday',
      Today: appMessages?.label_epg_details_today || 'Today'
    }, 
    statusGroup: {
      upnext: appMessages?.label_component_up_next || 'UP NEXT',
      live: appMessages?.label_component_live || 'LIVE'
    },
    buttonGroup: {
      play: appMessages?.label_epg_button_play || 'PLAY',
      liveMapping: appMessages?.label_epg_button_live_mapping || 'VIEW LIVE TIMING & LIVE MAPS'
    },
    textGroup: {
      localRallyTime: appMessages?.label_epg_text_localRallyTime || 'Local Rally Time'
    }, 
    timeGroup: {
      hr: appMessages?.label_epg_duration_hr || 'h',
      min: appMessages?.label_epg_duration_min || 'min',
      sec: appMessages?.label_epg_duration_sec || 's',
      am: appMessages?.label_epg_time_AM || 'AM',
      pm: appMessages?.label_epg_time_PM || 'PM'
    }
  }
/* ------------------------------------------------------------------------------------------------------------------ */

  const dateArry = { // days key value pair
    0: appMessages?.label_epg_calendar_sunday || 'SUN',
    1: appMessages?.label_epg_calendar_monday || 'MON',
    2: appMessages?.label_epg_calendar_tuesday || 'TUE',
    3: appMessages?.label_epg_calendar_wednesday || 'WED',
    4: appMessages?.label_epg_calendar_thursday || 'THU',
    5: appMessages?.label_epg_calendar_friday || 'FRI',
    6: appMessages?.label_epg_calendar_saturday || 'SAT'
  }
/* ---------------------------------------------------------------------------------------------------- */
  useEffect(() => {
    timeUtils.setLabelObj(labelObj)
  },[labelObj])
/* ---------------------------------------------------------------------------------------------------- */

  // // Listener to handle login status
  // const isLoggedIn = false;
  // const onUserStateChanged = (loginStatus) => {
  //   // handle according to login status
  // }
  useEffect(() => { 
    // const isLoggedIn = onUserStateChanged()
  }, [onUserStateChanged])
/* ---------------------------------------------------------------------------------------------------- */

  // Listener to handle subscribe status
  // const isSubscribed = false;
  // const onApplicationChanged = (subscribeStatus) => {
    // handle according to subscribe status
  // }
  useEffect(() => { 
    // const isSubscribed = onApplicationChanged()
  }, [onApplicationChanged])
/* ---------------------------------------------------------------------------------------------------- */

  const contentfulConfig = { // Contentful configs from epg config
    numberOfPreviousDay: epgConfig?.numberOfPreviousDay || 5,
    numberOfUpNextDay: epgConfig?.numberOfUpNextDay || 5,
    showDetailPopup: epgConfig?.showDetailPopup || false,
    prefetchData: epgConfig?.prefetchData || 5
  }
/* ---------------------------------------------------------------------------------------------------- */
  const getProgramData = () => { // fetched the programs of the selected date from local storage, if there is any data.
    selectedDayProgram = programListArr[dateSelected.dateString]
    return selectedDayProgram;
  }
  /* ---------------------------------------------------------------------------------------------------- */
    var dateObj; // To form the date Object
    /*--------------------------------------------------------------- */
    // for past days
    if(contentfulConfig?.numberOfPreviousDay) {
        var minDate;
        for(let i = contentfulConfig.numberOfPreviousDay; i >= 1 ; i--) {
            minDate = moment().startOf('day').add('day', -i); 
            dateObj = {
                date: (minDate?._d).getDate() > 9 ? `${(minDate?._d).getDate()}` : `0${(minDate?._d).getDate()}`,
                day:  dateArry[(minDate?._d).getDay()],
                dateString: moment().add('day', -i).format('DD/MM/YYYY'),
                startTime: minDate.valueOf(),
                endTime: moment().endOf('day').add('day', -i).valueOf()
            }
            calenderList.push(dateObj);
        }
    }
    /*--------------------------------------------------------------- */
    // for today
    var today = moment().startOf('day');
    dateObj = {
        date: (today?._d).getDate() > 9 ? `${(today?._d).getDate()}` : `0${(today?._d).getDate()}`,
        day:  labelObj.dateGroup.today,
        dateString: moment().add('day').format('DD/MM/YYYY'),
        startTime: today.valueOf(),
        endTime: moment().endOf('day').valueOf(),
    }
    calenderList.push(dateObj);
    /*--------------------------------------------------------------- */
    // for upcoming days
    if(contentfulConfig?.numberOfUpNextDay) {
        var maxDate;
        for(let i = 1; i <= contentfulConfig.numberOfUpNextDay; i++) {
            maxDate = moment().startOf('day').add('day', i);
            dateObj = {
                date: (maxDate?._d).getDate() > 9 ? `${(maxDate?._d).getDate()}` : `0${(maxDate?._d).getDate()}`,
                day:  dateArry[(maxDate?._d).getDay()],
                dateString: moment().add('day', i).format('DD/MM/YYYY'),
                startTime: maxDate.valueOf(),
                endTime: moment().endOf('day').add('day', i).valueOf(),
            }
            calenderList.push(dateObj);
        }
    }
/* ---------------------------------------------------------------------------------------------------- */

  const getPrefetchedDateArr = () => { // Prefetch date array formation
    const num = contentfulConfig?.prefetchData;
    const dateIndex = calenderList.findIndex(item => item.day === labelObj.dateGroup.today)
    const dateArray1 = calenderList.slice(dateIndex-num >= 0 ?dateIndex-num : 0 ,dateIndex);
    const dateArray2 = calenderList.slice(dateIndex+1, dateIndex+(num+1) <= (calenderList.length) ? dateIndex+(num+1) : calenderList.length );
    console.log(dateIndex, dateArray1, dateArray2)
    const dateArray = dateArray1.concat(dateArray2);
    return dateArray;
  }

  const getProgramList = (query) => {
    const url = `https://xsoxojbrz2.execute-api.ap-south-1.amazonaws.com/wrc-rally-tv-dev-b/content/channels?${query}&range=-1`

    var xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = (e) => {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          console.log("request_error", xhr.responseText);
          resolve(xhr.responseText);
        }
      };

      xhr.onerror = function(error){
        console.error( 'new request_error', error );
    }
      xhr.open("GET", url);

      xhr.send();
    });
  }
/* ---------------------------------------------------------------------------------------------------- */
  const getPrefetchedData = () => { // Initial func to call all the dates depending on the prefetch condition
    prefetchedDateArray = getPrefetchedDateArr();
    if(prefetchedDateArray && prefetchedDateArray.length > 0) {
      prefetchedDateArray.forEach( arr =>  {
        if(!((programListArr, arr.dateString))) {
          const queryString = `byListingTime=${arr.startTime}~${arr.endTime}`
            getProgramList(queryString).then((res = {}) => {
              var programData = res?.entries?.[0]?.listings || []
              timeUtils.getFormattedProgramList(programData, arr.dateString, programListArr)
            }).catch(() => {
              console.log('error')
            })
        }
      })
    }
  }
/* ---------------------------------------------------------------------------------------------------- */
  useEffect(getPrefetchedData,[epgConfig]) // Initially the program details for the prefetched num of days is called
/* ---------------------------------------------------------------------------------------------------- */

  const dataList = {}
  /*--------------------------------------------------------------- */
  const onFetchProgramDataOnDateSelect = () => { // program details of the selected date fetched from api again
    var programData = [];
    setSelectedDayPrgmList(selectedDayProgram || [])
    // showLoader(false)
    showErrorPage(false)
    if((dateSelected?.startTime && dateSelected?.endTime)) { // start time nd end time of the selected date
        const queryString = `byListingTime=${dateSelected.startTime}~${dateSelected.endTime}` // api to get the program details of each date selected
        if(!((programListArr, dateSelected.dateString))) {
          showLoader(true)
        }
          getProgramList(queryString).then(async(response = {}) => { // api call success
            let res = JSON.parse(response);
            // console.log("hesana", res)
            var programList = []
            programData = res?.entries?.[0]?.listings || []
            showLoader(false)
            const attr = { // analytics call
              "date" : dateSelected?.dateString || '',
              "isEpgProgramsAvailable": programData?.length > 0 ? true : false 
            }
            fetchAnalytics('log','ApiSuccess', attr, 'DEBUG')
    /*--------------------------------------------------------------- */
            if(programData?.length > 0) {
              var program = {};
              var selectedDateDetails = []
              programData.map((programItem, index) => {
                  program = { // formation of prgm obj into required format
                    id: programItem?.program?.id,
                    title: programItem?.program?.title,
                    logo: programItem?.program?.championshipLogo?.[0]?.url ,
                    thumbnail: programItem?.images,
                    startTime: timeUtils.epochToUTCStdString(programItem?.startTime || 0) ,
                    endTime: timeUtils.epochToUTCStdString(programItem?.endTime || 0),
                    startTimeStd: programItem?.startTime || 0,
                    endTimeStd: programItem?.endTime || 0,
                    duration: timeUtils.getDuration(programItem?.startTime, programItem?.endTime),
                    localRallyTime: timeUtils.getRallyTime(programItem?.localTime || 1672117279000),
                    liveEvent: "", 
                    isShowLockIcon: true, // NOTE: for loggedin users it should be false
                    purchaseModeLogo: timeUtils.getPurchaseModeLogo('lock')
                  }
                  return programList.push(program); // an array of programs of the selected date is pushed to the programList Array 
              })
     /*--------------------------------------------------------------- */
              showLoader(false)
              dataList[dateSelected.dateString] = programList; // programs of the xth day is pushed to a object i.e dataList[15-2-2022] = [array of prgms]
              setSelectedDayPrgmList(programList) // prorgam list is set to state
              var newDataList = {...programListArr, ...dataList} // a new obj is formed by combinig the current progrsmlists and the data in locl storage
              
              selectedDateDetails = programListArr[dateSelected.dateString] || []; // data is local storsge for that particular date is assigned to selectedDateDetails obj
              // db.epgData.delete();

             // Data storage in database in dexie indexedDB
              const dataSelect = await db.epgData.get(`${dateSelected.dateString}`);
              const selectedDateDetailsDB = dataSelect?.epgPrgmArr ? dataSelect.epgPrgmArr : [] //data is index db  for that particular date is assigned to selectedDateDetailsDB obj
               // selectedDateDetailsDB and selectedDateDetails are same 
                console.log("selectedDateDetailsDB", selectedDateDetailsDB)

              /*--------------------------------------------------------------- */
              if(JSON.stringify(programList) !== JSON.stringify(selectedDateDetailsDB)) { // comparing for any diff
                setIsProgramListUpdated(true); // if there is any the local storage is updated
      /*--------------------------------------------------------------- */
                try {

                  db.epgData.bulkPut([{epgPrgmArr: programList}],
                    [dateSelected.dateString]).then(result => {
                      alert ("Successfully stored the array epgData");
                  }).catch(error => {
                      alert ("Error: epgData  " + error);
                  });

                  setCalenderDateArr(newDataList) 

                } catch (e) {
                  console.log("Local Storage is full, Please empty data");
                }              
              }else {
                setIsProgramListUpdated(false);
              }
            }    
      /*--------------------------------------------------------------- */
          }).catch((error) => { // api failure
            showLoader(false)
            showErrorPage(true) // to show the error page
            const attr = {
              "errorDescription" : error?.message,
              "errorCode" : error?.code
            }
            fetchAnalytics('log','ApiFailureError', attr, 'ERROR')
            console.log('error', error)
          })
    }  
  }
/* ---------------------------------------------------------------------------------------------------- */

// analytics amd loggly callback
  const fetchAnalytics = (type, event, attr = {}, level = '') => { 
    // type: analytics/loggly, event: eventType , attr: attributes, level: loggly loglevel
    const data = {
      "attrObj": {
        "timestamp": Number(new Date()),
      }
    }
    const attrObject = {...data.attrObj, ...attr}
    data.attrObj = attrObject
    if(type === 'analytics') { // data to be passed to analytics
      data.eventName = '_content.epg'
      data.action = event
      console.log("analytics", data)
    } else if(type === 'log') { // datat to be paassed to loggly
      data.module = "Epg"
      data.typeCode = event
      data.logLevel = level;
      console.log("log", data)
    }
  }
/* ---------------------------------------------------------------------------------------------------- */

  useEffect(onFetchProgramDataOnDateSelect,[dateSelected])
/* ---------------------------------------------------------------------------------------------------- */

  const closeBtnHandle = () => { // close the details popup
    setShowDetailPopup(false)
  }
  /* ---------------------------------------------------------------------------------------------------- */
  const closeHandleOutside = () => { // close the details popup on click outside
    setShowDetailPopup(false)
  }
  /* ---------------------------------------------------------------------------------------------------- */

  const onLoadLiveMapping = () => {
    // callback to handle live mapping
    const attr = {
      "program_title" : selectedPrgmObj?.title || '',
      "program_id": selectedPrgmObj?.id || '',
    }
    fetchAnalytics('analytics','epg_live_timing_click', attr)
  }
/* ---------------------------------------------------------------------------------------------------- */

  const onLoadPlayer = () => {
    // handle callback for playback
    const attr = {
      "program_title" : selectedPrgmObj?.title || '',
      "program_id": selectedPrgmObj?.id || '',
      "program_type": selectedPrgmObj?.isLive ? 'live' : 'vod' 
    }
    fetchAnalytics('analytics','epg_play_click', attr)
  }
/* ---------------------------------------------------------------------------------------------------- */



/* ---------------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------------- */

  return (
    <div id="wrapper">

      <EpgConfig theme={epgTheme} prefetchedDateArray={prefetchedDateArray} programData={isPrgmListUpdated ? selectedDayPrgmList : getProgramData()} isError={!getProgramData() && isError}
        contentfulConfig={contentfulConfig} setSelectedDate={setSelectedDate} setShowDetailPopup={setShowDetailPopup} setSelectedPrgmObj={setSelectedPrgmObj} isLoading={!getProgramData() && isLoading} dateSelected={dateSelected}
        calenderList={calenderList} setError={setError} error={error} fetchAnalytics={fetchAnalytics} labelObj={labelObj} />
      
    </div>
  )
}

/* --------------------------------------------- */
export default EpgWrapper
/* --------------------------------------------- */
