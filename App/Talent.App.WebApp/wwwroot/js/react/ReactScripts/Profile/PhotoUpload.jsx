/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Grid, Icon, Button, Image, Popup } from 'semantic-ui-react';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            profilePhotoUrl: this.props.profilePhotoUrl 
        }
        this.previewFile = this.previewFile.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.uploadProfilePhoto = this.uploadProfilePhoto.bind(this);
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.profilePhotoUrl !== this.props.profilePhotoUrl)
        {
            this.setState({
                profilePhotoUrl: nextProps.profilePhotoUrl
            });
        }
    };

    previewFile(input) {
        
        var file = $("input[type=file]").get(0).files[0];
            this.setState({
                showPreview:true,
            });
            if(file){
                var reader = new FileReader();
     
                reader.onload = function(){
                    $("#previewImg").removeClass('hidden');
                    $("#previewImg").attr("src", reader.result);
                }
                reader.readAsDataURL(file);
            }
    }

    handleImageChange(e) {
        e.preventDefault();
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () =>
        {
            this.setState({
                file: file,
                profilePhotoUrl: reader.result
            });
        }
        reader.readAsDataURL(file);
        this.uploadProfilePhoto();
        
    };

    uploadProfilePhoto(e) {
        
        var cookies = Cookies.get('talentAuthToken');
        var file = $("input[type=file]").get(0).files[0];
        let formData = new FormData()        
        formData.append('file',file);
        
        console.log(formData.get("files"));

        $.ajax({
            // url: 'http://localhost:60290/profile/profile/updateProfilePhoto',
            url: 'https://leo-profileapi.azurewebsites.net/profile/profile/updateProfilePhoto',
            headers: {
                'Authorization': 'Bearer ' + cookies,
            },
            type: "POST",
            processData: false,
			contentType: false,
            data: formData,
            success: function (res) {
                this.setState({
                    showPreview:true
                })
                this.props.updateProfileData();
                TalentUtil.notification.show("Photo uploaeded successfully", "success", null, null)
                
            }.bind(this)
        })
    }

    deleteProfile (id) {
        debugger;
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            // url: 'http://localhost:60290/profile/profile/deleteProfilePhoto',
            url: 'https://leo-profileapi.azurewebsites.net/profile/profile/deleteProfilePhoto',
            type: "POST",
            data: JSON.stringify({ProfilePhoto:id}),
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json; charset=utf-8'
            },
            dataType:'json',
            success: function (res) {
                debugger;
                this.setState({
                    showPreview:false,
                });
                this.props.updateProfileData();
                TalentUtil.notification.show("Photo deleted successfully", "success", null, null)
            }.bind(this)
        })
        
    }

    render() {
        
        let button = null;
        if (this.state.file) {
            button = <div>
                <br/>
                <Button
                    type='reset'
                    compact
                    color='teal'
                    onClick={this.uploadProfilePhoto}
                >
                    <Icon name='upload' />
                    Upload
                </Button>
            </div>
        }

        let imageView;
        if (this.state.profilePhotoUrl) {
            imageView = <Image
                src={this.state.profilePhotoUrl}
                size='medium'
                circular
                style={{ width: '112px', height: '112px' }}
                onClick={() => this.upload.click()}
            />
            
        } else {
            imageView = <Icon
                circular
                type='file'
                size='huge'
                name='camera retro'
                style={{ width: '112px', height: '112px' }}
                onClick={() => this.upload.click()}
            />
        }


        return (<React.Fragment>
            {/* <Grid.Column textAlign='center'>
                <input
                    type="file"
                    ref={(ref) => this.upload = ref}
                    style={{ display: 'none' }}
                    onChange={this.handleImageChange}
                />
                {imageView}
                {button}
            </Grid.Column> */}
            <Grid.Column >
            <input
                    type="file"
                    ref={(ref) => this.upload = ref}
                    style={{ display: 'none' }}
                    onChange={this.handleImageChange}
                />
                <Popup
                trigger={<div>{imageView}</div>}
                content='Click on photo to change'
                
                position='bottom center'
                />
            </Grid.Column>
        </React.Fragment>)
    }
}
