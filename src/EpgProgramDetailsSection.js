import React, { useRef, useLayoutEffect } from 'react'
// import { WarningIconFilled, WarningIcon } from '../errors/ErrorPage/style'
import EpgCellSkeleton from './EpgCellSkeleton';
import EpgProgramCell from './EpgProgramCell'

const EpgProgramDetailsSection = (props) => {
    const {programList = [], onSelectProgram, isLoading, isError, setError, error, labelObj, handleErrorPageBtnClick} = props;
    /* ---------------------------------------------------------------------------------------------------- */
    const placeholder = 10; //NEED: need to configure from contentful
/* ---------------------------------------------------------------------------------------------------- */

    const onPrimaryBtnClick = () => { // hanlde the button click of error popup
        console.log("go to video on demand") 
        handleErrorPageBtnClick() // callback func to handle the button click handled in epg Wrpper
    }
/* ---------------------------------------------------------------------------------------------------- */
    const showPlaceholderNError = () => {
        if(isLoading) { 
            // Show placeholder if the state is loading
            const rows = [];
            for(let i =0; i<placeholder; i++){
                rows.push(<EpgCellSkeleton/>)
            }
            return rows
        // } else if(isError && !error) { 
        //     // if error occured then technical difficulty error should be shown
        //     setError({ type: " EpgApiError", value: { onPrimaryBtnClick }, errorIcon: <WarningIcon width={39} height={39} bottom={15.33} />, componentId:'epg-error' })
        // } else if (!error) { 
        //     // if there is no error and the prgam array is empty then no program error page should be shown
        //     setError({type: "EPGNoProgrammes", value: { onPrimaryBtnClick }, errorIcon: <WarningIconFilled width={39} height={39} bottom={15.33}/>, componentId:'epg-error'})
        }
        
    }
/* ---------------------------------------------------------------------------------------------------- */
    const liveProgramRef = useRef(null) // reference for live prgm, used to scroll to live program to center
    const upNextProgramRef = useRef(null)// reference for upnext prgm, used to scroll to upnext program to center in the absence of live
    const firstProgramRef = useRef(null)// reference for first prgm, used to scroll the page to the first program when thre is no live and upnext
    /*--------------------------------------------------------------- */
    const getRef = (item, index) => { // callback func to hndle the refs
        if(item.isLive) return liveProgramRef
        if(item.isUpNext) return upNextProgramRef
        if(index === 0) return firstProgramRef
        return undefined
    }
/* ---------------------------------------------------------------------------------------------------- */
    const scrollHandler = () => { // func to handle scroll
        if (liveProgramRef.current) {
             // Scroll live element to view
             liveProgramRef.current.scrollIntoView({
                 behavior: 'instant',
                 block: 'center',
               }, 900);
               return
         } else if (upNextProgramRef.current) {
             // scroll up next to view
             upNextProgramRef.current.scrollIntoView({
                 behavior: 'instant',
                 block: 'center',
             }, 800);
             return
         } else if (firstProgramRef.current) {
            // scroll to first element
             firstProgramRef.current.scrollIntoView({
                 behavior: 'instant',
                 block: 'center',
             }, 800);
         }
    }
/* ---------------------------------------------------------------------------------------------------- */
    const scrollRef = useRef(null)
    useLayoutEffect(() => { // to handle scroll while resizing
        scrollRef.current = setTimeout(scrollHandler, 200)
        window.addEventListener("resize", scrollHandler);
        return () => {
            window.removeEventListener("resize", scrollHandler);
            clearTimeout(scrollRef.current)
        }
    },[programList])
/* ---------------------------------------------------------------------------------------------------- */

    return (
    <div className='epg-container'>
        {programList.length ? programList.map((item, index) => {
                return <EpgProgramCell key={index} programDetails ={item} onSelectProgram={onSelectProgram}  referance={getRef} index={index} labelObj={labelObj}/>
            }) : showPlaceholderNError()
        }
    </div>
  )
}

/* --------------------------------------------- */
export default EpgProgramDetailsSection
/* --------------------------------------------- */