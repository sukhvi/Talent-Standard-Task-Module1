/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx'

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addSection: false,
            editSection:false,
            currentLanguageId:"",
            language: {
                name:"",
                level:""
            }
        }
        this.addLanguage = this.addLanguage.bind(this);
        this.deleteLanguage = this.deleteLanguage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addLanguageSection = this.addLanguageSection.bind(this);

    }

    addLanguage() {
        
        if(this.state.language.name == '' || this.state.language.level == '') {
            TalentUtil.notification.show("Please enter Language values", "error", null, null)
        }
        else {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://leo-profileapi.azurewebsites.net/profile/profile/addLanguage',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.language),
            success: function (res) {

                if (res.success == true) {
                    TalentUtil.notification.show("Language added sucessfully", "success", null, null)
                    this.setState({
                        addSection:false,
                        language: {
                            name:"",
                            level:""
                        }
                    })
                    this.props.updateProfileData();
                } else {
                    TalentUtil.notification.show("Language not added", "error", null, null)
                }
                
                
            }.bind(this)
        })
    }
    }

    deleteLanguage(language) {
        
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://leo-profileapi.azurewebsites.net/profile/profile/deletelanguage',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(language),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Language deleted sucessfully", "success", null, null)
                    this.props.updateProfileData();              
                } else {
                    TalentUtil.notification.show("Language did not deleted.", "error", null, null)
                }

            }.bind(this)
        })
    }

    
    handleChange(e){
        const data = Object.assign({}, this.state.language);
        data[e.target.name] = e.target.value
        this.setState({ language : data })
    }

    addLanguageSection(value) {        
        var language = Object.assign({}, this.state.language);
        language.level = "Basic";
        this.setState({ language : language, addSection:true });        
    }

    render() {
        var levelOptions = [
            { title:"Basic", value:"Basic" },
            { title:"Conversational", value:"Conversational" },
            { title:"Fluent", value:"Fluent" },
            { title:"Native/Bilingual", value:"Native" },
        ];

        return (
            <div className='ui  sixteen  column wide'>
            {
                this.state.addSection && <div className="ui three column grid" style={{paddingBottom:'15px'}}>
                <div className="row">
                <div className="column">
                        <ChildSingleInput
                        inputType="text"
                        name="name"
                        value={this.state.language.name}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder=""
                        errorMessage="Please enter valid language name"
                        />
                    </div>
                    <div className="column">
                        <div className="field">
                            <Select
                                name="level"
                                options={levelOptions}
                                selectedOption={this.state.language.level}
                                controlFunc={this.handleChange}
                            />
                        </div>
                    </div>
                    <div className="column">
                        <button type="button" onClick={()=> this.addLanguage()} className="ui teal button">Add</button>
                        <button type="button" onClick={()=> this.setState({ addSection: false})} className="ui button">Cancel</button>
                    </div>
                </div>
            </div>
            }
            <div className='ui  sixteen  column wide'>
                <div className="row">                    
                    <div className="column">
                    <table className="ui  table">
                        <thead>
                            <tr>
                                <th >Language</th>
                                <th >Level</th>
                                <th className="right aligned" ><button type="button" onClick={()=> this.addLanguageSection(true)} className="ui teal button" ><i aria-hidden="true" className="plus icon"></i> Add New</button></th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.languageData && this.props.languageData.map( language => <LanguageList key={language.id} language={language} deleteLanguage={this.deleteLanguage} />)}

                        </tbody>
                        </table>
                    </div>
                </div> 
            </div>
            </div>
        )
    }
}

export  class LanguageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: {
                name:"",
                level:""
            },
            editSection:false
        }

        this.handleChange = this.handleChange.bind(this);
        this.updateLanguage = this.updateLanguage.bind(this);
    }

    componentDidMount(){
        
        this.setState({
            language: this.props.language
        });
    }


    handleChange(e){
        const data = Object.assign({}, this.state.language);
        data[e.target.name] = e.target.value
        this.setState({ language : data })
    }

    updateLanguage() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://leo-profileapi.azurewebsites.net/profile/profile/updateLanguage',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.language),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Language updated sucessfully", "success", null, null)
                    this.setState({editSection:false});
                } else {
                    TalentUtil.notification.show("Language did not update successfully", "error", null, null)
                }
            }.bind(this)
        })
    }



    render() {
        
        var levelOptions = [
            { title:"Basic", value:"Basic" },
            { title:"Conversational", value:"Conversational" },
            { title:"Fluent", value:"Fluent" },
            { title:"Native/Bilingual", value:"Native" },
        ];
        return (
            <tr key={this.props.id}>
                { !this.state.editSection && 
                    <React.Fragment>
                        <td>{this.state.language.name}</td>
                        <td >{this.state.language.level}</td>
                        <td className="right aligned">
                                <i onClick={()=> this.setState({editSection:true})} aria-hidden="true" className="pencil icon"></i>
                                <i onClick={()=> this.props.deleteLanguage(this.state.language)}  aria-hidden="true" className="delete icon"></i>
                        </td>
                    </React.Fragment>}
                {
                    this.state.editSection &&
                    <React.Fragment>
                        <td>
                            <ChildSingleInput
                                inputType="text"
                                name="name"
                                value={this.state.language.name}
                                controlFunc={this.handleChange}
                                maxLength={80}
                                placeholder="Add language name"
                                errorMessage="Please enter valid language name"
                                />
                        </td>
                        <td>
                        <Select
                                name="level"
                                options={levelOptions}
                                selectedOption={this.state.language.level}
                                controlFunc={this.handleChange}
                                
                            />
                        </td>
                        <td className="right aligned" >
                            <button type="button" onClick={() => this.updateLanguage()} className="ui blue basic button">Update </button>
                            <button onClick={()=> this.setState({editSection:false})} className="ui red basic button">Cancel</button>
                        </td>

                    </React.Fragment>
                }
                
             
                
            
            </tr>
            
        );
    }
}