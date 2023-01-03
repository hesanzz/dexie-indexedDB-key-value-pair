import React, { useEffect, useState } from 'react'
/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */
import EpgCalender from './EpgCalender'
import EpgProgramDetailsSection from './EpgProgramDetailsSection'
/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */
 // All the details and functions will be handled here

const EpgDataContainer = (props) => {
    const {programList, calenderList, theme, setSelectedDate, setShowDetailPopup, dateSelected, isLoading, 
      isError, setSelectedPrgmObj, setError, error, fetchAnalytics, labelObj, handleErrorPageBtnClick} = props  
    /* ---------------------------------------------------------------------------------------------------- */
    const [selectedDayPrgmArr, setSelectedDayPrgmArr] = useState([]) // to update the selected day progm depending o the live / upnext status
  /* ---------------------------------------------------------------------------------------------------- */
  /* ---------------------------------------------------------------------------------------------------- */
    let prgmArr = programList;
    let timeoutId = '';
/* ---------------------------------------------------------------------------------------------------- */
    const onSelectProgram = (selectedItem) => { // When a program from the list is selected, callback func from epgDetailsCell
      prgmStateHandle(selectedItem); // func to add few more dynamic params along with the selected prgm
      setShowDetailPopup(true) //show the details popup
      const attr = {
        "program_title" : selectedItem?.title || '',
        "program_id": selectedItem?.id || '',
        "date": dateSelected?.dateString || ''
      }
      fetchAnalytics('analytics','program_select', attr) // to call analytics
      fetchAnalytics('log','ProgramSelected', attr, 'INFO') // to call loggly
    }
/* ---------------------------------------------------------------------------------------------------- */

    const prgmStateHandle = (selectedPrgm) => { // Is live timing button and play button to be shown is handled here and passed along with selected program 
      var dataObj = {}
      if((selectedPrgm)) {
        // enabling play button for passed events
        if(selectedPrgm.endTimeStd < new Date().getTime()) {
          dataObj.isShouldShowPlay = true;
        }
        // to hide play button for upcoming events
        if(selectedPrgm.startTimeStd > new Date().getTime()) {
          dataObj.isShouldShowPlay = false;
          // enabling play button for live event as live mapping button will be enabled for live (assuming all other params to be true)
        } else if(selectedPrgm.startTimeStd < new Date().getTime() && new Date().getTime() < selectedPrgm.endTimeStd) {
          dataObj.isShouldShowPlay = true;
        }
        var newData = {...selectedPrgm, ...dataObj}
        setSelectedPrgmObj(newData) // updated the selected program
      }
    }
/* ---------------------------------------------------------------------------------------------------- */
    const updateStatusOfPrgm = () => { // update the status of today's prgm i.e isLive or isUpNext 
      let istimerUpdate = false;
      if(dateSelected?.day !== labelObj.dateGroup.today) return
      if(dateSelected?.day === labelObj.dateGroup.today && prgmArr.length > 0) {
   /*--------------------------------------------------------------- */
        for(let i = 0; i < prgmArr.length; i++) {
          //check if the current time is between start time and end time
          if(prgmArr[i].startTimeStd < new Date().getTime() && new Date().getTime() < prgmArr[i].endTimeStd) {
            prgmArr[i].isLive = true;
            prgmArr[i].isUpNext = false;
            var timer = prgmArr[i].endTimeStd - new Date().getTime();
            if(i+1 < prgmArr.length) { // updating the next item to up next
              prgmArr[i+1].isUpNext = true;
            }
            istimerUpdate = true;
            break;
          }else {
              prgmArr[i].isLive = false;
              if(i+1 < prgmArr.length) {
                prgmArr[i+1].isUpNext = false;
              }        
          }
    /*--------------------------------------------------------------- */
          // In case if there is no live asset, the first asset whose starttime is higher than currnt time will be marked as up next.
          if(prgmArr[i].startTimeStd > new Date().getTime()){
            prgmArr[i].isUpNext = true;
            timer = prgmArr[i].startTimeStd - new Date().getTime();
            istimerUpdate = true;
            break;
          }
        }
    /*--------------------------------------------------------------- */
        // After the timer is updated
        let prgmArray = prgmArr
          setSelectedDayPrgmArr([...prgmArray]) // state updating with updated array
          clearTimeout(timeoutId)
          if(istimerUpdate) {
            timeoutId = setTimeout(() => {
              updateStatusOfPrgm()   // re-rendering after the time out func
            }, timer);
          }
        } else {
          let prgmArray = prgmArr
          setSelectedDayPrgmArr([...prgmArray])
          if(timeoutId) {
            clearTimeout(timeoutId);
          }
      }
    }
/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */
const todaysProgramList = () => { // Initially the program details for the prefetched num of days is called
  if(dateSelected?.day === labelObj.dateGroup.today && prgmArr?.length > 0) {
    updateStatusOfPrgm();
  } else {  // if not today then the array is directly updated to state variable
    setSelectedDayPrgmArr(programList)
    if(timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
/* ---------------------------------------------------------------------------------------------------- */
    useEffect(todaysProgramList,[programList])

/* ---------------------------------------------------------------------------------------------------- */
  return (
    <div {...{ theme }} className='epg-details-page'>
      <EpgCalender calenderList={calenderList} {...{ theme }} setSelectedDate={setSelectedDate} fetchAnalytics={fetchAnalytics} labelObj={labelObj}/>
      <EpgProgramDetailsSection programList = {selectedDayPrgmArr} onSelectProgram={onSelectProgram} isLoading={isLoading} labelObj={labelObj}
      isError={isError} error={error} setError={setError} handleErrorPageBtnClick={handleErrorPageBtnClick}/>
    </div>
  )
}

/* --------------------------------------------- */
export default EpgDataContainer
/* --------------------------------------------- */