import React, { Component } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import I18n from 'react-native-i18n';
import { debounce, map } from 'lodash';
import AppContainer from '../AppContainer';
import { Connect } from '../../redux';
import { PicPhotoSourceDialog, NavItems } from '../../components';
import { openPicker } from '../../utils/photoUtils';
import { isProfileComplete } from '../../utils/auth';
import { Colors, DrinkIcons } from '../../themes';
import Styles from './styles';

const avatar = require('../../images/avatar-dark.png');

class EditProfileScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: props.user.firstName,
      showPicDialog: false,
    };
  }

  onFirstNameChange = e => this.setState({ firstName: e.nativeEvent.text });
  onSelectIcon = icon => this.props.actions.updateProfile({ icon });
  doShowPicDialog = () => {
    const { uploadProfilePhoto } = this.props.actions;
    const opts = { width: 512, height: 512, cropping: true };
    openPicker(opts)
      .then(uploadProfilePhoto)
      .catch(this.isNotLoading);
  };
  saveProfile = () => {
    const { updateProfile } = this.props.actions;
    const { firstName } = this.state;
    updateProfile({ firstName });
  };
  saveProfileDelayed = debounce(this.saveProfile, 1000);
  doCompleteOnboarding = () => {
    this.props.actions.updateProfile({
      onboardingComplete: true,
    });
    this.props.navigation.navigate('DrawerNavigation');
  };

  render() {
    const { user, isProfileComplete, fetching, navigation } = this.props;
    const { routeName } = this.props.navigation.state;
    const { firstName, showPicDialog } = this.state;
    const opacity = fetching ? 0.3 : 1.0;
    const source = user.photoURL ? { uri: user.photoURL } : avatar;
    return (
      <AppContainer
        title={routeName !== 'CompleteProfileScene' ? 'Edit Profile' : 'Complete Profile'}
        renderLeftButton={routeName !== 'CompleteProfileScene' ? NavItems.hamburgerButton(navigation) : NavItems.backButton(navigation)}
      >
        <View style={Styles.mainContainer}>
          <View style={Styles.formContainer}>
            <View style={Styles.selectPhotoContainer}>
              <TouchableOpacity activeOpacity={0.7} onPress={this.doShowPicDialog}>
                <Image
                  source={source}
                  onLoadStart={this.isLoading}
                  onLoadEnd={this.isNotLoading}
                  style={[Styles.photo, { opacity }]}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={this.doChoosePhoto}>
                <Text style={Styles.updatePhoto}>{I18n.t('Profile_TapToAddPhoto').toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
            <View style={[Styles.labelContainer, { borderBottomWidth: 1 }]}>
              <Text style={Styles.label}>{I18n.t('Profile_FirstName')}</Text>
              <TextInput
                style={Styles.input}
                value={firstName}
                autoCorrect={false}
                maxLength={15}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                onChange={this.onFirstNameChange}
                onChangeText={this.saveProfileDelayed}
                underlineColorAndroid={Colors.transparent}
                selectionColor={Colors.brand.clear.orange}
              />
            </View>
            <View style={Styles.spacer} />
            <View style={Styles.labelContainer}>
              <Text style={Styles.label}>{I18n.t('Profile_FavoriteDrink')}</Text>
            </View>
            <View style={Styles.iconContainer}>
              {map(DrinkIcons, (img, icon) => (
                <TouchableOpacity
                  key={icon}
                  activeOpacity={0.7}
                  onPress={this.onSelectIcon.bind(null, icon)}
                  style={Styles.iconButton}
                >
                  <Image
                    source={img}
                    style={[Styles.drinkIcon, {
                      width: 64,
                      height: 64,
                      opacity: icon === user.icon ? 1.0 : 0.4,
                    }]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {!isProfileComplete &&
            <View style={Styles.footer}>
              <Text style={Styles.incompleteProfileText}>{I18n.t('Profile_IncompleteWarning')}</Text>
            </View>
            }
          </View>
          {showPicDialog &&
            <PicPhotoSourceDialog
              visible={showPicDialog}
              onClose={() => this.setState({ showPicDialog: false })}
              onUsePhotosPress={this.doSelectPhoto('Picker')}
              onUseCameraPress={this.doSelectPhoto('Camera')}
            />
          }
        </View>
      </AppContainer>
    );
  }
}

const mapStateToProps = state => ({
  fetching: state.auth.fetching,
  user: state.auth.profile,
  isProfileComplete: isProfileComplete(state.auth.profile) && !state.auth.fetching,
});

export default Connect(EditProfileScreen, mapStateToProps);
