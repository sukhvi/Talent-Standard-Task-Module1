import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Card, Grid, Icon, List, Button, Image, Header, Embed } from 'semantic-ui-react'


export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: false
        };
        this.handleClickIcon = this.handleClickIcon.bind(this);
        this.getIcondState = this.getIcondState.bind(this);
    };

    handleClickIcon(name) {
        if (!this.getIcondState(name)) return;
        switch (name) {
            case "user":
                this.setState({ detail: true });
                break;
            case "video":
                this.setState({ detail: false });
                break;
            case "linkedin":
                window.open(this.props.talent.linkedAccounts.linkedIn, "_blank")
                break;
            case "github":
                window.open(this.props.talent.linkedAccounts.github, "_blank")
                break;
            default:
                break;
        }
    };

    getIcondState(icon) {
        switch (icon) {
            case "file pdf outline":
                return this.props.talent.cvUrl != ""
                    && this.props.talent.cvUrl != null
                    && this.props.talent.cvUrl != undefined
                break;
            case "linkedin":
                return this.props.talent.linkedAccounts.linkedIn != ""
                    && this.props.talent.linkedAccounts.linkedIn != null
                    && this.props.talent.linkedAccounts.linkedIn != undefined
                break; 
            case "github":
                return this.props.talent.linkedAccounts.github != ""
                    && this.props.talent.linkedAccounts.github != null
                    && this.props.talent.linkedAccounts.github != undefined
                break;
            default:
                return true;
                break;
        }
    }
    
    render() {
        let talentDetail, icons;
        let photoUrl = this.props.talent.photoId ? this.props.talent.photoId : 'https://react.semantic-ui.com/images/avatar/large/matthew.png';
        if (this.state.detail) {
            icons = ["video", "file pdf outline", "linkedin", "github"];
            talentDetail = <Grid>
                <Grid.Column width={8}>
                    <Image
                        src={photoUrl}
                        wrapped
                    />
                </Grid.Column>
                <Grid.Column width={8}>
                    <div><strong>Talent snapshot</strong></div>
                    <br />
                    <div>CURRENT EMPLOYER</div>
                    <div>{this.props.talent.currentEmployment ? this.props.talent.currentEmployment.company : ""}</div>
                    <br />
                    <div className="field">
                        <div>VISA STATUS</div>
                        <div>{this.props.talent.visa}</div>
                    </div>
                    <br />
                    <div className="field">
                        <div>POSITION</div>
                        <div>{this.props.talent.currentEmployment ? this.props.talent.currentEmployment.position : ""}</div>
                    </div>
                </Grid.Column>
            </Grid>
        } else {
            icons = ["user", "file pdf outline", "linkedin", "github"];
            let active = this.props.talent.videoUrl != '' && this.props.talent.videoUrl != null && this.props.talent.videoUrl != undefined;
            talentDetail = <Embed
                placeholder='https://react.semantic-ui.com/images/wireframe/image.png'
                active={active}
                url={this.props.talent.videoUrl}
            />
        }

        let skills = null;
        if (this.props.talent.skills && this.props.talent.skills.length) {
            skills = <Card.Content extra>
                <List horizontal>
                    {
                        this.props.talent.skills.map((value, index) => {
                            if (value && value != "") {
                                return <List.Item key={index}>
                                    <Button basic compact color='blue'>
                                        {value}
                                    </Button>
                                </List.Item>
                            }
                        })
                    }
                </List>
            </Card.Content>
        }

        return (
            <Card fluid>
                <Card.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={14}>
                                <Card.Header><b>{this.props.talent.name}</b></Card.Header>
                            </Grid.Column>
                            <Grid.Column width={2} textAlign='left'>
                                <Icon size='big' name='star' />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
                <Card.Content>
                    {talentDetail}
                </Card.Content>
                <Card.Content>
                    <Grid textAlign='center' columns={4}>
                        <Grid.Row>
                            {
                                icons.map((value, index) => <Grid.Column key={index}>
                                    <Icon
                                        size='large'
                                        name={value}
                                        disabled={!this.getIcondState(value)}
                                        onClick={() => this.handleClickIcon(value)}
                                    />
                                </Grid.Column>)
                            }
                        </Grid.Row>
                    </Grid>
                </Card.Content>
                {skills}
            </Card>
        )
    }
}