import React, {Component,useState,useEffect, useMemo} from 'react'
import Header from "./header";
import Footer from "./footer";
import './dashboard.css'
import { Fragment } from "react";
import Moment from 'moment';


function Dashboard () {

    const [directoryApiResponse, setDirectoryApiResponse]=useState([]);
    const [missedAlertFile, setmissedAlertFile]=useState([]);
    const [closedAlertFile, setclosedAlertFile]=useState([]);
    const [isdirectoryUpdated, setDirectoryUpdated]=useState("");

    const [missedAlertTime, setMissedAlertTime]=useState(null);
    async function getMissedAlertTime() {
        await fetch("/missedAlertTimeAPI")
              .then(res => res.json())
              .then(res => setMissedAlertTime(res))                           
    };

    useEffect(()=>{
        getMissedAlertTime();
    },[])

    const [dirRefreshTime, setDirRefreshTime]=useState(null);
    async function getDirRefreshTime() {
        await fetch("/dirRefreshTimeAPI")
              .then(res => res.json())
              .then(res => setDirRefreshTime(res))                        
    };

    const [dirMissedTime, setDirMissedTime]=useState(null);
    async function getDirMissedTime() {
        await fetch("/dirMissedTimeAPI")
              .then(res => res.json())
              .then(res => setDirMissedTime(res))                           
    };

    useEffect(()=>{
        getDirMissedTime();
    },[])

    const [currentTime, setCurrentTime]=useState(new Date());
    const [dirTime, setDirTime]=useState(null);
    useEffect(()=>{
        var seconds=0;
        if(dirTime==null || dirTime>0)
        {
            let interval=setInterval(
                function(){
                    let endDate = new Date();
                    // Do your operations
                    let startDate  = currentTime;
                    let diff = endDate - startDate;
                    seconds = Math.floor(diff / 1000);
                    setDirTime(missedAlertTime-seconds)
                },1000)
            return ()=>clearInterval(interval); 
        } 
    })

    useEffect(()=>{
        getDirRefreshTime();
        if(dirRefreshTime!=null){
            const timer = setInterval(function (){
                callAPI();
                console.log(new Date().toTimeString())
            },dirRefreshTime*1000)
            return () => clearInterval(timer);
        } 
    },[dirRefreshTime])

    const [sliderRefreshTime, setSliderRefreshTime]=useState(null);
    async function getSliderRefreshTime() {
        await fetch("/sliderRefreshTimeAPI")
              .then(res => res.json())
              .then(res => setSliderRefreshTime(res))                           
    };

    // useEffect(()=>{
    //     getSliderRefreshTime();
    // },[])

    async function callAPI() {
        await fetch("/dirAPI")
              .then(res => res.json())
              .then(res => setDirectoryApiResponse(res))                           
    };

    async function getMissedAlert() {
        await fetch("/missedAlertAPI")
            .then(res => res.json())
            .then(res => setmissedAlertFile(res))                           
    };
    
    async function getClosedAlert() {
        await fetch("/closedAlertAPI")
            .then(res => res.json())
            .then(res => setclosedAlertFile(res))                           
    }; 

    async function checkChangesInDir() {
        await fetch("/dirChange")
              .then(res => res.text())
              .then(res => setDirectoryUpdated(res))                           
    };  

    const [rowIndex, _setRowIndex] = useState(0)  
    const activeRowIndex = React.useRef(rowIndex);

    function setRowIndex(nextVal) {       
        activeRowIndex.current = nextVal; // Updates the ref
        _setRowIndex(rowIndex);
    }

    const [nextImage, _setNextImage] = useState(0)
    const activePointRef = React.useRef(nextImage);

    async function setActivePoint(nextVal) {       
        if(nextVal>=directoryApiResponse[activeRowIndex.current].Files.length || nextVal<0)
        {
            nextVal=0
        }
        activePointRef.current = nextVal; // Updates the ref
        await _setNextImage(nextVal);
    }

    const [selectedDirectory, setDirectoryForTransfer]=useState([]);

    function selectedFolder() {       
        setDirectoryForTransfer(directoryApiResponse[activeRowIndex.current]);
        if(directoryApiResponse.length>0)
        {
            let updatedValue = {};
            updatedValue = {"StartTime": Moment(new Date()).format("DD-MMM-YYYY HH:mm:ss")};
            setDirectoryForTransfer(selectedDirectory => ({...selectedDirectory,...updatedValue}))
            createDirFilesList();
        }
    }

    const [moveMissed, setmoveMissed]=useState([]);
    async function moveMissedFile(filepath){
        await fetch('/moveMissedFile', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FilePath: filepath
          })
        })
        .then(res => res.text())
        .then(res => setmoveMissed(res))           
    };

    const [selectedDirFilles, setDirFiles]=useState([]);

    async function createDirFilesList() { 
        if(directoryApiResponse.length>0 && selectedDirectory.DirName!=null && selectedDirectory.DirName!='')
        {
        setDirFiles(directoryApiResponse[activeRowIndex.current].Files)
        setDirFiles(selectedDirFilles=> selectedDirFilles.map(item => {
            var endDate = new Date();
            // Do your operations
            var startDate  = new Date(item.FileTime);
            var diff = endDate - startDate;
            var seconds = Math.floor(diff / 1000);
            console.log(missedAlertTime)
            if(seconds>missedAlertTime)
                {
                    moveMissedFile(item.FilePath);
                    console.log(moveMissed)
                    return {
                        ...item,
                        StartTime: 0,
                        IsTransfer: "Yes"
                    }
                }
            else{
                    return {
                        ...item,
                        StartTime: seconds,
                        IsTransfer: "No"
                    }
                }              
            }))     
        }   
    }


    useEffect(()=>{

        if(directoryApiResponse.length==0)
        {
            callAPI();
        } 
        // if(directoryApiResponse.length>0)
        // {
        //     var filepath=directoryApiResponse[activeRowIndex.current].Files[activePointRef.current].FilePath;
        //     var fileName=directoryApiResponse[activeRowIndex.current].Files[activePointRef.current].FileName;
        //     callPostAPI(filepath,fileName);                     
        // }  
    }, [directoryApiResponse]);


    useEffect(()=>{
        const interval2 = setInterval(() => createDirFilesList(), 1000);
        return () => clearInterval(interval2);
    });

    const [imageURL,setImageURL]=useState([]);
    const RenderImage= () => {
        setImageURL([]);
        if(directoryApiResponse.length>0)
        if(directoryApiResponse[activeRowIndex.current].Files.length>0)
        return(
            <div>
                {directoryApiResponse[activeRowIndex.current].Files.map((file,index)=>{
                    if(file.ImageUrl!="")
                    {
                        setImageURL(imageURL=>[...imageURL,file.ImageUrl])
                    }
                })}
            </div>
        )        
    }

    function onClickFunc(_event, direction) {
        if(direction=="Next")
        setActivePoint(activePointRef.current+1);
        else
        setActivePoint(activePointRef.current-1);
        
        if(direction=="Next")
        {
            NextImage(activePointRef.current);
        }        
        else
        {
            PrevImage(activePointRef.current);
        }
    }

    async function NextImage(nxtImage){
        if(directoryApiResponse.length>0 && directoryApiResponse[activeRowIndex.current].Files.length>0) 
        {
            if(nxtImage<directoryApiResponse[activeRowIndex.current].Files.length)
            {   
                var filepath=directoryApiResponse[activeRowIndex.current].Files[nxtImage].FilePath;
                var filename=directoryApiResponse[activeRowIndex.current].Files[nxtImage].FileName;
                if(filename!=null)
                {
                    await callPostAPI(filepath,filename);
                }
            }   
        }              
        
    }

    // const [count,setCount]=useState(0)
    // useEffect(()=>{
    //     if(sliderRefreshTime!=null)
    //     {
    //         async function AutorefreshImage(){
    //             await setActivePoint(activePointRef.current+1);
    //             await NextImage(activePointRef.current);
    //             await setCount(0)
    //         }
    //         if(count==sliderRefreshTime*100)
    //         {
    //             AutorefreshImage();
    //         }
    //         else{
    //             setCount(count+1)
    //         }
    //     }
    // },[sliderRefreshTime,count]);

    function PrevImage(nxtImage){
        if(directoryApiResponse.length>0 && directoryApiResponse[activeRowIndex.current].Files.length>0) 
        {
            if(nxtImage>=0)
            {
                var filepath=directoryApiResponse[activeRowIndex.current].Files[nxtImage].FilePath;
                var filename=directoryApiResponse[activeRowIndex.current].Files[nxtImage].FileName;
                if(filename!=null)
                {
                    callPostAPI(filepath,filename);
                }
            }
        }  
        
    }

    const [imageFile, setImage]=useState("");
    const [imageFileName, setImageName]=useState("");
    async function callPostAPI(imagePath,imageFileName,RowIndex){
        if(RowIndex!=null)
        {
            setRowIndex(RowIndex);
            RenderImage();
        }

        // if(imagePath!=null && imagePath!='')
        // {
        //     await fetch('/readFile', {
        //         method: 'POST',
        //         headers: {
        //           'Accept': 'application/json',
        //           'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //           FilePath: imagePath
        //         })
        //       })
        //       .then(res => res.arrayBuffer())
        //       .then(function(res){
        //         setImage(convertoBase64(res)) 
        //         setImageName(imageFileName)                
        //     })  
        // }                
            
    };      

    function convertoBase64(data){
        const b64Data = btoa(
            new Uint8Array(data).reduce(
                (dataArray, byte) => {
                    return dataArray + String.fromCharCode(byte);
                }, 
                ''
            )
        );
        const userAvatarData = {
            key: 'userAvatar',
            value: `data:image/png;base64,${b64Data}`
        };
        return userAvatarData.value;
    };

    function openAlert(evt, id) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(id).style.display = "block";
        evt.currentTarget.className += " active";
    };

    function RenderTableRow(prop){
        const index= prop.index
        const dir= prop.dir
        
        return (
                <tr onClick={(e)=>{callPostAPI(dir.Files[0].FilePath,dir.Files[0].FileName,index);selectedFolder()}}>
                    <td>{dir.DirName}</td>
                    <td>{dir.DirTime}</td>
                    {/* <span>ḍ
                    {dir.Files.map((step, stepIndex) => (
                        <Fragment key={stepIndex}>
                        <p onClick={() => callPostAPI(step.FilePath)}>{step.FileName}</p>
                        </Fragment>
                    ))}
                    </span> */}
                </tr>
            )
    };

    const [isFileMoved, setFileMoved] = useState(0)  

    async function MoveInstantFile(){
        await fetch('/moveInstantFile', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FilePath: directoryApiResponse[activeRowIndex.current].Files[activePointRef.current].FilePath
          })
        })
        .then(res => res.text())
        .then(res => setFileMoved(res))           
    }; 

    useEffect(()=>{
        if(isFileMoved=="OK"){
            alert("File Moved Successfully to Instant Folder.")
            setFileMoved("")
        }
        else
        if(isFileMoved!="")
        {
            alert(isFileMoved)
        } 
    },[isFileMoved])


    const [isMoveCompiledFile, setMoveCompiledFile] = useState(0)  

    async function MoveCompiledFile(){
        await fetch('/moveCompiledFile', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FilePath: directoryApiResponse[activeRowIndex.current].Files[activePointRef.current].FilePath
          })
        })
        .then(res => res.text())
        .then(res => setMoveCompiledFile(res))           
    }; 

    useEffect(()=>{
        if(isMoveCompiledFile=="OK"){
            alert("File Moved Successfully to Compiled Folder.")
            setMoveCompiledFile("")
        }
        else
        if(isMoveCompiledFile!="")
        {
            alert(isMoveCompiledFile)
        }
    },[isMoveCompiledFile])

    return(
        <div>
        <Header></Header>
           <div className="main-content page-content">
            <div className="main-content-inner">
                <div className="row mb-4">
                    <div className="col-md-12 grid-margin">
                        <div className="d-flex justify-content-between flex-wrap">
                            <div className="d-flex align-items-center dashboard-header flex-wrap mb-3 mb-sm-0">
                                <h5 className="mr-4 mb-0 font-weight-bold">Dashboard</h5>
                            </div>
                            
                        </div>
                    </div>
                </div>
            
                <div className="row">
                    <div className="col-xl-4 col-md-4 col-lg-12">
                        <div className="card">
                            <div className="card-body">

                            <div id="exTab1">	
                                <ul  className="nav nav-pills">
                                            <li className='active'><a  href="#1a" data-toggle="tab" onClick={callAPI}>Active Alert</a></li>
                                            <li><a href="#2a" data-toggle="tab" onClick={getClosedAlert}>Closed Alert</a></li>
                                            <li><a href="#3a" data-toggle="tab" onClick={getMissedAlert}>Missed Alert</a></li>
                                        </ul>

                                            <div className="tab-content clearfix">
                                            <div className="tab-pane active" id="1a">
                                            <div className="search">
                                <input type="text" placeholder="Search.." name="search2" />
                                <button id="btnsearch" type="submit"><i className="fa fa-search"></i></button>
                                <button id="btnsort" type="submit">
                                    <i className="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                <span>Sort by</span></button>
                                </div>
                                <div id="Active" className="single-table">
                                    <div className="table-responsive">                                        
                                        <table className="table table-hover progress-table text-center">
                                            <thead className="text-uppercase">
                                            <tr>
                                                <th colSpan="2">
                                                File Move in Missed Folder After : {dirTime} sec.
                                                </th>
                                            </tr>
                                            <tr>
                                                <th>Folder ID</th>
                                                <th>DATE AND TIME</th>
                                            </tr>
                                            </thead>  
                                            <tbody>                                          
                                            {directoryApiResponse.map((dir, dirIndex) => {
                                            return (
                                                <RenderTableRow key={dirIndex.toString()} index={dirIndex} dir={dir} ></RenderTableRow>
                                            );                                                
                                            })} 
                                            </tbody>       
                                        </table>
                                    </div>
                                </div>
                                                </div>
                                                <div className="tab-pane" id="2a">
                                                <div className="table-responsive">
                                        <table className="table table-hover progress-table text-center">
                                            <thead className="text-uppercase">
                                            <tr>
                                                <th>Folder ID</th>
                                                <th>DATE AND TIME</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {closedAlertFile.map((file,fileindex)=>{
                                                return(
                                                    <tr key={fileindex}>
                                                        <td>{file.FileName}</td>
                                                        <td>{file.FileTime}</td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                                </div>
                                        <div className="tab-pane" id="3a">
                                        <div className="table-responsive">
                                        <table className="table table-hover progress-table text-center">
                                            <thead className="text-uppercase">
                                            <tr>
                                                <th>Folder ID</th>
                                                <th>DATE AND TIME</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {missedAlertFile.map((file,fileindex)=>{
                                                return(
                                                    <tr key={fileindex}>
                                                        <td>{file.FileName}</td>
                                                        <td>{file.FileTime}</td>
                                                    </tr>
                                                )
                                            })}  
                                            </tbody>
                                        </table>
                                    </div>
                                                </div>
                                        
                                            </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   

                

                    <div className="col-xl-8 col-md-4 col-lg-12">
                        <div className="card">
                            <div className="card-body">
                            <div className="selected-dir">
                                <span>{'Selected Dir: '+selectedDirectory.DirName}</span>
                                <br></br>
                                <span>{'Selected Dir. Time: '+selectedDirectory.DirTime}</span>
                            </div>
                            <div id="myCarousel" className="carousel slide" data-ride="carousel">

                            <div className="carousel-inner img-fx-width" role="listbox">
                                {/* <div>{imageFileName}</div> */}
                                {imageURL.map((imgurl,index)=>{
                                    if(index==0){
                                    return(
                                        <div key={index} className="item active">
                                        
                                        <img key={index} src={imgurl}></img>
                                        <div className='checkbox'>
                                            <input id={index} key={index} type="checkbox"></input>
                                            <label for={index}></label>
                                            </div>
                                        </div>
                                    )
                                }
                                else{
                                    return(
                                        <div key={index} className="item">
                                        
                                        <img key={index} src={imgurl}></img>
                                        <div className='checkbox'>
                                            <input id={index} key={index} type="checkbox"></input>
                                            <label for={index}></label>
                                            </div>
                                        </div>
                                       
                                )
                                }
                                })}       
                               
                                    {/* {directoryApiResponse[activeRowIndex.current].Files.map((dir, index) => {
                                        // <RenderImage Files={dir.Files}></RenderImage>
                                        dir.Files.map((file,fileindex)=>{
                                            if(file.FilePath!=""){
                                                <img key={fileindex} src={file.FilePath}></img> 
                                            }
                                        })
                                    })} */}
                            </div>

                                <a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev"
                                // onClick={(event) => onClickFunc(event, "Prev")}
                                >
                                <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                                </a>
                                <a className="right carousel-control" href="#myCarousel" role="button" data-slide="next"
                                // onClick={(event) => onClickFunc(event, "Next")}
                                >
                                <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                                </a>
                            </div>
                            
                                <div className='row'>
                                    <div className='col-xl-6 col-md-6 col-lg-12'>
                                    <button type="button" className="btn btn-success mt-2 toastr_success"
                                    onClick={()=>MoveInstantFile()}
                                    >Instant Report</button>
                                    </div>
                                    {/* <div className='col-xl-6 col-md-6 col-lg-12 text-right'>
                                    <button type="button" className="btn btn-success mt-2 toastr_success"
                                    onClick={()=>MoveCompiledFile()}
                                    >Compiled Report</button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-4 col-lg-12" style={{display:'none'}}>
                        <div className="card">
                            <div className="card-body">
                                {/* <h3>Selected Folder</h3>
                                <table className="table table-hover progress-table text-center" style={{borderTop:"1px solid"}}>
                                    <thead className="text-uppercase">
                                        <tr>
                                            <th>Folder ID</th>
                                            <th>DATE AND TIME</th>
                                            <th>Click TIME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{selectedDirectory.DirName}</td>
                                            <td>{selectedDirectory.DirTime}</td>
                                            <td>{selectedDirectory.StartTime}</td>
                                        </tr>                                        
                                    </tbody>
                                </table> */}
                                <h4>Files List</h4>
                                <table className="table table-hover progress-table text-center" style={{borderTop:"1px solid"}}>
                                        <thead className="text-uppercase">
                                            <tr>
                                                <th>File Name</th>
                                                <th>File Time</th>
                                                <th>StartTime</th>
                                                <th>Is Transfer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedDirFilles.map((file, fileIndex) => {
                                                return (
                                                    <tr key={fileIndex}>
                                                        <td>{file.FileName}</td>
                                                        <td>{file.FileTime}</td>
                                                        <td>{file.StartTime}</td>
                                                        <td>{file.IsTransfer}</td>
                                                    </tr>   
                                                );                                                
                                            })}                                                                             
                                        </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            </div>
        <Footer></Footer>
        </div>
    )  
}
export default Dashboard