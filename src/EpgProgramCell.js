import React from 'react'
// import { ImgHolder } from './EpgStyle';

const EpgProgramCell = (props) => {
    const {programDetails, onSelectProgram, referance, index, labelObj} = props;
    /* --------------------------------------------- */
    const onSelectProgramDetails = (programDetails) => { // func called when a porgm is selected
        onSelectProgram(programDetails) // callback func
    }

    /* --------------------------------------------- */

    // REMOVE LATER: May be needed for header handling

    // useEffect(() => { // epg header handling
    //     const onScroll = () => {
    //         const epgHeader = document.getElementsByClassName('epg-header')[0];
    //         if(window.scrollY >= 100) {
    //             epgHeader.style.display = 'none';
    //         } else {
    //             epgHeader.style.display = 'block';
    //         }
    //     };
    //     window.removeEventListener('scroll', onScroll);
    //     window.addEventListener('scroll', onScroll);
    //     return () => window.removeEventListener('scroll', onScroll);
    // }, []);
    //  /* --------------------------------------------- */ 
    
  return (
    <div className={`epg-cell ${programDetails.isLive ?'cell-highlight':''}`} ref={referance(programDetails, index)} onClick={() => onSelectProgramDetails(programDetails)}>
        <div className='railitem-image-container'>
                {/* <ImgHolder {...{images: programDetails.thumbnail}}  className='railitem-image'>
                    <div></div>
                </ImgHolder> */}
            <img className='railitem-image' src={programDetails.thumbnail[0].url} alt='thumbnail' />
            <div className='railitem-tagcontainer-wrapper'>
                <div className='railitem-tagcontainer'>
                <img className= 'railitem-tagcontainer-image' src={programDetails.logo} alt='logo'/>
                {/* <img className= 'railitem-tagcontainer-image' src={programDetails.purchaseModeLogo.src} alt='logo'/> */}
                </div>
                <div className='railitem-tagcontainer-triangle'/>
            </div>
            <div className={`live-label ${programDetails.isUpNext ? 'up-next' : 'on-live'}`}>
                {programDetails.isLive ? labelObj.statusGroup.live : programDetails.isUpNext ? labelObj.statusGroup.upnext : ''}
            </div>
        </div>
        <div className='railitem-details-container'>
            <div className='railitem-details-top'>
                <p className='program-time'>{programDetails.startTime}</p>
                {programDetails.isLive ? <div className='local-time'>
                    {`${labelObj.textGroup.localRallyTime} - ${programDetails.localRallyTime}`}
                </div> : null}
                <p className='title'>{programDetails.title}</p>
            </div>
            <div className='railitem-details-bottom'>
                <p>{programDetails.duration}</p>
            </div>
        </div>    
    </div>
  )
}

/* --------------------------------------------- */
export default EpgProgramCell
/* --------------------------------------------- */
