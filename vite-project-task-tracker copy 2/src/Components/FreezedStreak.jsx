import freezedFlame from "../assets/freezed-streak.svg";
 function FreezedStreak() {
    return(<>
          <div className="Tasks">
        <p className="p-block">fynamann technique </p>
        <div className="icons-block">
          <p >
            <img src={freezedFlame} alt="" className="Img-freezed" />0
          </p>
          <button type="button" className="btn btn-success">
            Done
          </button>
          <button type="button" className="btn btn-danger">
            Delete
          </button>
          
        </div>
      </div>
    </>)
}
 export default FreezedStreak;
