import React from 'react'

const EpgCellSkeleton = (props) => {
  return (
    <div className='epg-cell placeholder'>
        <div className='railitem-image-container'>
        </div>
        <div className='railitem-details-container'>
            <div className='railitem-details-top'>
                <p className='program-time' />
                <div className='local-time'/>
                <p className='title'/>
                <p className='title'/>
            </div>
            <div className='railitem-details-bottom'/>
        </div>    
    </div>
  )
}

/* --------------------------------------------- */
export default EpgCellSkeleton
/* --------------------------------------------- */
