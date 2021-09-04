/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx'

export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addSection: false,
            editSection:false,
            currentSkillId:"",
            skill: {
                name:"",
                level:""
            }
        }
        this.addSkill = this.addSkill.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    addSkill() {
        if(this.state.skill.name ==='' || this.state.skill.level ==='') {
            TalentUtil.notification.show("Skill values are not valid", "error", null, null)
        } else {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/addSkill',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.skill),
            success: function (res) {

                if (res.success == true) {
                    TalentUtil.notification.show("Skill added sucessfully", "success", null, null)
                    this.setState({
                        addSection:false,
                        skill: {
                            name:"",
                            level:""
                        }
                    })
                    this.props.updateProfileData();
                } else {
                    TalentUtil.notification.show("Skill not added", "error", null, null)
                }
                
                
            }.bind(this)
        })
    }
    }

    deleteSkill(skill) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/deleteSkill',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(skill),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Skill deleted sucessfully", "success", null, null)
                    this.props.updateProfileData();              
                } else {
                    TalentUtil.notification.show("Skill did not deleted.", "error", null, null)
                }

            }.bind(this)
        })
    }

    
    handleChange(e){
        
        const data = Object.assign({}, this.state.skill);
        data[e.target.name] = e.target.value
        this.setState({ skill : data })
    }

    render() {
        var levelOptions = [
            { title:"Beginner", value:"Beginner" },
            { title:"Intermediate", value:"Intermediate" },
            { title:"Expert", value:"Expert" },
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
                        value={this.state.skill.name}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Add Skill"
                        errorMessage="Please enter valid skill name"
                        />
                    </div>
                    <div className="column">
                        <div className="field">
                            <Select
                                name="level"
                                options={levelOptions}
                                selectedOption={this.state.skill.level}
                                controlFunc={this.handleChange}
                                placeholder="Select Level"
                            />
                        </div>
                    </div>
                    <div className="column">
                        <button type="button" onClick={()=> this.addSkill()} className="ui teal button">Add</button>
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
                                <th >Skill </th>
                                <th >Level</th>
                                <th className="right aligned" ><button type="button" onClick={()=> this.setState({ addSection: true })} className="ui teal button" ><i aria-hidden="true" className="plus icon"></i> Add New</button></th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.skillData && this.props.skillData.map( skill => <SkillList key={skill.id} skill={skill} deleteSkill={this.deleteSkill} />)}

                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export  class SkillList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            skill: {
                name:"",
                level:""
            },
            editSection:false
        }

        this.handleChange = this.handleChange.bind(this);
        this.updateSkill = this.updateSkill.bind(this);
    }

    componentDidMount(){
        
        this.setState({
            skill: this.props.skill
        });
    }


    handleChange(e){
        const data = Object.assign({}, this.state.skill);
        data[e.target.name] = e.target.value
        this.setState({ skill : data })
    }

    updateSkill() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/updateSkill',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.skill),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Skill updated sucessfully", "success", null, null)
                    this.setState({editSection:false});
                } else {
                    TalentUtil.notification.show("Skill did not update successfully", "error", null, null)
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
                        <td>{this.state.skill.name}</td>
                        <td >{this.state.skill.level}</td>
                        <td className="right aligned">
                                <i onClick={()=> this.setState({editSection:true})} aria-hidden="true" className="pencil icon"></i>
                                <i onClick={()=> this.props.deleteSkill(this.state.skill)}  aria-hidden="true" className="delete icon"></i>
                        </td>
                    </React.Fragment>}
                {
                    this.state.editSection &&
                    <React.Fragment>
                        <td>
                            <ChildSingleInput
                                inputType="text"
                                name="name"
                                value={this.state.skill.name}
                                controlFunc={this.handleChange}
                                maxLength={80}
                                placeholder="Add Skill"
                                errorMessage="Please enter valid Skill name"
                                />
                        </td>
                        <td>
                        <Select
                                name="level"
                                options={levelOptions}
                                selectedOption={this.state.skill.level}
                                controlFunc={this.handleChange}
                                placeholder="Select Experience Level"
                            />
                        </td>
                        <td className="right aligned" >
                            <button type="button" onClick={() => this.updateSkill()} className="ui blue basic button">Update </button>
                            <button onClick={()=> this.setState({editSection:false})} className="ui red basic button">Cancel</button>
                        </td>

                    </React.Fragment>
                }
                
             
                
            
            </tr>
            
        );
    }
}