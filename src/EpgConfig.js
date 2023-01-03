import React from 'react'
import EpgDataContainer from './EpgDataContainer'

const EpgConfig = (props) => {
    const { programData, setSelectedDate, setShowDetailPopup, setSelectedPrgmObj, isLoading, isError, error, 
        dateSelected, calenderList, prefetchedDateArray, theme, setError, fetchAnalytics, labelObj, handleErrorPageBtnClick} = props;

    /* ------------------------------------------------------------------------------------------------------------------ */
    const contentFulThemeConfig =  { // Forming the contentful config
        background: {
            primary: "#282828"
        },		
        datePicker: {
            text:{			
                primary: theme?.compositeStyle?.tertiaryButton?.normal?.text || "#FFFFFF",			
                secondary: theme?.compositeStyle?.tertiaryButton?.focussed?.text || "#FC4C02",
                tertiary: theme?.compositeStyle?.tertiaryButton?.selected?.text || "#FC4C02",
            }, 
            stroke: theme?.compositeStyle?.tertiaryButton?.selected?.stroke || "#FC4C02",
            background: theme?.header?.background?.primary || "#1E1E1E" ,
            border: theme?.header?.accent?.tertiary || "#353535"     		              
        },		
        programCell: {
            header: {
                primary: theme?.body?.text?.secondary || "#FC4C02",
                secondary: theme?.body?.text?.primary || "#FFFFFF",
            },
            placeholder: {
                "background":theme?.body?.background?.disable || "#4A4A4A"
            },
            background:{         		
                primary: theme?.body?.background?.secondary || "#000000",			
                secondary: theme?.body?.background?.primary || "#1E1E1E"      	
            },			
            text: {				
                primary: theme?.body?.text?.tertiary || "#9D9D9D",				
                secondary: theme?.body?.text?.disable || "#C0C0C0",				
                tertiary: "#A6A6A6"			
            },
            tag:{         		
                primary: theme?.compositeStyle?.primaryButton?.normal?.background || "#FC4C02",			
                secondary:theme?.compositeStyle?.secondaryButton?.normal?.background || "#666666",		
                text:theme?.compositeStyle?.primaryButton?.normal?.text || "#FFFFFF",
                tertiary: theme?.body?.accent?.primary || "#9D9D9D",
                background: theme?.body?.background?.primary || "#1E1E1E"	
            },  	
        },
        arrows: {
            primary:theme?.header?.accent?.primary || "#FFFFFF",
            secondary:theme?.header?.accent?.secondary || "#FC4C02"
        }
    }

    /* ------------------------------------------------------------------------------------------------------------------ */
  return (
    <>
      <EpgDataContainer programList={programData} calenderList={calenderList} theme={contentFulThemeConfig} dateSelected={dateSelected} setSelectedPrgmObj={setSelectedPrgmObj}
      setSelectedDate={setSelectedDate} prefetchedDateArray={prefetchedDateArray} isLoading={isLoading} setShowDetailPopup={setShowDetailPopup}
      isError={isError} error={error} setError={setError} fetchAnalytics={fetchAnalytics} labelObj={labelObj} handleErrorPageBtnClick={handleErrorPageBtnClick}/>
     </>
  )
}

/* --------------------------------------------- */
export default EpgConfig
/* --------------------------------------------- */
