import {Platform, StyleSheet} from 'react-native';
import * as defaultStyle from '../style';
import platformStyles from './platform-style';
import {screenAspectRatio, screenHeight, screenWidth} from '../expandableCalendar/commons';

const STYLESHEET_ID = 'stylesheet.agenda.main';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  const {knob, weekdays} = platformStyles(appStyle);

  let isTablet = Platform.isPad || (screenAspectRatio < 1.6 && Math.max(screenWidth, screenHeight) >= 900);

  return StyleSheet.create({
    knob,
    weekdays,
    header: {
      overflow: 'hidden',
      justifyContent: 'flex-end',
      position: 'absolute',
      height: '100%',
      width: '100%',
      paddingTop: 14
    },
    knobContainer: {
      flex: 1,
      position: 'absolute',
      left: 0,
      right: 0,
      height: 24,
      bottom: 0,
      alignItems: 'center',
      backgroundColor: appStyle.calendarBackground
    },
    weekday: {
      width: 32,
      textAlign: 'center',
      color: appStyle.textSectionTitleColor,
      fontSize: appStyle.textDayHeaderFontSize,
      fontFamily: appStyle.textDayHeaderFontFamily,
      fontWeight: appStyle.textDayHeaderFontWeight
    },
    reservations: {
      flex: 1,
      marginTop: 140,
      backgroundColor: appStyle.backgroundColor
    },
    todayButtonContainer: {
      alignItems: appStyle && appStyle.todayButtonPosition === 'right' ? 'flex-end' : 'flex-start',
      position: 'absolute',
      left: 20,
      right: 20,
      bottom : 0,
      width: 80,
    },
    todayButton: {
      height: isTablet ? 40 : 28,
      paddingHorizontal: isTablet ? 20 : 12,
      borderRadius: isTablet ? 20 : 14,
      flexDirection: appStyle.todayButtonPosition === 'right' ? 'row-reverse' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      ...Platform.select({
        ios: {
          shadowColor: '#79838A',
          shadowOpacity: 0.3,
          shadowRadius: 14,
          shadowOffset: {height: 6, width: 0}
        },
        android: {
          elevation: 6
        }
      })
    },
    todayButtonText: {
      color: appStyle.todayButtonTextColor,
      fontSize: isTablet ? appStyle.todayButtonFontSize + 2 : appStyle.todayButtonFontSize,
      fontWeight: appStyle.todayButtonFontWeight,
      fontFamily: appStyle.todayButtonFontFamily
    },
    todayButtonImage: {
      tintColor: appStyle.todayButtonTextColor,
      marginLeft: appStyle.todayButtonPosition === 'right' ? 7 : undefined,
      marginRight: appStyle.todayButtonPosition === 'right' ? undefined : 7
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
