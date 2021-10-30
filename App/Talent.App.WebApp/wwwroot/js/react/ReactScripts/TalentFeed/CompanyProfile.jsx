import React from 'react';
import { Card, Grid, Image, Icon } from 'semantic-ui-react';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        let company = this.props.companyDetails;
        let photoUrl;
        
        if (company && company.profilePhotoUrl) {
            photoUrl = company.profilePhotoUrl;
        } else {
            photoUrl = 'https://react.semantic-ui.com/images/wireframe/image.png';
        }
        let location = null;
        let companyContact = company ? company.companyContact : null;
        if (companyContact) {
            if (companyContact.location && (companyContact.location.country || companyContact.location.city)) {
                let loactionStr;
                if (companyContact.location.city) {
                    loactionStr = `${ companyContact.location.city }, ${ companyContact.location.country }`
                    
                } else {
                    loactionStr = companyContact.location.country
                }
                location = <Card.Meta textAlign='center'>
                    < Icon name='marker' />
                    {loactionStr}
                </Card.Meta>
            }
        }
        
        return (
            <Card>
                <Card.Content>
                    <Grid centered>
                        <Grid.Row>
                            <Image
                                style={{ width: '48px', height: '48px' }}
                                circular
                                src={photoUrl}
                                centered
                            />
                        </Grid.Row>
                    </Grid>
                    <Card.Header textAlign='center'>{companyContact ? companyContact.name : ""}</Card.Header>
                    {location}
                    <Card.Description textAlign='center'>
                        {companyContact ? companyContact.description : ""}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Card.Meta>
                        <Icon name='phone' />
                        : {companyContact ? companyContact.phone : ""}
                    </Card.Meta>
                    <Card.Meta>
                        <Icon name='mail' />
                        : {companyContact ? companyContact.email : ""}
                    </Card.Meta>
                </Card.Content>
            </Card>
        )
    };
}