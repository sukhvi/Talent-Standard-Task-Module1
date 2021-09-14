import React, { Component } from "react";
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Location } from '../Employer/CreateJob/Location.jsx';
export class IndividualDetailSection extends Component {
    constructor(props) {
        
        super(props);


        const details = props.profileData ?
            Object.assign({}, props.profileData)
            : {
                firstName: "",
                lastName: "",
                email: "",
                phone: ""
            }

       

        this.state = {
            showEditSection: false,
            contactDetails : details
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        
    }

    handleChange(e){
        const data = Object.assign({}, this.state.contactDetails)
        data[e.target.name] = e.target.value
        this.setState({ contactDetails : data })
    }

    handleEdit() {
        
        const { firstName, lastName, email, phone  } = this.props.profileData;
        const details = Object.assign({}, {firstName, lastName, email, phone});      
        this.setState({showEditSection:true, contactDetails:details});
    }

    handleUpdate(){
        
       const profileData = Object.assign(this.props.profileData, this.state.contactDetails)
       this.props.saveProfileData(profileData);
       this.setState({showEditSection:false});        
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="First Name"
                    name="firstName"
                    value={this.state.contactDetails.firstName}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your first name"
                    errorMessage="Please enter a valid first name"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Last Name"
                    name="lastName"
                    value={this.state.contactDetails.lastName}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your last name"
                    errorMessage="Please enter a valid last name"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Email address"
                    name="email"
                    value={this.state.contactDetails.email}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter an email"
                    errorMessage="Please enter a valid email"
                />

                <ChildSingleInput
                    inputType="text"
                    label="Phone number"
                    name="phone"
                    value={this.state.contactDetails.phone}
                    controlFunc={this.handleChange}
                    maxLength={12}
                    placeholder="Enter a phone number"
                    errorMessage="Please enter a valid phone number"
                />

                <button type="button" className="ui teal button" onClick={this.handleUpdate}>Save</button>
                <button type="button" className="ui button" onClick={()=> this.setState({showEditSection:false})}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
        let fullName = this.props.profileData ? `${this.props.profileData.firstName} ${this.props.profileData.lastName}` : ""
        let email = this.props.profileData ? this.props.profileData.email : ""
        let phone = this.props.profileData ? this.props.profileData.phone : ""

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Name: {fullName}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.handleEdit}><i aria-hidden="true" className="edit icon"></i> Edit</button>
                </div>
            </div>
        )
    }
}


export class CompanyDetailSection extends Component {
    constructor(props) {
        super(props)

        const details = props.details ?
            Object.assign({}, props.details)
            : {
                name: "",
                email: "",
                phone: ""
            }

        this.state = {
            showEditSection: false,
            newContact: details
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        const details = Object.assign({}, this.props.details)
        this.setState({
            showEditSection: true,
            newContact: details
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newContact)
        data[event.target.name] = event.target.value
        this.setState({
            newContact: data
        })
    }

    saveContact() {
        const data = Object.assign({}, this.state.newContact)
        this.props.controlFunc(this.props.componentId, data)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        let location = { city: '', country: '' }
        if (this.state.newContact && this.state.newContact.location) {
            location = this.state.newContact.location
        }

        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="Name"
                    name="name"
                    value={this.state.newContact.name}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your last name"
                    errorMessage="Please enter a valid name"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Email address"
                    name="email"
                    value={this.state.newContact.email}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter an email"
                    errorMessage="Please enter a valid email"
                />

                <ChildSingleInput
                    inputType="text"
                    label="Phone number"
                    name="phone"
                    value={this.state.newContact.phone}
                    controlFunc={this.handleChange}
                    maxLength={12}
                    placeholder="Enter a phone number"
                    errorMessage="Please enter a valid phone number"
                />
                Location:
                <Location location={location} handleChange={this.handleChange} />
                <button type="button" className="ui teal button" onClick={this.handleUpdate}>Save</button>
                <button type="button" className="ui button" onClick={()=> this.setState({showEditSection:false})}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {

        let companyName = this.props.details ? this.props.details.name : ""
        let email = this.props.details ? this.props.details.email : ""
        let phone = this.props.details ? this.props.details.phone : ""
        let location = {city:'',country:''}
        if (this.props.details && this.props.details.location) {
            location = this.props.details.location
        }

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Name: {companyName}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                        <p> Location: {location.city}, {location.country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}
