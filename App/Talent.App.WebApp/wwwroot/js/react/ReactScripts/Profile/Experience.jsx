/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx'
import DatePicker from 'react-datepicker';
import moment from 'moment';


export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addSection: false,
            editSection:false,
            experience: {
                company:"",
                position:"",
                responsibilities:"",
                start: moment.utc(),
                end: moment.utc(),
            }
        }
        
        this.addExperience = this.addExperience.bind(this);
        this.deleteExperience = this.deleteExperience.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    addExperience() {
        
        var startDate = moment(this.state.experience.start);
        var endDate = moment(this.state.experience.end);

        const diff = endDate.diff(startDate);

        

        if(this.state.experience.company === '' || this.state.experience.position  === '' ) {
            if(diff<0) {
                TalentUtil.notification.show("End date can not be before the start date", "error", null, null)
            } else {
                TalentUtil.notification.show("Experience not valid", "error", null, null)
            }
            
        } else {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            // url: 'http://localhost:60998/profile/profile/addExperience',
            url: 'https://leo-profileapi.azurewebsites.net/profile/profile/addExperience',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.experience),
            success: function (res) {

                if (res.success == true) {
                    TalentUtil.notification.show("Experience added sucessfully", "success", null, null)
                    this.setState({
                        addSection:false,
                        experience: {
                            company:"",
                            position:"",
                            responsibilities:"",
                            start:"",
                            end:"",
                        }            
                    })
                    this.props.updateProfileData();
                } else {
                    TalentUtil.notification.show("Experience not added", "error", null, null)
                }
                
                
            }.bind(this)
        })
    }
    }

    deleteExperience(experience) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            // url: 'http://localhost:60998/profile/profile/deleteExperience',
            url: 'https://leo-profileapi.azurewebsites.net/profile/profile/deleteExperience',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(experience),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Experience deleted sucessfully", "success", null, null)
                    this.props.updateProfileData();              
                } else {
                    TalentUtil.notification.show("Experience did not deleted.", "error", null, null)
                }

            }.bind(this)
        })
    }

    
    handleChange(e,name){
        const data = Object.assign({}, this.state.experience);
        if(name){
            data[name] = e;
        }else {
            data[e.target.name] = e.target.value
        }
        this.setState({ experience : data })    
    }

    render() {
        return (
            <div className='ui  sixteen  column wide'>
            {
                this.state.addSection && <React.Fragment>
                    <div className="ui two column grid padding-bottom-10" >
                        <div className="row">
                            <div className="column">
                                    <ChildSingleInput
                                    inputType="text"
                                    label="Company:"
                                    name="company"
                                    value={this.state.experience.company}
                                    controlFunc={this.handleChange}
                                    maxLength={80}
                                    placeholder="Company"
                                    errorMessage="Please enter valid company name"
                                    />
                            </div>
                            <div className="column">
                                    <ChildSingleInput
                                    inputType="text"
                                    label="Position:"
                                    name="position"
                                    value={this.state.experience.position}
                                    controlFunc={this.handleChange}
                                    maxLength={80}
                                    placeholder="Position"
                                    errorMessage="Please enter valid company name"
                                    />
                            </div>
                        </div>
                        <div className="row">
                            <div className="column full-width">
                                <label>Start Date:</label>
                                    <DatePicker
                                        selected={this.state.experience.start}
                                        onChange={(date) => this.handleChange(date,'start')}
                                        maxDate={moment()}
                                    />
                            </div>
                            <div className="column full-width">
                                <label>End Date:</label>
                                    <DatePicker
                                            selected={this.state.experience.end}
                                            onChange={(date) => this.handleChange(date,'end')}
                                            maxDate={moment()}
                                        />
                            </div>
                           
                        </div>

                    </div>
                    <div className="ui sixteen column wide mt20 pb10">
                        <div className="row">
                            <div className="column" style={{paddingBottom:'15px'}}>
                                    <ChildSingleInput
                                    inputType="text"
                                    label="Responsibilities:"
                                    name="responsibilities"
                                    value={this.state.experience.responsibilities}
                                    controlFunc={this.handleChange}
                                    maxLength={180}
                                    placeholder="Responsibilities (OPTIONAL)"
                                    errorMessage="Please enter valid responsibilities"
                                    />
                            </div>
                            <div className="column pb15">
                                    <button type="button" onClick={()=> this.addExperience()} className="ui teal button">Add</button>
                                    <button type="button" onClick={()=> this.setState({ addSection: false})} className="ui button">Cancel</button>
                            </div>
                        </div>
                    </div>
            
            </React.Fragment>
            }
            <div className='ui  sixteen  column wide'>
                <div className="row">                    
                    <div className="column">
                    <table className="ui  table">
                        <thead>
                            <tr>
                                <th >Company </th>
                                <th >Position</th>
                                <th >Responsibilities</th>
                                <th >Start</th>
                                <th >End</th>
                                <th className="right aligned" ><button type="button" onClick={()=> this.setState({ addSection: true })} className="ui teal button" ><i aria-hidden="true" className="plus icon"></i> Add New</button></th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.experienceData && this.props.experienceData.map( experience => <ExperienceList key={experience.id} experience={experience} deleteExperience={this.deleteExperience} />)}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export  class ExperienceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            experience: {
                company:"",
                position:"",
                responsibilities:"",
                start: moment.utc(),
                end: moment.utc(),
            },
            editSection:false
        }

        this.handleChange = this.handleChange.bind(this);
        this.updateExperience = this.updateExperience.bind(this);
    }

    componentDidMount(){
        
        this.setState({
            experience: this.props.experience
        });
    }


    handleChange(e,name){
        const data = Object.assign({}, this.state.experience);
        if(name){
            data[name] = e;
        }else {
            data[e.target.name] = e.target.value
        }
        this.setState({ experience : data })    
    }

    updateExperience() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            // url: 'http://localhost:60998/profile/profile/updateExperience',
            url: 'https://leo-profileapi.azurewebsites.net/profile/profile/updateExperience',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.experience),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Experience updated sucessfully", "success", null, null)
                    this.setState({editSection:false});
                } else {
                    TalentUtil.notification.show("Experience did not update successfully", "error", null, null)
                }
            }.bind(this)
        })
    }



    render() {
        
        return (
            <tr key={this.props.id}>
                { !this.state.editSection && 
                    <React.Fragment>
                        <td>{this.state.experience.company}</td>
                        <td >{this.state.experience.position}</td>
                        <td >{this.state.experience.responsibilities}</td>
                        <td >{moment.utc(this.state.experience.start).format('DD/MM/YYYY')}</td>
                        <td >{moment.utc(this.state.experience.end).format('DD/MM/YYYY')}</td>
                        <td className="right aligned">
                                <i onClick={()=> this.setState({editSection:true})} aria-hidden="true" className="pencil icon"></i>
                                <i onClick={()=> this.props.deleteExperience(this.state.experience)}  aria-hidden="true" className="delete icon"></i>
                        </td>
                    </React.Fragment>}
                {
                    this.state.editSection && 
                    <td colSpan="6">
                        <React.Fragment>
                    <div className="ui two column grid padding-bottom-10" >
                        <div className="row">
                            <div className="column">
                                    <ChildSingleInput
                                    inputType="text"
                                    label="Company:"
                                    name="company"
                                    value={this.state.experience.company}
                                    controlFunc={this.handleChange}
                                    maxLength={80}
                                    placeholder="Company"
                                    errorMessage="Please enter valid company name"
                                    />
                            </div>
                            <div className="column">
                                    <ChildSingleInput
                                    inputType="text"
                                    label="Position:"
                                    name="position"
                                    value={this.state.experience.position}
                                    controlFunc={this.handleChange}
                                    maxLength={80}
                                    placeholder="Position"
                                    errorMessage="Please enter valid company name"
                                    />
                            </div>
                        </div>
                        <div className="row">
                            <div className="column full-width">
                                <label>Start Date:</label>
                                    <DatePicker
                                        selected={moment.utc(this.state.experience.start)}
                                        onChange={(date) => this.handleChange(date,'start')}
                                        maxDate={moment()}
                                    />
                            </div>
                            <div className="column full-width">
                                <label>End Date:</label>
                                    <DatePicker
                                            selected={moment.utc(this.state.experience.end)}
                                            onChange={(date) => this.handleChange(date,'end')}
                                            maxDate={moment()}
                                        />
                            </div>
                        </div>

                    </div>
                    <div className="ui sixteen column wide mt20 pb10">
                        <div className="row">
                            <div className="column" style={{paddingBottom:'15px'}}>
                                    <ChildSingleInput
                                    inputType="text"
                                    label="Responsibilities:"
                                    name="responsibilities"
                                    value={this.state.experience.responsibilities}
                                    controlFunc={this.handleChange}
                                    maxLength={180}
                                    placeholder="Responsibilities"
                                    errorMessage="Please enter valid responsibilities"
                                    />
                            </div>
                            <div className="column pb15">
                                    <button type="button" onClick={()=> this.updateExperience()} className="ui teal button">Update</button>
                                    <button type="button" onClick={()=> this.setState({ editSection: false})} className="ui button">Cancel</button>
                            </div>
                        </div>
                    </div>
            
            </React.Fragment>
                    </td>
                }
                
             
                
            
            </tr>
            
        );
    }
}