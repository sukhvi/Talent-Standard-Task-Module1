import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';
import { Radio } from 'semantic-ui-react'


export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "jobSeekingStatus": ""    
        }
        this.handleChange = this.handleChange.bind(this);
    }

    
    
    handleChange(e){
        this.setState({ "status":e.target.value })
        const data = {
            jobSeekingStatus: {
                status:""
            }   
        }
        data.jobSeekingStatus["status"] = e.target.value;       
        this.props.updateProfileData(data);
       
    }

    render() {
        
        return (<React.Fragment>
                <div className="ui sixteen wide column">
                        <div className="column py10">
                            <div className="ui radio checkbox">
                                
                                <input type="radio" name="jobSeekingStatus" value='Actively looking for job' tabIndex="0" checked={this.props.jobSeekingStatus && this.props.jobSeekingStatus.status === 'Actively looking for job'} onChange={this.handleChange} />
                                <label>Actively looking for job</label>
                            </div>
                        </div>
                        <div className="column py10">
                            <div className="ui radio checkbox">
                                <input type="radio" name="jobSeekingStatus" tabIndex="1" value='Not looking for a job at the moment' checked={this.props.jobSeekingStatus && this.props.jobSeekingStatus.status === 'Not looking for a job at the moment'} onChange={this.handleChange} />
                                <label>Not looking for a job at the moment</label>
                            </div>
                        </div>
                        <div className="column py10">
                            <div className="ui radio checkbox">
                                <input type="radio" name="jobSeekingStatus" tabIndex="2" value='Currently employed but open to offers' checked={this.props.jobSeekingStatus && this.props.jobSeekingStatus.status === 'Currently employed but open to offers'} onChange={this.handleChange} />
                                <label>Currently employed but open to offers</label>
                            </div>
                        </div>
                        <div className="column py10">
                            <div className="ui radio checkbox">
                                <input type="radio" name="jobSeekingStatus" tabIndex="3" value='Will be available on late date' checked={this.props.jobSeekingStatus && this.props.jobSeekingStatus.status === 'Will be available on late date'} onChange={this.handleChange} />
                                <label>Will be available on late date</label>
                            </div>
                        </div>
                        </div>
        </React.Fragment>)
    }
}