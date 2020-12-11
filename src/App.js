import Display from "./Display";
import DrumPad from "./DrumPad";
import DrumLine from "./DrumLine";
import DRUM_KEYS_ARRAY from "./drumKeysArray";
import {useState, useEffect} from "react";


/*--------------React Part--------------*/

const DrumMachine = () => {
  const [drumType, setDrumType] = useState("");
  const [drumPadKeys, handleDrumPadKeys] = useState(DRUM_KEYS_ARRAY);
  const [keyChangeIndex, handleKeyChange] = useState(-1); 
  const [isDrumMachineOn, activateDrumMachine] = useState(true);
  const [currentKey, setCurrentKey] = useState("");
  const [volume, setVolume] = useState(50);
  const [record, recordPlay] = useState(false);
  const [padRecorded, setPadRecorded] = useState([]);
  const [isPlayingRecord, playRecord] = useState(false);
  
  const changePadKey = (key) => {
    let keyIndex = drumPadKeys.findIndex((audioTuple) => audioTuple.key === key);
    if(keyIndex === -1){
      handleDrumPadKeys(drumPadKeys.map((audioTuple, index) => {
        if(index === keyChangeIndex)
          return {"key":key, "url":audioTuple.url, "type":audioTuple.type}
        else
          return {"key":audioTuple.key, "url":audioTuple.url, "type":audioTuple.type}
      }));
    }else{
      let drumPad = document.getElementById(drumPadKeys[keyIndex].type);
      drumPad.style.backgroundColor = "red";
      setTimeout(() => { 
        drumPad.style.backgroundColor = "#8535b1"; 
        drumPad.style.fontWeight = "normal";
        drumPad.parentNode.style.boxShadow = "0px 0px 3px 5px #20082b";
      }, 1000);
    } 
  };
  
  const triggerAudio = (key) => {
    let keyIndex = drumPadKeys.findIndex((audioTuple) => audioTuple.key === key);
    if(keyIndex !== -1)
      setCurrentKey(key);
  };

  
  const handleKeyDown = ({key}) => {
    if(keyChangeIndex !== -1) // if/else needed in order to prevent audio to play when the user is changing trigger key
      changePadKey(key.toUpperCase());
    else
      triggerAudio(key.toUpperCase());
  };
    
  const handleKeyUp = () => {
    if(keyChangeIndex !== -1){
      handleKeyChange(-1);
     }else
      setCurrentKey("");
  };
  
  const playDrumLine = () => {
    padRecorded.forEach((elem, index) => {
      setTimeout(() => {
        triggerAudio(elem.key);
        setCurrentKey(""); 
      }, 500 * index)
    })
    playRecord(false);
  };
  
  const playSound = (audioTuple) => {
    document.getElementById(audioTuple.key).volume=volume/100;
    let drumPad = document.getElementById(audioTuple.type);
    let audio = document.getElementById(audioTuple.key);
    audio.play();
    audio.currentTime = 0;
    drumPad.style.fontWeight = "bold";
    drumPad.parentNode.style.boxShadow = "none";
    setDrumType(audioTuple.type);
    if(record){
      drumPad.style.backgroundColor = "white";
      if(padRecorded.length >= 18)
        recordPlay(false);
      else
        setPadRecorded([...padRecorded, {key:audioTuple.key, type:audioTuple.type, index:padRecorded.length}]);
    }else
      drumPad.style.backgroundColor = "#e4a1ff";
    setTimeout(() => { 
      drumPad.style.backgroundColor = "#8535b1"; 
      drumPad.style.fontWeight = "normal";
      drumPad.parentNode.style.boxShadow = "0px 0px 3px 5px #20082b";
    }, 200);
  }
  
  useEffect(() => {
    window.addEventListener('keydown', isDrumMachineOn?handleKeyDown:null);
    window.addEventListener('keyup', isDrumMachineOn?handleKeyUp:null);

    return () => {
      window.removeEventListener('keydown', isDrumMachineOn?handleKeyDown:null);
      window.removeEventListener('keyup', isDrumMachineOn?handleKeyUp:null);
    }
  });
  
  useEffect(() => {
    if(playRecord){
      playDrumLine();
    }
  })
  
  return(
    <div>
      <div id="drum-machine">
        <h2>Drum Machine</h2>
        <Display drumType={drumType} isDrumMachineOn={isDrumMachineOn} activateDrumMachine={activateDrumMachine} setVolume={setVolume} record={record} recordPlay={recordPlay}/> 
        <div id="drum-pads">
          {drumPadKeys.map((audioTuple, index) => <DrumPad key={index} keyIndex={index} audioTuple={audioTuple} handleKeyChange={handleKeyChange} isDrumMachineOn={isDrumMachineOn} hasFocus={currentKey===audioTuple.key} currentKey={currentKey} playSound={playSound}/>)}
        </div>
      </div>
      <DrumLine drumTypes={drumPadKeys.map((elem) => elem.type)} record={record} recordPlay={recordPlay} padRecorded={padRecorded} setPadRecorded={setPadRecorded} isPlayingRecord={isPlayingRecord} playRecord={playRecord}/>
    </div>
  );
}



export default DrumMachine;
