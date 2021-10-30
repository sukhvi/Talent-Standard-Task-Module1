import React from 'react';
import { Card, List, Image, Button, Icon } from 'semantic-ui-react';

export default class FollowingSuggestion extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickFollow = this.handleClickFollow.bind(this);
    };

    handleClickFollow(talent) {
        console.log("Follow talent: ", talent);
    };

    render() {
        let users = [
            { name: "Jenny", photo: "http://semantic-ui.com/images/avatar/small/jenny.jpg" },
            { name: "Tom", photo: "http://semantic-ui.com/images/avatar/small/tom.jpg" },
            { name: "Christian", photo: "http://semantic-ui.com/images/avatar/small/christian.jpg" },
            { name: "Matt", photo: "http://semantic-ui.com/images/avatar/small/matt.jpg" }
        ];
        return (
            <Card>
                <Card.Content>
                    <Card.Header textAlign='center'>Follow Talent</Card.Header>
                    <Card.Description>
                        <List>
                            {
                                users.map((value, index) => <List.Item key={index}>
                                        <Image circular src={value.photo} />
                                        <List.Content>
                                        <List.Header>{value.name}</List.Header>
                                        <Button
                                            basic
                                            color='blue'
                                            onClick={() => this.handleClickFollow(value)}
                                        >
                                                <Icon name='user' />
                                                Follow
                                            </Button>
                                        </List.Content>
                                    </List.Item>
                                )
                            }
                        </List>
                    </Card.Description>
                </Card.Content>
            </Card>
            
        )
    }
}