
/* --------------------------------------------- */
// To get the duration of a program
var translations = {};
var dateArray = {};
/* --------------------------------------------- */

const setLabelObj = (labelObj) => {
    translations = {
        hr: labelObj?.timeGroup?.hr || 'h',
        min: labelObj?.timeGroup?.min || 'min',
        sec: labelObj?.timeGroup?.sec || 's',
        am: labelObj?.timeGroup?.am || 'AM',
        pm: labelObj?.timeGroup?.pm || 'PM'
    }
    dateArray = { // days key value pair
        0: labelObj?.dateGroup?.sunday || 'SUN',
        1: labelObj?.dateGroup?.monday || 'MON',
        2: labelObj?.dateGroup?.tuesday || 'TUE',
        3: labelObj?.dateGroup?.wednesday || 'WED',
        4: labelObj?.dateGroup?.thursday || 'THU',
        5: labelObj?.dateGroup?.friday || 'FRI',
        6: labelObj?.dateGroup?.saturday || 'SAT'
    }
}

function setCalenderDateArr(data) {
    data = JSON.stringify(data || [])
    return localStorage.setItem("mytime", data);
}


const getDuration = (startTime, endTime) => {
    var seconds = ((new Date(endTime)).getTime() - (new Date(startTime)).getTime()) / 1000;
    var h = Math.floor(seconds / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);
    var hDisplay = h > 0 ? h + (h === 1 ? ` ${translations.hr} ` : ` ${translations.hr} `) : "";
    var mDisplay = m > 0 ? m + (m === 1 ? ` ${translations.min} ` : ` ${translations.min} `) : "";
    var sDisplay = s > 0 ? s + (s === 1 ? ` ${translations.sec} ` : ` ${translations.sec} `) : "";
    return hDisplay + mDisplay + sDisplay; 
}
/* --------------------------------------------- */

// const getFormattedTime = (h, m, s) => {

//     var hDisplay = h > 0 ? h + (h == 1 ? " h, " : " h, ") : "";
//     var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " min, ") : "";
//     var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
//     return hDisplay + mDisplay + sDisplay; 
// }

// Converted the time to readable format

const epochToUTCString = (time) => { //get return in 24 hr format
    return `${('0' + new Date(time).getHours()).slice(-2)}:${('0' + new Date(time).getMinutes()).slice(-2)} `
}
/* --------------------------------------------- */
const epochToUTCStdString = (time) => { // get the return in PM / AM format
    var date = new Date(time);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? translations.pm : translations.am;
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm; 
}
/* --------------------------------------------- */
const getPurchaseModeLogo = (mode) => { // FUnction to get the purchase mode
    if (mode !== undefined) {
        if (mode === 'free') {
            return({ src: `${process.env.PUBLIC_URL}/imgs/free_icon.svg`, title: 'free_content'})
        } else {
            return ({ src: `${process.env.PUBLIC_URL}/imgs/lock_icon.svg`, title: 'premium_content'})
        }
    }
}
/* --------------------------------------------- */
const getRallyTime = (utcTime) => {
    var date = new Date(utcTime);
    const time = epochToUTCStdString(utcTime);
    const dayNum = date.getDay();
    const day = dateArray[dayNum]

    return `${day} ${time}`
}
var dataList = {}
/* --------------------------------------------- */
const getFormattedProgramList = (programData, dateObjStr, programListArr) => { // Fetched details is set to local storage
    var programList = []
    if(programData?.length > 0) {
        var program = {};
        programData.map((programItem, index) => {
            program = {
                id: programItem?.program?.id,
                title: programItem?.program?.title,
                logo: programItem?.program?.championshipLogo?.[0]?.url ,
                thumbnail: programItem?.images,
                startTime: epochToUTCStdString(programItem?.startTime || 0) ,
                endTime: epochToUTCStdString(programItem?.endTime || 0),
                startTimeStd: programItem?.startTime || 0,
                endTimeStd: programItem?.endTime || 0,
                duration: getDuration(programItem?.startTime, programItem?.endTime),
                localRallyTime: timeUtils.getRallyTime(programItem?.localTime || 1672117279000),
                liveEvent: "", 
                isShowLockIcon: true, // NOTE: for loggedin users it should be false
                purchaseModeLogo: getPurchaseModeLogo('lock')
        
            }
            return programList.push(program);
        })
        dataList[dateObjStr] = programList;
        dataList = {...programListArr, ...dataList}
        setCalenderDateArr(dataList)
    }
}
/* --------------------------------------------- */
// To check if the item is in view port
const isElementInViewPort = (ele) => {
    let isInViewport = false
    const rect = ele?.getBoundingClientRect();

    if(rect) {
        isInViewport = rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth);    
    }
    return isInViewport
}
/* --------------------------------------------- */

var timeUtils = {
    getFormattedProgramList,
    getDuration,
    getPurchaseModeLogo,
    epochToUTCString,
    epochToUTCStdString,
    isElementInViewPort,
    setLabelObj, 
    getRallyTime
}

export default timeUtils
