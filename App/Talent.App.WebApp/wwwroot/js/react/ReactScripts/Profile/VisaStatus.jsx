import React from 'react'
import Cookies from 'js-cookie'
import { Select } from '../Form/Select.jsx'
import DatePicker from 'react-datepicker';
import moment from 'moment';


export default class VisaStatus extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          visaStatus: "",
          visaExpiryDate: moment.utc(),
      };

      this.handleUpdate = this.handleUpdate.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
      this.init = this.init.bind(this);
  }

  componentDidMount() {
    setTimeout(() =>{      
      this.init();
    },1000);
      
  }

  init(){
    this.setState({
      visaStatus: this.props.visaStatus,
      visaExpiryDate: this.props.visaExpiryDate ? moment.utc(this.props.visaExpiryDate):moment.utc()
    });
  }

  handleUpdate(e){
    const data = {
      "visaStatus": this.state.visaStatus,
      "visaExpiryDate": this.state.visaExpiryDate
    }
    this.props.updateProfileData(data);
  }

  handleSelect(e, name) {

    this.setState({
      "visaStatus" : e.target.value
    },()=>{
      const data = {};
      if (this.state.visaStatus === 'Citizen' || this.state.visaStatus === 'Permanent-Resident') {
        data["visaStatus"] = this.state.visaStatus;        
        this.props.updateProfileData(data);
      }     
    });
    
  }
  
  render() {
      const visaOptions = [
        { title:"Citizen" , value:"Citizen" },
        { title:"Permanent Resident" , value:"Permanent-Resident" },
        { title:"Work Visa" , value:"Work-Visa" },
        { title:"Student Visa" , value:"Student-Visa" },
      ];

      return (
          <div className='ui  three column grid'>
              <div className="row">
                  <div className="column">
                      <div className="field">
                          <label>Visa Status</label>
                          <Select
                              name="visaStatus"
                              options={visaOptions}
                              selectedOption={this.state.visaStatus}
                              controlFunc={this.handleSelect}
                              placeholder="Select Visa Status"
                          />
                      </div>
                  </div>
                  {!(this.state.visaStatus === "Citizen" || this.state.visaStatus === "Permanent-Resident") && <div className="column">
                      <div className="field">
                          <label>Visa Expirty Date</label>
                          <DatePicker
                              selected={this.state.visaExpiryDate}
                              onChange={(e) => this.setState({'visaExpiryDate':e})}
                              minDate={moment()}
                          />
                      </div>
                  </div>} 
                  <div className="column save-button">
                    <button type="button" onClick={()=> this.handleUpdate()} className="ui teal button">Save</button>
                  </div>
              </div>
          </div>
      )
  }
}