/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
       
        super(props);

        const linkedAccounts = props.profileData && Object.assign({}, props.profileData.linkedAccounts)

        this.state = {
            showEditSection:false,
            localLinkedAccounts: linkedAccounts
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

    }

    handleChange(e){
        const data = Object.assign({}, this.state.localLinkedAccounts)
        data[e.target.name] = e.target.value
        this.setState({ localLinkedAccounts : data })
    }

    handleEdit() {
        const data = Object.assign({}, this.props.profileData.linkedAccounts)        
        this.setState({showEditSection:true, localLinkedAccounts:data});
    }

    handleUpdate(){    
       const profileData = Object.assign({}, this.props.profileData);       
       profileData["linkedAccounts"] = this.state.localLinkedAccounts;       
       this.props.saveProfileData(profileData);
       this.setState({showEditSection:false});        
    }

    render() {
        return (<div className="row">
            <div className="column">
                {this.state.showEditSection ? this.renderEdit() : this.renderDefault()}
            </div>
        </div>)
    }
    
    
    renderDefault() {
        return (
            <React.Fragment>
                <button type="button" onClick={()=> window.open(this.props.profileData.linkedAccounts.linkedIn)} className="ui linkedin button"><i aria-hidden="true" className="linkedin icon"></i> LinkedIn</button>
                <button type="button" onClick={()=> window.open(this.props.profileData.linkedAccounts.github)}  className="ui github button black"><i aria-hidden="true" className="github icon"></i> GitHub</button>
                <button type="button" className="ui right floated button teal" onClick={this.handleEdit}><i aria-hidden="true" className="edit icon"></i> Edit</button>
            </React.Fragment>
        )
    }

    renderEdit() {
        const {linkedIn, github} = this.state.localLinkedAccounts;
        const fieldElement = [{text:"LinkedIn",value:"linkedIn", stateValue: linkedIn}, {text:"GitHub",value:"github", stateValue: github}]
        return (
            <React.Fragment>
                {fieldElement && fieldElement.map(element => 
                    <ChildSingleInput
                    key={element.value}
                    inputType="text"
                    label={element.text}
                    name={element.value}
                    value={element.stateValue}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder={`Enter your ${element.text} Url`}
                    errorMessage={`Please enter a valid ${element.text} url`}
                />)}

                
               
                <button type="button" className="ui teal button" onClick={this.handleUpdate} >Save</button>
                <button type="button" className="ui button" onClick={()=> this.setState({showEditSection:false})} >Cancel</button>
            </React.Fragment>
        )
    }

}