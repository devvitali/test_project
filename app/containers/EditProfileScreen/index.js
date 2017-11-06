import React, { Component } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, Keyboard, ActivityIndicator } from 'react-native';
import I18n from 'react-native-i18n';
import { debounce, map } from 'lodash';
import { connect } from 'react-redux';
import { CachedImage } from 'react-native-cached-image';
import AppContainer from '../AppContainer';
import { DrinkupActions, AuthActions } from '../../redux';
import { Button, PicPhotoSourceDialog, NavItems } from '../../components';
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
  onSelectIcon = icon => this.props.updateProfile({ icon });
  doShowPicDialog = () =>
    openPicker({ width: 512, height: 512, cropping: true })
      .then(this.props.uploadProfilePhoto)
      .catch(this.isNotLoading);
  saveProfile = () => this.props.updateProfile({ firstName: this.state.firstName });
  saveProfileDelayed = debounce(this.saveProfile, 1000);
  completeProfile = () => {
    Keyboard.dismiss();
    const { user, uid, navigation } = this.props;
    const { params } = navigation.state;
    const currentUser = { ...user, uid };
    if (params.type === 'Join') {
      this.props.sendRequestDrinkup(params.bar, currentUser);
      navigation.goBack();
    } else if (params.type === 'Start') {
      this.props.startDrinkup(params.barId, currentUser);
    }
  };

  render() {
    const { user, isProfileComplete, fetching, navigation } = this.props;
    const { routeName } = this.props.navigation.state;
    const { firstName, showPicDialog } = this.state;
    const source = user.photoURL ? { uri: user.photoURL } : avatar;
    const opacity = fetching ? 0.3 : 1.0;
    return (
      <AppContainer
        title={routeName !== 'CompleteProfileScene' ? 'Edit Profile' : 'Complete Profile'}
        renderLeftButton={routeName !== 'CompleteProfileScene' ? NavItems.hamburgerButton(navigation) : NavItems.backButton(navigation)}
      >
        <View style={Styles.mainContainer}>
          <View style={Styles.formContainer}>
            <View style={Styles.selectPhotoContainer}>
              <TouchableOpacity activeOpacity={0.7} onPress={this.doShowPicDialog}>
                <View style={[Styles.photoContainer, { opacity }]}>
                  <CachedImage source={source} style={Styles.photo} />
                </View>
                <View style={Styles.waitingContainer}>
                  <ActivityIndicator size="large" animating={fetching} />
                </View>
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
            {routeName === 'CompleteProfileScene' &&
            <View style={Styles.footer}>
              <Button
                showIndicator={fetching}
                theme={!isProfileComplete ? 'disallow' : 'primary'}
                clickable={isProfileComplete}
                text="Save profile"
                onPress={this.completeProfile}
              />
            </View>
            }
            {(routeName === 'EditProfileScreen' && !isProfileComplete) &&
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
  uid: state.auth.uid,
  isProfileComplete: isProfileComplete(state.auth.profile) && !state.auth.fetching,
});
const mapDispatchToProps = dispatch => ({
  startDrinkup: (barId, user) => dispatch(DrinkupActions.startDrinkup(barId, user)),
  sendRequestDrinkup: (bar, user) => dispatch(DrinkupActions.sendRequestDrinkup(bar, user)),
  updateProfile: diff => dispatch(AuthActions.updateProfile(diff)),
  uploadProfilePhoto: photo => dispatch(AuthActions.uploadProfilePhoto(photo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
