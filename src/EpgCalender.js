import React, {useState, useEffect, useRef, useCallback} from 'react'
// import { isTablet, isMobile } from 'react-device-detect'
// import LeftArrowIcon from '../icons/LeftArrowIcon';
// import RightArrowIcon from '../icons/RightArrowIcon';


const EpgCalender = (props) => {
    const {calenderList, setSelectedDate, fetchAnalytics, labelObj} = props;

    const calenderScrollRef = useRef(null) // Reference for calender scroll, used to show the selected date in center
    const horizontalScrollRef = useRef(null)
    // const leftArrowRef = useRef(null) // Refernece for left handle, used for hiding and showing the element
    // const rightArrowRef = useRef(null) // Refernece for right handle, used for hiding and showing the element
    const windowEleRef = useRef(null) // Reference of the window component, which is the parent of the scrolle element. The overflow: scroll happens in this component.

    const [newDate, updatedDate] = useState({})
/* ---------------------------------------------------------------------------------------------------- */

// const handleArrowVisibility = () => {  // func to handle the arrow visibility
//       const windowWidth = document.querySelector('.epg-calender-container')?.clientWidth; // width of the window
//       const scrollWidth = document.querySelector('.epg-calender')?.clientWidth; // total width of the array
//     /*--------------------------------------------------------------- */
//       if(windowWidth && scrollWidth) {
//         const  currentScroll = windowEleRef.current.scrollLeft;
//         let scrollerEnd = scrollWidth - windowWidth;
//     /*--------------------------------------------------------------- */
//         if(scrollWidth < windowWidth) { // when the date array is within the window width
//           leftArrowRef.current.style.display = 'none'
//           rightArrowRef.current.style.display = 'none'
//    /*--------------------------------------------------------------- */
//         } else if(currentScroll < 10) {
//           // above check should ideally be currentScroll === 0,
//           // but sometime there may be a slight difference of couple of pixels hence the above condition
//           leftArrowRef.current.style.display = 'none'
//           rightArrowRef.current.style.display = 'block'
//     /*--------------------------------------------------------------- */
//         } else if(Math.abs(currentScroll - scrollerEnd) < 10) {
//           // above check should ideally be currentScroll === scrollerEnd,
//           // but sometime there may be a slight difference of couple of pixels hence the above condition
//           leftArrowRef.current.style.display = 'block'
//           rightArrowRef.current.style.display = 'none'
//     /*--------------------------------------------------------------- */
//         } else { // else show both the arrows
//           leftArrowRef.current.style.display = 'block'
//           rightArrowRef.current.style.display = 'block'
//         }
//       }
//   }
/* ---------------------------------------------------------------------------------------------------- */

    const handleDateSelect = (date)=>{ // callback func to get the selected date
      updatedDate(date)
      setSelectedDate(date)
      const attr = {
        "date" : date.dateString || ''
      } 
      // analytics call
      fetchAnalytics('analytics','calender_date_select', attr)
      fetchAnalytics('log','DateSelected', attr, 'INFO')

      window.scrollTo(0, 0);

    }
/* ---------------------------------------------------------------------------------------------------- */

    const handleCalenderScroll = useCallback((behavior = 'smooth', initialScroll = false) => { 
      // To handle the scroll and scroll behaviour
      // setTimeout(() => {
      //   handleArrowVisibility();
      //   if(calenderScrollRef.current && (initialScroll || isTablet || isMobile)) {
      //     // scroll to center is enabled for mobile and tablet view and only initially for desktop view 
      //       calenderScrollRef.current.scrollIntoView({
      //           behavior: behavior,
      //           inline: 'center',
      //         });
      //   }
      // }, 400)
    }, [])
/* ---------------------------------------------------------------------------------------------------- */

  const onClickLeftArrow = () => { // Handle the left scroll
    const scrollWidth  = 210 
    // 210: Width of 1 div calender date div is 70px so approx 3 elements will be scrolled in 1 click
    const  currentScroll = windowEleRef.current.scrollLeft
    windowEleRef.current.scroll({
      left: currentScroll - scrollWidth
    })
  }
/* ---------------------------------------------------------------------------------------------------- */

  const onClickRightArrow = () => { // handle right scroll
    const scrollWidth  = 210 
    // 210: Width of 1 div calender date div is 70px so approx 3 elements will be scrolled in 1 click
    const  currentScroll = windowEleRef.current.scrollLeft
    windowEleRef.current.scroll({
      left: currentScroll + scrollWidth
    })
  }
/* ---------------------------------------------------------------------------------------------------- */
  
  const onSelectDate = () => { // By default setting the selected date to today
    const date = calenderList.filter(item => item.day === labelObj.dateGroup.today)
    handleDateSelect(date?.[0] || {})
  }
  
  useEffect(onSelectDate,[])
/* ---------------------------------------------------------------------------------------------------- */

  useEffect(() => { // scroll func is called when each date is selected
      handleCalenderScroll('smooth');
  }, [calenderScrollRef, newDate, handleCalenderScroll])
/* ---------------------------------------------------------------------------------------------------- */

  useEffect(() => { // useeffect invoked only during initial loading only for one time
    handleCalenderScroll('instant', true);
  }, [handleCalenderScroll])
/* ---------------------------------------------------------------------------------------------------- */

  const onHandleResize = () => {
    window.addEventListener("resize", () => handleCalenderScroll('smooth'));
      return () => {
        window.removeEventListener("resize", () => handleCalenderScroll('smooth'));
      };
  }
  useEffect(onHandleResize, []);
/* ---------------------------------------------------------------------------------------------------- */

  // const onShowArrows = () => { // listener to show the scroll arrows
  //   windowEleRef.current.addEventListener('scroll', handleArrowVisibility)
  //       return () => windowEleRef.current.removeEventListener('scroll', handleArrowVisibility)
  
  // }
  // useEffect(onShowArrows, []);
/* ---------------------------------------------------------------------------------------------------- */
    
   return (
    <div ref={windowEleRef} className='epg-calender-container'>
      <div className='epg-calender'>
        {/* <div ref={leftArrowRef} className='left-arrow' onClick={onClickLeftArrow}>
          <LeftArrowIcon />
        </div>         */}
        {calenderList.map((item, index)  => 
            <div className='calender-date'>
                <div key={index} ref={item.dateString === newDate.dateString ? calenderScrollRef : horizontalScrollRef} className={`calender-date-switcher ${item.dateString === newDate.dateString ? 'active': ''}`} onClick={() => handleDateSelect(item)}>
                <p>{item.day}</p>
                <p>{item.date}</p>
                </div>
            </div>
        )}
        {/* <div ref={rightArrowRef} className='right-arrow' onClick={onClickRightArrow}>
          <RightArrowIcon />
        </div> */}
      </div>
      
    </div>
  )
}

/* --------------------------------------------- */
export default EpgCalender
/* --------------------------------------------- */
