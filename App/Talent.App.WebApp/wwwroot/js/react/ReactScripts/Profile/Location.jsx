import React from 'react'
import Cookies from 'js-cookie'
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx'

export class Address extends React.Component {
    
    constructor(props) {
        
        super(props);

        const { city, country, number, postCode, street, suburb  } = props.profileData.address;

        const details = Object.assign({}, { city, country, number, postCode, street, suburb });

        this.state = {
            showEditSection: false,
            addressDetails : details,
            countriesJson: {},
            countryOptions: [],
            cityOptions:[],
            
            
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.loadCities = this.loadCities.bind(this); 
        
    }

    componentDidMount() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: '/util/jsonFiles/countries.json',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {         
                const countries = Object.keys(res).map((x) => ({title:x , value:x}));
                this.setState({countryOptions: countries, countriesJson: res})
            }.bind(this)
        })

        
       
    }


    loadCities(country){
        
        let tempCities = [];
        if(country!== undefined){
            country = this.state.addressDetails.country
        } else {
            country =  this.props.profileData.address.country
        }
        
        Object.keys(this.state.countriesJson).filter(function(x) {
            if(x=== country){
                tempCities = this.state.countriesJson[x];
            }
        }.bind(this));
        let uniqueCities = [...new Set(tempCities)];
        const cities = uniqueCities.map(x => ({title:x,value:x}))
        console.log(cities);
        this.setState({cityOptions: cities})

    }


    handleChange(e){
        
        const data = Object.assign({}, this.state.addressDetails)
        data[e.target.name] = e.target.value;
        this.setState({ addressDetails : data });
        setTimeout(() =>{
            this.loadCities(this.state.addressDetails.country);
        },100)
        

    }

    handleEdit() {
        
        const { city, country, number, postCode, street , suburb } = this.props.profileData.address;
        const details = Object.assign({}, { city, country, number, postCode, street , suburb });      
        this.setState({showEditSection:true, addressDetails:details});
        this.loadCities();
    }

    handleUpdate(){
        
        const profileData = Object.assign({}, this.props.profileData);       
        profileData["address"] = this.state.addressDetails; 
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
            
            <div className='ui  three column grid'>
                <div className="row">
                    <div className="column">
                        <ChildSingleInput
                            inputType="text"
                            label="Number"
                            name="number"
                            value={this.state.addressDetails.number}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your Street Number"
                            errorMessage="Please enter a valid street number"
                        />
                    </div>
                    <div className="column">
                        <ChildSingleInput
                            inputType="text"
                            label="Street"
                            name="street"
                            value={this.state.addressDetails.street}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your street number"
                            errorMessage="Please enter a valid street number"
                        />
                    </div>
                    <div className="column">
                        <ChildSingleInput
                            inputType="text"
                            label="Suburb"
                            name="suburb"
                            value={this.state.addressDetails.suburb}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your Suburb"
                            errorMessage="Please enter a valid suburb"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <ChildSingleInput
                            inputType="text"
                            label="Post Code"
                            name="postCode"
                            value={this.state.addressDetails.postCode}
                            controlFunc={this.handleChange}
                            maxLength={12}
                            placeholder="Enter a post code"
                            errorMessage="Please enter a valid post code"
                        />
                    </div>
                    <div className="column">
                        <div className="field">
                            <label>Country</label>
                            <Select
                                name="country"
                                options={this.state.countryOptions}
                                selectedOption={this.state.addressDetails.country}
                                controlFunc={this.handleChange}
                                placeholder="Select Country"
                            />
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label>City</label>
                            <Select
                                name="city"
                                options={this.state.cityOptions}
                                selectedOption={this.state.addressDetails.city}
                                controlFunc={this.handleChange}
                                placeholder="Select City"
                            />
                        </div>
                    </div>
                    <div className="column"></div>
                    <div className="column"></div>
                   
                </div>
                <div className="ui sixteen wide column">
                        <button type="button" className="ui teal button" onClick={this.handleUpdate}>Save</button>
                        <button type="button" className="ui button" onClick={()=> this.setState({showEditSection:false})}>Cancel</button>
                </div>

            </div>
        )
    }

    renderDisplay() {
        let address = this.props.profileData.address;

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {address.number} {address.street} {address.suburb} {address.postCode}</p>
                        <p>City: {address.city}</p>
                        <p>Country: {address.country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.handleEdit}><i aria-hidden="true" className="edit icon"></i> Edit</button>
                </div>
            </div>
        )
    }
}



export class Nationality extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            countriesJson: {},
            countryOptions: [],
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: '/util/jsonFiles/countries.json',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                const countries = Object.keys(res).map((x) => ({title:x , value:x}));
                this.setState({countryOptions: countries, countriesJson: res})
            }.bind(this)
        })
    }

    handleUpdate(e){
        
       const data = Object.assign({},this.props.nationalityData);
        data["nationality"] = e.target.value; 
        this.props.saveProfileData(data);
      
    }

    
    render() {
        
        return (
            <div className='ui  three column grid'>
                <div className="row">
                    <div className="column">
                        <div className="field">
                            <Select
                                name="nationality"
                                options={this.state.countryOptions}
                                selectedOption={this.props.nationalityData}
                                controlFunc={this.handleUpdate}
                                placeholder="Select Nationality"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}